import React from "react";
import { MenuOutlined } from "@ant-design/icons";

export default function MobileNav({ setMobileMenuOpen, mobileMenuOpen }) {
  return (
    <div
      role="button"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      onKeyDown={() => setMobileMenuOpen(!mobileMenuOpen)}
      tabIndex={0}
      className="mobile-nav-icon-open"
    >
      <MenuOutlined />
    </div>
  );
}
