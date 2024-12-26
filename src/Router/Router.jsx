import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AboutUs from "../Pages/AboutUs";
import CampaignDetails from "../Pages/CampaignDetails";
import Campaigns from "../Pages/Campaigns";
import Contact from "../Pages/Contact";
import Dashboard from "../Pages/Dashboard";
import ForgotPassword from "../Pages/ForgotPassword";
import Home from "../Pages/Home";
import HowToHelp from "../Pages/HowToHelp";
import Login from "../Pages/Login";
import NotFound from "../Pages/NotFound";
import Profile from "../Pages/Profile";
import Register from "../Pages/Register";
import UpdateProfile from "../Pages/UpdateProfile";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },
        {
          path: "campaigns",
          element: <Campaigns />,
          loader: () => fetch("/donation-campaigns.json"),
        },
        {
          path: "how-to-help",
          element: <HowToHelp />,
        },
        {
          path: "about",
          element: <AboutUs />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <PrivateRoute>
              <Dashboard></Dashboard>
            </PrivateRoute>
          ),
        },
        {
          path: "/update-profile",
          element: (
            <PrivateRoute>
              <UpdateProfile></UpdateProfile>
            </PrivateRoute>
          ),
        },
        {
          path: "/details/:id",
          element: (
            <PrivateRoute>
              <CampaignDetails></CampaignDetails>
            </PrivateRoute>
          ),
          loader: async ({ params }) => {
            const res = await fetch("/donation-campaigns.json");
            const data = await res.json();
            const singleData = data.find((d) => d.id === parseInt(params.id));
            return singleData;
          },
        },
        {
          path: "/login",
          element: <Login></Login>,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword></ForgotPassword>,
        },
        {
          path: "/register",
          element: <Register></Register>,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
