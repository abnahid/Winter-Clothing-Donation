import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { BrandingProvider } from "./context/BrandingContext";
import "./index.css";
import router from "./Router/Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandingProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </BrandingProvider>
    <Toaster position="right-top" toastOptions={{ duration: 1500 }} />
  </StrictMode>
);
