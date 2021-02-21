import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

export default function MobileNavMenu({
  setMobileMenuOpen,
  mobileMenuOpen,
  onSignOutButtonClick,
}) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const history = useHistory();

  return (
    <div className={`menu-transition ${mobileMenuOpen ? "open" : ""}`}>
      <ul className="nav-mobile-menu">
        <div
          role="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onKeyDown={() => setMobileMenuOpen(!mobileMenuOpen)}
          tabIndex={0}
          className="nav-mobile-icon-close"
        >
          <CloseOutlined />
        </div>
        {isLoggedIn && (
          <li>
            <div
              onClick={() => {
                history.push("/account");
                setMobileMenuOpen(false);
              }}
              onKeyDown={() => {
                history.push("/account");
                setMobileMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              Account
            </div>
          </li>
        )}
        <li>
          <div
            onClick={() => {
              history.push("/");
              setMobileMenuOpen(false);
            }}
            onKeyDown={() => {
              history.push("/");
              setMobileMenuOpen(false);
            }}
            role="button"
            tabIndex={0}
          >
            Flashcards
          </div>
        </li>
        {!isLoggedIn && (
          <li>
            <div
              onClick={() => {
                history.push("/login");
                setMobileMenuOpen(false);
              }}
              onKeyDown={() => {
                history.push("/login");
                setMobileMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              Sign in
            </div>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <div
              onClick={() => {
                history.push("/register");
                setMobileMenuOpen(false);
              }}
              onKeyDown={() => {
                history.push("/register");
                setMobileMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              Sign up
            </div>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <div
              onClick={() => {
                onSignOutButtonClick();
                setMobileMenuOpen(false);
              }}
              onKeyDown={() => {
                onSignOutButtonClick();
                setMobileMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              Sign out
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
