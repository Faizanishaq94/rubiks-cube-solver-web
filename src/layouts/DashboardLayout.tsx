import { Outlet } from 'react-router-dom';
import AuthGuard from '@/components/layout/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import UserMenu from '@/components/layout/UserMenu';

export default function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-border px-6">
            <UserMenu />
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
