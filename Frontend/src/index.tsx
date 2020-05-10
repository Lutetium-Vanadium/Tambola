import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/main.scss";

document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
