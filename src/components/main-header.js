import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import MobileNavButton from "./mobile-nav-button";
import MobileNavMenu from "./mobile-nav-menu";
import logo from "../assets/logo.svg";
import { logout } from "../redux/actions/auth";
import { Layout, Menu, Button } from "antd";
const { Header } = Layout;

const MainHeader = () => {
  const [selected, setSelected] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const renderButton = () => {
    return isLoggedIn ? (
      <Button
        type="primary"
        className="header-button"
        onClick={() => onSignOutButtonClick()}
      >
        Sign out
      </Button>
    ) : (
      <Button
        type="primary"
        className="header-button"
        onClick={() => history.push("/register")}
      >
        Sign up
      </Button>
    );
  };

  return (
    <Header className="header">
      <Link to="/">
        <img src={logo} alt="Flashcard Maker" className="header-logo" />
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selected}
        className="header-menu"
      >
        {isLoggedIn && (
          <Menu.Item key="3" onClick={() => history.push("/account")}>
            Account
          </Menu.Item>
        )}
        {!isLoggedIn && (
          <Menu.Item key="2" onClick={() => history.push("/login")}>
            Sign in
          </Menu.Item>
        )}
        <Menu.Item key="1" onClick={() => history.push("/")}>
          Flashcards
        </Menu.Item>
      </Menu>
      {renderButton()}
      <MobileNavButton
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
      <MobileNavMenu
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        onSignOutButtonClick={onSignOutButtonClick}
      />
    </Header>
  );
};

export default MainHeader;
