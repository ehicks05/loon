import React from "react";
import { RevolvingDot } from "react-loader-spinner";

export default function PageLoader() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <div style={{ margin: "auto" }}>
        <RevolvingDot color="#44CC44" height={150} width={150} />
      </div>
    </div>
  );
}
