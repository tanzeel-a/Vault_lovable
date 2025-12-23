import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-primary text-primary-foreground font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]",
        golden:
          "bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.03]",
        glass:
          "bg-card/60 backdrop-blur-md border border-white/40 text-foreground shadow-lg hover:bg-card/80 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2 md:h-11 md:px-6",
        sm: "h-8 rounded-lg px-3 text-xs md:h-9 md:px-4",
        lg: "h-12 rounded-xl px-6 text-sm md:h-14 md:px-10 md:text-base",
        xl: "h-14 rounded-2xl px-8 text-base md:h-16 md:px-12 md:text-lg",
        icon: "h-9 w-9 md:h-10 md:w-10",
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
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
