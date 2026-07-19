/**
 * src/components/jobs/JobStatusBadge.tsx — Job Status Badge
 *
 * Maps a JobStatus value to the appropriate Badge variant and label.
 * Used in job cards and the job detail page.
 */

import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types";

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  pending:    { label: "Pending",    variant: "default"  },
  uploaded:   { label: "Uploaded",   variant: "warning"  },
  processing: { label: "Processing", variant: "info"     },
  succeeded:  { label: "Solved",     variant: "success"  },
  failed:     { label: "Failed",     variant: "danger"   },
};

/**
 * JobStatusBadge — renders a coloured status pill for a job.
 *
 * @example
 *   <JobStatusBadge status="processing" />  → blue "Processing" badge
 *   <JobStatusBadge status="succeeded" />   → green "Solved" badge
 */
export default function JobStatusBadge({ status }: { status: JobStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
