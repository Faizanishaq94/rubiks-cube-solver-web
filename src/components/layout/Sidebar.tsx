import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  RotateCcw,
  ClipboardList,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',         icon: LayoutDashboard },
  { label: 'Solve a Cube', href: '/submit/rubiks-cube', icon: RotateCcw      },
  { label: 'My Jobs',      href: '/jobs',              icon: ClipboardList   },
  { label: 'Account',      href: '/account',           icon: UserCircle      },
] as const;

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex w-60 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/dashboard" className="text-lg font-bold tracking-tight">
          <span className="text-primary">Cube</span>
          <span className="text-foreground">Solver</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-surface-2 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        v0.1.0 — beta
      </div>
    </aside>
  );
}
