/**
 * src/components/ui/badge.tsx — Badge
 *
 * A small inline label used to communicate status or category.
 * Variants map directly to job statuses and general purposes.
 *
 * VARIANTS
 *   default    — neutral grey; general purpose
 *   success    — green; succeeded / active states
 *   warning    — yellow; uploaded / queued states
 *   danger     — red; failed / error states
 *   info       — blue; processing states
 *   primary    — orange brand color
 */

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-muted border border-border",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger:  "bg-danger/10  text-danger",
        info:    "bg-info/10    text-info",
        primary: "bg-primary/15 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component.
 *
 * @example
 *   <Badge variant="success">Succeeded</Badge>
 *   <Badge variant="info">Processing</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
