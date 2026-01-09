import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";
import styles from "./button.module.css";

type ButtonVariant = "default" | "primary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, variant = "default", size = "md", disabled, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          styles.base,
          variant === "primary" && styles.variant_primary,
          variant === "ghost" && styles.variant_ghost,
          size === "sm" && styles.size_sm,
          size === "md" && styles.size_md,
          size === "lg" && styles.size_lg,
          className
        )}
        data-disabled={disabled ? "true" : "false"}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
