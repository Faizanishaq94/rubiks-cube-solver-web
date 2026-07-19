import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import JobStatusBadge from './JobStatusBadge';
import type { Job } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const JOB_TYPE_LABELS: Record<Job['type'], string> = {
  'rubiks-cube': "Rubik's Cube",
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-2"
    >
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-xs text-muted-foreground">{job.id}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {JOB_TYPE_LABELS[job.type]}
          </span>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="text-xs text-muted">Submitted {formatDate(job.createdAt)}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted transition-colors group-hover:text-primary" />
    </Link>
  );
}
