import { useEffect } from 'react';
import BottomNav from './BottomNav';
import './Layout.css';

export default function Layout({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('app-route');

    return () => {
      document.documentElement.classList.remove('app-route');
    };
  }, []);

  return (
    <div className="app-layout">
      <main className="app-layout__main">{children}</main>
      <BottomNav />
    </div>
  );
}
