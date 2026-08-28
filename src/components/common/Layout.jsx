import BottomNav from './BottomNav';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <main className="app-layout__main">{children}</main>
      <BottomNav />
    </div>
  );
}
