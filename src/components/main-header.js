import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Button } from "antd";
const { Header } = Layout;

const MainHeader = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(["1"]);
  const history = useHistory();

  const onSignUpButtonClick = () => {
    setSelected([""]);
    history.push("/register");
  };

  return (
    <Header style={{ position: "fixed", zIndex: 1, top: 0, width: "100%" }}>
      <Link to="/" onClick={() => setSelected(["1"])}>
        <div className="logo">
          <img src={logo} alt="Flashcard Maker" />
        </div>
      </Link>
      <Menu theme="dark" mode="horizontal" selectedKeys={selected}>
        {!isLoggedIn && (
          <Button
            type="primary"
            className="header-button"
            onClick={onSignUpButtonClick}
          >
            Sign Up
          </Button>
        )}
        {!isLoggedIn && (
          <Menu.Item
            key="2"
            className="header-item"
            onClick={() => setSelected(["2"])}
          >
            <Link to="/login">Sign In</Link>
          </Menu.Item>
        )}
        <Menu.Item
          key="1"
          className="header-item"
          onClick={() => setSelected(["1"])}
        >
          <Link to="/">Flashcards</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MainHeader;
