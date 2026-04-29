import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-black text-white hover:bg-[#404852]",
        variant === "secondary" && "bg-[#FFDE59] text-black hover:bg-[#fcde59]",
        variant === "ghost" && "border border-black/10 bg-white/70 text-black hover:bg-white",
        className,
      )}
      {...props}
    />
  );
}
