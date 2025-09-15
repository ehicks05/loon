import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  items: { text: string; value: string }[];
}

export default function Select({ className, label, items, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1">
      {label}
      <select
        className={`overflow-auto p-2 rounded bg-neutral-800 w-full border-r-8 border-neutral-800 ${className}`}
        {...props}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} className="p-2">
            {item.text}
          </option>
        ))}
      </select>
    </label>
  );
}
