/**
 * src/components/ui/label.tsx — Label
 *
 * A styled <label> element for form fields.
 * The `htmlFor` prop links it to its associated input for accessibility.
 */

import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label component.
 *
 * @example
 *   <Label htmlFor="email">Email address</Label>
 *   <Input id="email" type="email" />
 */
function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export { Label };
