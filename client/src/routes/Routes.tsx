import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/Error";
import HomePage from "../pages/HomePage";
import PackPage from  "../pages/PackPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "pack/:id", element: <PackPage /> },
    ],
  },
]);