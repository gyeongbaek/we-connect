import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = React.forwardRef(
  ({ className, children, value, onChange, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-[var(--grayLv2)] bg-[var(--background)] px-3 py-2 pr-8 text-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--grayLv3)] pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
