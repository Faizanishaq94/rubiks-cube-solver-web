import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyPage() {
  const confirmSignUp = useAuthStore((state) => state.confirmSignUp);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmSignUp(email, code);
      navigate('/auth/login');
    }
    catch {
      setError('Invalid or expired code. Please try again.');
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Cube</span>
            <span className="text-foreground">Solver</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Check your email</h1>
          <p className="mt-1 text-sm text-muted">
            We sent a 6-digit verification code to your email address.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {email && (
              <p className="text-center text-sm text-muted">
                Code sent to <span className="font-medium text-foreground">{email}</span>
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                autoComplete="one-time-code"
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Verifying…' : 'Verify email'}
            </Button>

            <p className="text-center text-sm text-muted">
              Already verified?{' '}
              <Link
                to="/auth/login"
                className="text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
