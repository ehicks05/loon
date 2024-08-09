import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, className, type, ...props }: Props) => (
  <button
    type={type || "button"}
    className={twMerge(
      "px-3 py-2 rounded-lg text-white bg-neutral-700",
      "hover:brightness-125 disabled:hover:brightness-100",
      "disabled:text-neutral-400 disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
