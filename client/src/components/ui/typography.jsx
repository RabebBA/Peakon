import * as React from "react";
import { cn } from "@/lib/utils"; // Utilitaire pour gérer les classes dynamiques

const typographyVariants = {
  h1: "text-4xl font-extrabold",
  h2: "text-3xl font-extrabold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-medium",
  h6: "text-base font-medium",
  body1: "text-lg font-normal",
  body2: "text-base font-normal",
  caption: "text-sm text-gray-500",
};

const Typography = React.forwardRef(
  ({ variant = "body1", className, children, ...props }, ref) => {
    const variantClasses =
      typographyVariants[variant] || typographyVariants.body1;
    return (
      <p ref={ref} className={cn(variantClasses, className)} {...props}>
        {children}
      </p>
    );
  }
);

Typography.displayName = "Typography";

export { Typography };
