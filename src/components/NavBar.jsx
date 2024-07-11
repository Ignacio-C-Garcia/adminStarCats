import "../styles/NavBar.module.css";
import { Link } from "react-router-dom";
import UserIcon from "./UserIcon";
import { BagHeart } from "react-bootstrap-icons";
function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black text-white ">
      <div className="container ">
        <Link to="/" className="navbar-brand">
          <span className="fs-2">STARCATS</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="navbar-collapse collapse justify-content-center"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <Link to="/categorias" className="nav-link active">
              Categorías
            </Link>
            <li className="nav-item">
              <Link to="/productos" className="nav-link active">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/pedidos"
                className="nav-link active"
                aria-current="page"
              >
                Pedidos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page">
                Admins
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <UserIcon></UserIcon>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
