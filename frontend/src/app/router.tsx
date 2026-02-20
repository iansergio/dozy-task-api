import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/login/login.page";
import { DashboardPage } from "../pages/dashboard/dashborad.page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: <DashboardPage />,
    }
])