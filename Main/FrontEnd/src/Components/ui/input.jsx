import * as React from "react";
import { cn } from "/src/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <div className="mt-2" style={{marginTop: '10px', marginBottom: '20px'}}>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input id="price" type="text" name="price" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
        </div>
      </div>
    </div>
  );
}

export { Input };

