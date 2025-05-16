"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = "primary",
}) => {
  return (
    <Button
      disabled={disabled}
      type="submit"
      variant={variant}
      size="sm"
      className={cn(className)}
    >
      {children}
    </Button>
  );
};
