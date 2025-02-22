import React from "react";
import { cn } from "@/lib/utils";

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[rgba(255,255,255,0.5)] backdrop-blur-sm rounded-lg border border-gray-200",
      className,
      selected ? "border-muted-foreground shadow-lg" : "",
      "hover:opacity-50 transition-all duration-300",
    )}
    tabIndex={0}
    {...props}
  ></div>
));
BaseNode.displayName = "BaseNode";
