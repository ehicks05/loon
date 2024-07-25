import React from "react";
import { RevolvingDot } from "react-loader-spinner";

export default function PageLoader() {
  return (
    <div className="h-dvh w-dvw flex items-center justify-center bg-neutral-950">
      <RevolvingDot color="#44CC44" height={150} width={150} />
    </div>
  );
}
