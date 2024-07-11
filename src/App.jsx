import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import "./styles/App.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

//import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import AdminOrdersPage from "./pages/OrdersPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogOutPage from "./pages/LogOutPage";
import TestingPage from "./pages/TestingPage";
import CategoriesPage from "./pages/CategoriesPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardPage />,
    },
    {
      path: "/productos",
      element: <ProductsPage />,
    },
    {
      path: "/categorias",
      element: <CategoriesPage />,
    },
    {
      path: "/pedidos",
      element: <AdminOrdersPage />,
    },
    {
      path: "/cerrarSesion",
      element: <LogOutPage />,
    },
    {
      path: "/iniciarSesion",
      element: <LoginPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
    {
      path: "/testing",
      element: <TestingPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
