import React, { type ReactNode, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isHorizontal: boolean;
  leftIcon?: ReactNode;
}

export function TextInput({ label, isHorizontal, leftIcon, ...props }: Props) {
  return (
    <div className={`flex gap-2 ${isHorizontal ? "flex-row" : "flex-col"}`}>
      {label && <label className="label">{label}</label>}

      <div className={"p-2 flex items-center gap-2 rounded bg-neutral-800"}>
        {leftIcon && <span className="">{leftIcon}</span>}
        <input
          type="text"
          className={"w-full bg-neutral-800 outline-none"}
          placeholder={props.placeholder || label}
          {...props}
        />
      </div>
    </div>
  );
}
