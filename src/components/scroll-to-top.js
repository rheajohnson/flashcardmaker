import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  const prevLocationRef = useRef();

  useEffect(() => {
    if (location.pathname !== prevLocationRef.current) {
      window.scrollTo(0, 0);
      prevLocationRef.current = location.pathname;
    }
  });

  return children;
};

export default ScrollToTop;
