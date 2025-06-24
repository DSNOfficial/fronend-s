// src/hooks/useGtagPageView.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useGtagPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

export default useGtagPageView;
