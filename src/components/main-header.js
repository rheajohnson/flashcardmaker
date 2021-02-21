import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Button } from "antd";
const { Header } = Layout;
import { logout } from "../redux/actions/auth";

const MainHeader = () => {
  const [selected, setSelected] = useState("");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const headerSelectionMap = {
    "/": "1",
    "/login": "2",
    "/account": "3",
  };

  useEffect(() => {
    if (selected !== location.pathname) {
      setSelected(headerSelectionMap[location.pathname]);
    }
  });

  const onSignOutButtonClick = async () => {
    dispatch(logout()).then(() => {
      history.push("/login");
    });
  };

  return (
    <Header style={{ position: "fixed", zIndex: 1, top: 0, width: "100%" }}>
      <Link to="/">
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
          onClick={() => history.push("/register")}
        >
          Sign Up
        </Button>
      )}
      <Menu theme="dark" mode="horizontal" selectedKeys={selected}>
        {isLoggedIn && (
          <Menu.Item
            key="3"
            className="header-item"
            onClick={() => history.push("/account")}
          >
            Account
          </Menu.Item>
        )}
        {!isLoggedIn && (
          <Menu.Item
            key="2"
            className="header-item"
            onClick={() => history.push("/login")}
          >
            Sign In
          </Menu.Item>
        )}
        <Menu.Item
          key="1"
          className="header-item"
          onClick={() => history.push("/")}
        >
          Flashcards
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MainHeader;
