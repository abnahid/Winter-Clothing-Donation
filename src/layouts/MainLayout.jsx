import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Snowfall from "react-snowfall";
import snowflake1 from "../assets/logo-M84r5xQ4.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Load the snowflake image
    const image = new Image();
    image.src = snowflake1;

    // Check if the image is valid before setting it
    if (image.complete) {
      setImages([image]);
    } else {
      image.onload = () => setImages([image]);
      image.onerror = () =>
        console.error("Failed to load snowflake image:", snowflake1);
    }
  }, []);

  return (
    <div>
      <Snowfall
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
        snowflakeCount={60}
        speed={[0.5, 1.3]}
        wind={[1.0, 2.0]}
        radius={[2.5, 6.0]}
        images={images.length > 0 ? images : undefined}
      />
      <nav className="w-11/12 mx-auto py-1">
        <Navbar />
      </nav>
      <div className="bg-gray-50 py-5">
        <div className="w-11/12 mx-auto max-w-6xl">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
