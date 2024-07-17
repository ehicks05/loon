import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

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
        <Loader type="RevolvingDot" color="#44CC44" height={150} width={150} />
      </div>
    </div>
  );
}
