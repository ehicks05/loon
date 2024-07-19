import React from "react";

export default function TextInput(props) {
  const label = props.label;
  const hideLabel = props.hideLabel;
  const size = props.size ? props.size : 20;
  const autoComplete = props.autoComplete ? props.autoComplete : "";
  const isHorizontal = props.horizontal;
  const leftIcon = props.leftIcon;

  let fieldClass = "field";
  fieldClass += isHorizontal ? " is-horizontal" : "";
  let labelClass = "field-label";
  labelClass += isHorizontal ? " is-normal" : "";

  const labelEl = !hideLabel ? (
    isHorizontal ? (
      <div className={labelClass}>
        <label className="label">{label}</label>
      </div>
    ) : (
      <label className="label">{label}</label>
    )
  ) : (
    ""
  );

  const controlEl = (
    <div className={"p-2 flex items-center gap-2 rounded bg-neutral-800"}>
      {leftIcon && <span className="">{leftIcon}</span>}
      <input
        type="text"
        className={"w-full bg-neutral-800"}
        size={size}
        placeholder={props.label}
        id={props.id}
        name={props.id}
        defaultValue={props.value}
        required={props.required}
        onChange={props.onChange}
        autoComplete={autoComplete}
        autoFocus={props.autofocus}
      />
    </div>
  );

  const fieldEl = isHorizontal ? (
    <div className="">
      <div className="">{controlEl}</div>
    </div>
  ) : (
    controlEl
  );

  return (
    <div className={""}>
      {labelEl}
      {fieldEl}
    </div>
  );
}
