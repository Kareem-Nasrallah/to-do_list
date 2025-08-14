import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import note1 from "../../assets/note 1.jpg";
import note2 from "../../assets/note 2.jpg";
import note3 from "../../assets/note 3.jpg";
import note4 from "../../assets/note 4.jpg";

const Layout = ({ children }: { children?: ReactNode }) => {
  const images = [note1, note2, note3, note4];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="dark:text-primary-content py-10 px-4 sm:px-8 md:px-12"
      id="layout"
      style={{
        backgroundSize: innerHeight > innerWidth ? "auto 120vh" : "120vw auto",
        backgroundImage: `url(${images[currentIndex]})`,
        transition: "background-image 2s ease-in-out",
        animation: "backgroundMotion 90s linear 2s infinite",
      }}
    >
      <div className="rounded-2xl layout-box relative backdrop-blur-xs backdrop-brightness-90">
        <Header />
        <Outlet />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
