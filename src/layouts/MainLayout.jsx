import AOS from "aos";
import "aos/dist/aos.css";
import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import snowflake1 from "../assets/logo-M84r5xQ4.png";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthProvider";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [images, setImages] = useState([]);
  const { pendingRecovery } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // After a password-reset email link, send the user to set a new password.
  useEffect(() => {
    if (pendingRecovery && pathname !== "/forgot-password") {
      navigate("/forgot-password");
    }
  }, [pendingRecovery, pathname, navigate]);

  useEffect(() => {
    AOS.init({
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800,
      easing: "ease-out-cubic",
      once: false,
      offset: 60,
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

  useEffect(() => {
    const content = document.querySelector(".bg-gray-50");
    if (!content) return undefined;
    let frame;
    const refreshReveals = () => {
      content.querySelectorAll("h1, h2, h3, p, li").forEach((element) => {
        if (!element.hasAttribute("data-aos") && !element.closest("[data-aos]")) {
          element.setAttribute("data-aos", "fade-up");
          element.setAttribute("data-aos-duration", "800");
        }
      });
      AOS.refreshHard();
    };
    refreshReveals();
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refreshReveals);
    });
    observer.observe(content, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

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
