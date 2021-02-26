import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./app";
import "antd/dist/antd.css";
import "./styles/index.scss";

const app = document.getElementById("root");
if (app) {
  // 1. Set up the browser history with the updated location
  // (minus the # sign)
  const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
  if (path) {
    history.replace(path);
  }

  // 2. Render our app
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
}
