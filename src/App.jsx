import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import "./styles/App.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

//import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import NotFound from "./pages/NotFound";
import LogOut from "./pages/LogOut";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/productos",
      element: <AdminProducts />,
    },
    {
      path: "/ordenes",
      element: <AdminOrders />,
    },
    {
      path: "/logout",
      element: <LogOut />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
