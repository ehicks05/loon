import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bulma/css/bulma.min.css";
import "./bulma-prefers-dark.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
