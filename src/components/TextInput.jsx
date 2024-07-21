import React from "react";

export default function TextInput({
  label,
  hideLabel,
  isHorizontal,
  leftIcon,
  ...props
}) {
  return (
    <div className={`flex gap-2 ${isHorizontal ? "flex-row" : "flex-col"}`}>
      <label className="label">{label}</label>

      <div className={"p-2 flex items-center gap-2 rounded bg-neutral-800"}>
        {leftIcon && <span className="">{leftIcon}</span>}
        <input
          id={props.id}
          name={props.id}
          type="text"
          className={"w-full bg-neutral-800 outline-none"}
          placeholder={props.placeholder || label}
          {...props}
        />
      </div>
    </div>
  );
}
