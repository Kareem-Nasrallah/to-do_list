import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface themeProviderProps {
  children: ReactNode;
}

// Applies the current theme mode (dark/light) to the root HTML element
const ThemeProvider = ({ children }: themeProviderProps) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return children;
};

export default ThemeProvider;
