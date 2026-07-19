import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
          <User className="h-3.5 w-3.5" />
        </div>
        <span className="hidden text-muted sm:block">
          {user.firstName} {user.lastName}
        </span>
      </div>

      <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
