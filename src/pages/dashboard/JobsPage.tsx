import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { jobApi } from '@/lib/jobApi';

export default function JobsPage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobApi.getJobs,
  });

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Jobs</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-muted">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} submitted
            </p>
          )}
        </div>
        <Button size="sm" asChild>
          <Link to="/submit/rubiks-cube">
            New job <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-16 text-center">
      <p className="text-muted">You haven&apos;t submitted any jobs yet.</p>
      <Button asChild>
        <Link to="/submit/rubiks-cube">Submit your first cube</Link>
      </Button>
    </div>
  );
}
