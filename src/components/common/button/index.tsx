import { ComponentProps, ReactNode } from "react";

import cn from "@/utils/cn";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "outline-gray" | "custom";
  isDisabled?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  isDisabled = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-8 transition-colors focus:outline-none",
        {
          "bg-green-400 text-black hover:bg-green-600":
            variant === "primary" && !isDisabled,
          "bg-gray-200 text-gray-800 hover:bg-gray-300":
            variant === "secondary" && !isDisabled,
          "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50":
            variant === "outline" && !isDisabled,
          "bg-white text-black border border-gray-100 hover:bg-gray-100/10 !rounded-4 px-24 py-9":
            variant === "outline-gray" && !isDisabled,
          "text-white !rounded-4 px-24 py-9":
            variant === "custom" && !isDisabled,
          "opacity-50 cursor-not-allowed bg-neutral-300": isDisabled,
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
