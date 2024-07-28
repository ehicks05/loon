import React, { type ReactNode, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isHorizontal?: boolean;
  leftIcon?: ReactNode;
}

export function TextInput({ label, isHorizontal, leftIcon, ...props }: Props) {
  return (
    <label
      className={`flex gap-1 ${isHorizontal ? "flex-row" : "flex-col"} w-full`}
    >
      {label || ""}

      <div className={"p-2 flex items-center gap-2 rounded bg-neutral-800"}>
        {leftIcon && <span className="">{leftIcon}</span>}
        <input
          type="text"
          className="bg-neutral-800 outline-none"
          placeholder={props.placeholder || label}
          {...props}
        />
      </div>
    </label>
  );
}

export function CheckboxInput({ label, type, ...props }: Props) {
  return (
    <label className="flex gap-2 w-full p-2 items-center rounded bg-neutral-800">
      <input
        type="checkbox"
        className="bg-neutral-800 outline-none"
        {...props}
      />
      {label}
    </label>
  );
}
