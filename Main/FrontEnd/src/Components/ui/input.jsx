import * as React from "react";
import { cn } from "/src/lib/utils";

const Input = React.forwardRef(({ as: Component = "input", className, type = "text", ...props }, ref) => {
  return (
    <Component
      type={Component === "input" ? type : undefined}
      className={cn(
        "block w-[90%] mx-auto rounded-[0.5rem] border border-[#CDB384]-600 bg-white px-[2%] py-[1rem] text-gray-900 placeholder:text-gray-400 focus:border-[#6664f1] focus:outline-none focus:ring-1 focus:ring-[#6664f1] sm:text-sm",
        
      )}
      ref={ref}
      {...props}
      style={{backgroundColor: '#ffffff',color: 'black'}}
    />
  );
});
Input.displayName = "Input";

export { Input };
