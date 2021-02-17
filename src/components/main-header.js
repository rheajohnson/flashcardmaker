import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Button } from "antd";
const { Header } = Layout;
import { logout } from "../redux/actions/auth";

const MainHeader = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(["1"]);
  const history = useHistory();

  const dispatch = useDispatch();

  const onSignUpButtonClick = () => {
    setSelected([""]);
    history.push("/register");
  };

  const onSignOutButtonClick = async () => {
    setSelected(["2"]);
    dispatch(logout()).then(() => {
      history.push("/login");
    });
  };

  const onMenuItemClick = (key) => {
    const menuItemMap = {
      "1": "/",
      "2": "/login",
    };
    setSelected([key]);
    history.push(menuItemMap[key]);
  };

  return (
    <Header style={{ position: "fixed", zIndex: 1, top: 0, width: "100%" }}>
      <Link to="/" onClick={() => setSelected(["1"])}>
        <div className="logo">
          <img src={logo} alt="Flashcard Maker" />
        </div>
      </Link>
      {isLoggedIn && (
        <Button
          type="primary"
          className="header-button"
          onClick={() => onSignOutButtonClick()}
        >
          Sign Out
        </Button>
      )}
      {!isLoggedIn && (
        <Button
          type="primary"
          className="header-button"
          onClick={onSignUpButtonClick}
        >
          Sign Up
        </Button>
      )}
      <Menu theme="dark" mode="horizontal" selectedKeys={selected}>
        {!isLoggedIn && (
          <Menu.Item
            key="2"
            className="header-item"
            onClick={({ key }) => onMenuItemClick(key)}
          >
            Sign In
          </Menu.Item>
        )}
        <Menu.Item
          key="1"
          className="header-item"
          onClick={({ key }) => onMenuItemClick(key)}
        >
          Flashcards
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MainHeader;
