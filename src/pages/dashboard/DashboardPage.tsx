import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: replace with real API call: GET /jobs/stats
const MOCK_STATS = {
  total: 3,
  succeeded: 1,
  processing: 1,
};

export default function DashboardPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Submit a cube or check the status of your recent jobs.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Solve a Cube
          </CardTitle>
          <CardDescription>
            Upload 6 face photos and we&apos;ll compute the solution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/submit/rubiks-cube">
              Submit a cube <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="Total jobs"
          value={MOCK_STATS.total}
          iconColor="text-info"
          bgColor="bg-info/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Solved"
          value={MOCK_STATS.succeeded}
          iconColor="text-success"
          bgColor="bg-success/10"
        />
        <StatCard
          icon={Clock}
          label="In progress"
          value={MOCK_STATS.processing}
          iconColor="text-warning"
          bgColor="bg-warning/10"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent jobs</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/jobs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
