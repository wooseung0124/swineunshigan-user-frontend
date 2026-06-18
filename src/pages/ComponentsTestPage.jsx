import { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

// 공통 컴포넌트 시각 검증 페이지 (개발 전용)
// 라우트: /components-test

const sectionStyle = {
  marginBottom: 'var(--spacing-8)',
};

const sectionTitleStyle = {
  fontSize: 'var(--font-size-heading-3)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  marginBottom: 'var(--spacing-4)',
  paddingBottom: 'var(--spacing-2)',
  borderBottom: '2px solid var(--color-primary)',
};

const labelStyle = {
  fontSize: 'var(--font-size-body-sm)',
  color: 'var(--color-text-gray)',
  marginBottom: 'var(--spacing-2)',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-4)',
  alignItems: 'center',
  marginBottom: 'var(--spacing-5)',
};

const colStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
  marginBottom: 'var(--spacing-5)',
};

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
};

const VARIANTS = ['primary', 'secondary', 'ghost'];
const SIZES = ['sm', 'md', 'lg'];

export default function ComponentsTestPage() {
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('잘못된 값');
  const [pwd, setPwd] = useState('');
  const [search, setSearch] = useState('');
  const [disabledVal] = useState('수정 불가');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      padding: 'var(--spacing-6)',
      color: 'var(--color-text)',
      fontFamily: 'inherit',
    }}>
      <h1 style={{
        fontSize: 'var(--font-size-heading-1)',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-2)',
      }}>
        공통 컴포넌트 테스트
      </h1>
      <p style={{
        fontSize: 'var(--font-size-body-sm)',
        color: 'var(--color-text-gray)',
        marginBottom: 'var(--spacing-8)',
      }}>
        Button / Input / Card · 개발 전용 페이지
      </p>

      {/* ============== Button ============== */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Button</h2>

        {/* 9가지 조합 (3 variants × 3 sizes) */}
        {VARIANTS.map(variant => (
          <div key={variant} style={groupStyle}>
            <div style={labelStyle}>
              variant=<code>"{variant}"</code>
            </div>
            <div style={rowStyle}>
              {SIZES.map(size => (
                <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-light-gray)' }}>
                    size="{size}"
                  </span>
                  <Button
                    variant={variant}
                    size={size}
                    onClick={() => console.log(`${variant}/${size} clicked`)}
                  >
                    버튼 {size}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* disabled 상태 */}
        <div style={groupStyle}>
          <div style={labelStyle}>disabled=<code>true</code></div>
          <div style={rowStyle}>
            {VARIANTS.map(variant => (
              <Button key={variant} variant={variant} size="md" disabled>
                {variant} disabled
              </Button>
            ))}
          </div>
        </div>

        {/* type=submit */}
        <div style={groupStyle}>
          <div style={labelStyle}>type=<code>"submit"</code> (form 안에서 동작)</div>
          <div style={rowStyle}>
            <Button type="submit">제출 버튼</Button>
          </div>
        </div>
      </section>

      {/* ============== Input ============== */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Input</h2>

        <div style={colStyle}>
          <div style={groupStyle}>
            <div style={labelStyle}>type=<code>"text"</code></div>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="이름을 입력하세요"
              name="text-demo"
            />
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>type=<code>"password"</code></div>
            <Input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="비밀번호"
              name="pwd-demo"
            />
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>type=<code>"search"</code></div>
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색어"
              name="search-demo"
            />
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>error=<code>true</code></div>
            <Input
              type="text"
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              placeholder="에러 상태"
              error
              name="error-demo"
            />
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>disabled=<code>true</code></div>
            <Input
              type="text"
              value={disabledVal}
              onChange={() => {}}
              placeholder="수정 불가"
              disabled
              name="disabled-demo"
            />
          </div>
        </div>
      </section>

      {/* ============== Card ============== */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Card</h2>

        <div style={{ ...colStyle, maxWidth: '480px' }}>
          <div style={groupStyle}>
            <div style={labelStyle}>padding=<code>"sm"</code></div>
            <Card padding="sm">
              <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-1)' }}>
                작은 패딩 카드
              </div>
              <div style={{ fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)' }}>
                padding sm 적용된 카드입니다.
              </div>
            </Card>
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>padding=<code>"md"</code> (default)</div>
            <Card>
              <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-1)' }}>
                기본 패딩 카드
              </div>
              <div style={{ fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)' }}>
                padding 미지정 시 md가 적용됩니다.
              </div>
            </Card>
          </div>

          <div style={groupStyle}>
            <div style={labelStyle}>padding=<code>"lg"</code> + onClick (hover 동작)</div>
            <Card padding="lg" onClick={() => alert('카드 클릭됨')}>
              <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-1)' }}>
                클릭 가능한 카드
              </div>
              <div style={{ fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)' }}>
                마우스를 올려보세요 (그림자 강조 + 살짝 위로).
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
