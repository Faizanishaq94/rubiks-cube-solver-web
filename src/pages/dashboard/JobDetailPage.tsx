import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import JobStatusBadge from '@/components/jobs/JobStatusBadge';
import { Button } from '@/components/ui/button';
import { jobApi } from '@/lib/jobApi';
import type { Job, RubiksCubeResult } from '@/types';

const TERMINAL_STATUSES = new Set<Job['status']>(['succeeded', 'failed']);
const POLL_INTERVAL_MS = 5_000;

// ─── Cube net constants ───────────────────────────────────────────────────────

const TILE = 22;
const TILE_GAP = 2;
const FACE_GAP = 4;
const FACE_SIZE = 3 * TILE + 2 * TILE_GAP;

const KOCIEMBA_SLICE: Record<string, [number, number]> = {
  top:    [0,  9],
  right:  [9,  18],
  front:  [18, 27],
  bottom: [27, 36],
  left:   [36, 45],
  back:   [45, 54],
};

const TILE_COLORS: Record<string, string> = {
  U: '#e4e4e7',
  R: '#b71234',
  F: '#009b48',
  D: '#ffd500',
  L: '#ff5800',
  B: '#0046ad',
};

const MIDDLE_ROW = ['left', 'front', 'right', 'back'] as const;

// ─── Mock result (remove when backend is ready) ───────────────────────────────

function getMockResult(): RubiksCubeResult {
  return {
    moves: ["U", "R'", "F2", "D", "L", "B'", "U2", "R", "F", "D'"],
    moveCount: 10,
    notation: "U R' F2 D L B' U2 R F D'",
    cubeState: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB',
  };
}

// ─── Cube net visualiser ──────────────────────────────────────────────────────

function CubeNetResult({ cubeState }: { cubeState: string }) {
  function renderFace(key: string) {
    const [start, end] = KOCIEMBA_SLICE[key];
    const tiles = cubeState.slice(start, end).split('');
    return (
      <div
        key={key}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${TILE}px)`,
          gridTemplateRows: `repeat(3, ${TILE}px)`,
          gap: TILE_GAP,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {tiles.map((char, i) => (
          <div
            key={i}
            style={{ backgroundColor: TILE_COLORS[char] ?? '#555', borderRadius: 2 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex flex-col" style={{ gap: FACE_GAP }}>
        <div className="flex" style={{ marginLeft: FACE_SIZE + FACE_GAP }}>
          {renderFace('top')}
        </div>
        <div className="flex" style={{ gap: FACE_GAP }}>
          {MIDDLE_ROW.map(renderFace)}
        </div>
        <div className="flex" style={{ marginLeft: FACE_SIZE + FACE_GAP }}>
          {renderFace('bottom')}
        </div>
      </div>
    </div>
  );
}

// ─── Solution panel ───────────────────────────────────────────────────────────

function SolutionPanel({
  result,
  copied,
  onCopy,
}: {
  result: RubiksCubeResult;
  copied: boolean;
  onCopy: (notation: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <div>
          <p className="font-medium text-foreground">Cube solved!</p>
          <p className="text-sm text-muted">Solution found in {result.moveCount} moves.</p>
        </div>
      </div>

      {result.cubeState && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-4 font-semibold text-foreground">Detected cube state</h3>
          <CubeNetResult cubeState={result.cubeState} />
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Move sequence</h3>
          <Button variant="outline" size="sm" onClick={() => onCopy(result.notation)}>
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-success" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.moves.map((move, i) => (
            <span
              key={i}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-sm text-foreground"
            >
              {move}
            </span>
          ))}
        </div>

        <p className="mt-4 break-all font-mono text-sm text-muted">{result.notation}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Moves use standard <abbr title="World Cube Association">WCA</abbr> notation.
        R = right face clockwise, R&apos; = counterclockwise, R2 = 180°.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [copied, setCopied] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => jobApi.getJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || TERMINAL_STATUSES.has(data.status)) return false;
      return POLL_INTERVAL_MS;
    },
  });

  async function copyNotation(notation: string) {
    await navigator.clipboard.writeText(notation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link
        to="/jobs"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Details</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{jobId}</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      )}

      {job && (
        <div role="status" aria-live="polite" className="contents">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Status</span>
            <JobStatusBadge status={job.status} />
            <span className="text-xs text-muted-foreground">
              Updated {new Date(job.updatedAt).toLocaleTimeString()}
            </span>
          </div>

          {!TERMINAL_STATUSES.has(job.status) && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="font-medium text-foreground">Solving your cube…</p>
                <p className="mt-1 text-sm text-muted">
                  This usually takes 10–30 seconds. This page updates automatically.
                </p>
              </div>
            </div>
          )}

          {job.status === 'succeeded' && (
            <SolutionPanel
              result={getMockResult()}
              copied={copied}
              onCopy={copyNotation}
            />
          )}

          {job.status === 'failed' && (
            <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/5 p-6">
              <div className="flex items-center gap-2 text-danger">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Job failed</span>
              </div>
              {job.errorMessage && (
                <p className="text-sm text-muted">{job.errorMessage}</p>
              )}
              <p className="text-sm text-muted">
                Try submitting again with clearer, well-lit photos of each face.
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !job && (
        <p className="text-muted">Job not found.</p>
      )}
    </div>
  );
}
