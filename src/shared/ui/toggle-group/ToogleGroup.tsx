import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "../../lib/cn";
import styles from "./toggle-group.module.css";

type Size = "sm" | "md" | "lg";

type RootSingleProps<T extends string> =
  Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type" | "value" | "defaultValue" | "onValueChange"> & {
    type: "single";
    value?: T;
    defaultValue?: T;
    onValueChange?: (value: T) => void;
    size?: Size;
  };

type RootMultipleProps<T extends string> =
  Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, "type" | "value" | "defaultValue" | "onValueChange"> & {
    type: "multiple";
    value?: T[];
    defaultValue?: T[];
    onValueChange?: (value: T[]) => void;
    size?: Size;
  };

export function ToggleGroupRoot<T extends string>(props: RootSingleProps<T> | RootMultipleProps<T>) {
  const { className, size = "md", ...rest } = props as any;

  // Radix types are string/string[]; we adapt to strict unions via generics on our public API.
  if (props.type === "single") {
    const { onValueChange, ...p } = rest as RootSingleProps<T>;
    return (
      <ToggleGroupPrimitive.Root
        type="single"
        className={cn(styles.root, styles[`size_${size}` as const], className)}
        onValueChange={(v) => {
          // Radix emits "" when "single" becomes empty (e.g. allowEmptySelection).
          if (v) onValueChange?.(v as T);
        }}
        {...(p as any)}
      />
    );
  }

  const { onValueChange, ...p } = rest as RootMultipleProps<T>;
  return (
    <ToggleGroupPrimitive.Root
      type="multiple"
      className={cn(styles.root, styles[`size_${size}` as const], className)}
      onValueChange={(v) => onValueChange?.(v as T[])}
      {...(p as any)}
    />
  );
}

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(styles.item, className)} {...props} />
));
ToggleGroupItem.displayName = "ToggleGroupItem";
