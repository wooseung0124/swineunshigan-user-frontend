import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/api';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore';
import LoginRequiredModal from '../components/common/LoginRequiredModal';
import ScheduleCard from '../components/schedule/ScheduleCard';
import Toast from '../components/common/Toast';
import DeleteConfirmModal from '../components/schedule/DeleteConfirmModal';

export default function SchedulePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [roleTab, setRoleTab] = useState('CREATOR');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [toast, setToast] = useState(location.state?.toast || null);

  // 편집(삭제) 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [selectingIds, setSelectingIds] = useState(new Set()); // ○ 단계 (한 번 클릭)
  const [selectedIds, setSelectedIds] = useState(new Set());   // ✓ 단계 (두 번 클릭)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.toast) {
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const loadList = () => {
    setLoading(true);
    return api.schedules.list()
      .then(data => { setSchedules(data || []); })
      .catch(err => { console.error('[SchedulePage] list 실패', err); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    let alive = true;
    api.schedules.list()
      .then(data => { if (alive) setSchedules(data || []); })
      .catch(err => { console.error('[SchedulePage] list 실패', err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
    color: isActive ? '#000' : '#999',
    fontSize: '15px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  const chipStyle = (isActive) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: isActive ? '2px solid #A8DC4F' : '1px solid #ddd',
    background: isActive ? '#A8DC4F20' : '#fff',
    color: isActive ? '#5DA80E' : '#666',
    fontSize: '13px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  const filtered = schedules.filter(s => {
    if (s.hiddenByCreator) return false;        // ← 숨긴 일정은 목록에서 제외
    if (s.myRole !== roleTab) return false;
    if (s.status === 'COMPLETED') return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const isSelectable = (s) => s.status === 'CANCELED';

  // 카드 클릭: 편집 모드면 2단계(○→✓→해제), 아니면 상세 이동
  const handleCardClick = (s) => {
    if (editMode) {
      if (!isSelectable(s)) return; // 취소됨 아니면 무반응

      const inSelecting = selectingIds.has(s.id);
      const inSelected = selectedIds.has(s.id);

      if (!inSelecting && !inSelected) {
        // 1단계: 또렷 + ○
        setSelectingIds(prev => new Set(prev).add(s.id));
      } else if (inSelecting && !inSelected) {
        // 2단계: ○ → ✓
        setSelectingIds(prev => { const n = new Set(prev); n.delete(s.id); return n; });
        setSelectedIds(prev => new Set(prev).add(s.id));
      } else {
        // ✓ 상태에서 다시 누르면 해제 (원위치)
        setSelectedIds(prev => { const n = new Set(prev); n.delete(s.id); return n; });
      }
      return;
    }
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    navigate(`/schedule/${s.id}`);
  };

  const enterEditMode = () => {
    setEditMode(true);
    setSelectingIds(new Set());
    setSelectedIds(new Set());
  };

  const exitEditMode = () => {
    setEditMode(false);
    setSelectingIds(new Set());
    setSelectedIds(new Set());
  };

  // 삭제 실행: ✓ 확정된 것만 (selectedIds)
  const handleDelete = async () => {
    const ids = [...selectedIds];
    try {
      await Promise.all(ids.map(id => api.schedules.remove(id)));
      setDeleteModalOpen(false);
      exitEditMode();
      await loadList();
      setToast(`${ids.length}개의 일정을 삭제했습니다`);
    } catch (err) {
      console.error('[SchedulePage] 삭제 실패', err);
      setDeleteModalOpen(false);
    }
  };

  // 삭제 버튼 활성 = ✓ 확정된 게 하나라도 있을 때
  const deleteEnabled = selectedIds.size > 0;

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000', textAlign: 'center' }}>일정</h1>
      </div>

      {/* 상단 탭 + 편집/삭제 */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <button onClick={() => setRoleTab('CREATOR')} style={tabStyle(roleTab === 'CREATOR')}>개설자</button>
        <button onClick={() => setRoleTab('PARTICIPANT')} style={tabStyle(roleTab === 'PARTICIPANT')}>참여자</button>
        {roleTab === 'CREATOR' ? (
          editMode ? (
            <button
              onClick={() => deleteEnabled && setDeleteModalOpen(true)}
              style={{
                padding: '12px 16px', background: 'transparent', border: 'none',
                color: deleteEnabled ? '#ff3b30' : '#ffb3ae',
                fontSize: '14px', fontWeight: '700',
                cursor: deleteEnabled ? 'pointer' : 'default', whiteSpace: 'nowrap',
              }}
            >
              삭제
            </button>
          ) : (
            <button
              onClick={enterEditMode}
              style={{
                padding: '12px 16px', background: 'transparent', border: 'none',
                color: '#666', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              편집
            </button>
          )
        ) : null}
      </div>

      {/* 편집 모드 안내 바 */}
      {editMode && (
        <div style={{
          padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: '#666' }}>
            삭제할 취소된 일정을 선택하세요
          </span>
          <button onClick={exitEditMode} style={{
            background: 'transparent', border: 'none', color: '#888',
            fontSize: '13px', cursor: 'pointer',
          }}>완료</button>
        </div>
      )}

      {/* 현황 필터 */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setStatusFilter('all')} style={chipStyle(statusFilter === 'all')}>전체</button>
        <button onClick={() => setStatusFilter('PENDING')} style={chipStyle(statusFilter === 'PENDING')}>모집중</button>
        <button onClick={() => setStatusFilter('CANCELED')} style={chipStyle(statusFilter === 'CANCELED')}>취소됨</button>
      </div>

      {/* 일정 리스트 */}
      <div style={{ padding: '0 16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '14px' }}>
            일정이 없습니다.
          </div>
        ) : (
          filtered.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onClick={() => handleCardClick(schedule)}
              editMode={editMode}
              selectable={isSelectable(schedule)}
              selecting={selectingIds.has(schedule.id)}
              selected={selectedIds.has(schedule.id)}
            />
          ))
        )}
      </div>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <Toast
        message={toast}
        open={!!toast}
        onDone={() => setToast(null)}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        count={selectedIds.size}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}