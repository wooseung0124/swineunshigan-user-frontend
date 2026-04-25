import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}