import React from "react";

export default function Select({ className, label, isHorizontal, ...props }) {
  const blankLabel = props.blankLabel;
  const required = props.required;
  const items = props.items;

  if (!required) items.splice(0, 0, { value: "", text: blankLabel });

  return (
    <div className="">
      <label className="label">{label}</label>

      <div className="">
        <div className="">
          <select
            name={props.id}
            className={`overflow-auto p-2 rounded bg-neutral-800 ${className}`}
            {...props}
          >
            {items.map((item) => (
              <option key={item.value} value={item.value} className="p-2">
                {item.text}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
