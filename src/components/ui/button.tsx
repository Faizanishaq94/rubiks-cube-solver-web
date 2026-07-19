/**
 * src/components/ui/button.tsx — Button
 *
 * A polymorphic button component built with class-variance-authority (CVA).
 * Supports four visual variants and three sizes.
 *
 * VARIANTS
 *   default   — orange-filled; the primary call-to-action
 *   outline   — transparent with an orange border; secondary actions
 *   ghost     — no border or background; tertiary / icon buttons
 *   danger    — red-filled; destructive actions
 *
 * CLIENT USAGE
 * This is a plain presentational component — it does not use state or browser
 * APIs, so it can be imported in both server and client components.
 */

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, isValidElement, cloneElement, type ReactElement } from "react";

const buttonVariants = cva(
  // Base styles applied to every variant
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        ghost: "text-muted hover:text-foreground hover:bg-surface-2",
        danger: "bg-danger text-white hover:bg-red-600",
      },
      size: {
        sm:      "h-8  px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg:      "h-12 px-6 text-base",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the Button merges its styles onto its single child element
   * instead of rendering a <button>. Use this to style a Next.js <Link>
   * or <a> tag with button appearance without wrapping it in a <button>
   * (which would produce invalid HTML).
   *
   * @example
   *   <Button asChild><Link href="/dashboard">Go</Link></Button>
   */
  asChild?: boolean;
}

/**
 * Button component.
 *
 * @example
 *   <Button>Submit</Button>
 *   <Button variant="outline" size="sm">Cancel</Button>
 *   <Button variant="ghost" size="icon"><ChevronRight /></Button>
 *   <Button asChild><Link href="/signup">Get started</Link></Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    // asChild: merge button styles onto the child element (e.g. <Link>)
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>;
      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className as string | undefined),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
