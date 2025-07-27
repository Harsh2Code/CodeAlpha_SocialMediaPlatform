import * as React from "react";
import { cn } from "/src/lib/utils";

const Input = React.forwardRef(({ as: Component = "input", className, type = "text", ...props }, ref) => {
  return (
    <Component
      type={Component === "input" ? type : undefined}
      className={cn(
        "block w-[96%] rounded-[0.5rem] border border-[#CDB384]-600 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-[#6664f1] focus:outline-none focus:ring-1 focus:ring-[#6664f1] sm:text-sm",
        
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
