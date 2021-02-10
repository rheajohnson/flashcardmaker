import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
const { Header } = Layout;

const MainHeader = () => {
  return (
    <Header style={{ position: "fixed", zIndex: 1, top: 0, width: "100%" }}>
      <Link to="/">
        <div className="logo">
          <img src={logo} alt="Flashcard Maker" />
        </div>
      </Link>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1" className="sign-out-button">
          Sign Out
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MainHeader;
