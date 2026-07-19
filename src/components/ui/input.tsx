/**
 * src/components/ui/input.tsx — Input
 *
 * A styled text input that integrates cleanly with the dark design system.
 * Accepts all standard <input> props; forward-ref compatible so it works
 * with react-hook-form and other controlled-form libraries.
 */

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component.
 *
 * @example
 *   <Input type="email" placeholder="you@example.com" />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Layout & shape
        "flex h-10 w-full rounded-lg px-3 py-2",
        // Colors
        "bg-surface border border-border text-foreground",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Focus ring
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40",
        // File input reset
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "text-sm",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
