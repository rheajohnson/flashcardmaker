import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./app";
import "antd/dist/antd.css";
import "./styles/index.scss";
import "./styles/card.scss";
import "./styles/header.scss";
import "./styles/login.scss";
import "./styles/study.scss";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
