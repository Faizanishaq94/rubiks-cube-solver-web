import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Cpu, ListOrdered } from 'lucide-react';
import RubiksCubeAnimation from '@/components/cube/RubiksCubeAnimation';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: Camera,
    title: 'Photograph each face',
    description:
      'Take one photo per face of your cube — 6 photos total. Good lighting and a straight-on angle give the best results.',
  },
  {
    icon: Cpu,
    title: 'We solve it',
    description:
      "Our solver analyses the sticker colours from your photos and computes an optimal move sequence using Kociemba's algorithm.",
  },
  {
    icon: ListOrdered,
    title: 'Follow the moves',
    description:
      'Receive a step-by-step solution in standard WCA notation. Follow along and your cube will be solved.',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight text-foreground">
            <span className="text-primary">Cube</span>Solver
          </span>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 py-24 md:flex-row md:py-32">
          <div className="flex flex-1 flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Free to use — no credit card required
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Solve your{' '}
              <span className="text-primary">Rubik&apos;s Cube</span>
              <br />
              in seconds
            </h1>

            <p className="max-w-md text-lg text-muted">
              Upload a photo of each face. We&apos;ll analyse the colours and
              give you the exact moves to solve it — every time.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/auth/signup">
                  Start solving <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth/login">Log in</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="absolute h-56 w-56 rounded-full bg-primary/20 blur-3xl"
              />
              <RubiksCubeAnimation className="relative z-10" />
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="border-t border-border bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How it works
              </h2>
              <p className="mt-2 text-muted">Three steps from scrambled to solved.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="rounded-lg bg-surface-2 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA strip ─────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to solve?
            </h2>
            <p className="mt-3 text-muted">
              Create a free account and submit your first cube.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/auth/signup">
                Get started for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CubeSolver.
        </div>
      </footer>
    </div>
  );
}
