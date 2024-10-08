import user from "./img/user.png";
import logout from "./img/log-out.png";
import styles from "../styles/UserIcon.module.css";
import { PersonCircle } from "react-bootstrap-icons";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//import { removeToken } from "../redux/authReducer";

function UserIcon() {
  const token = useSelector((state) => state.auth.token);

  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="App z-3">
      <div
        className={`${styles["menu_container"]} position-relative z-3`}
        ref={menuRef}
      >
        <div
          className={styles["menu_trigger"]}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Link>
            <PersonCircle size={30} className="text-white" />
          </Link>
        </div>

        <div
          className={`${styles["dropdown_menu"]} border z-3 ${
            open ? styles["active"] : styles["inactive"]
          }`}
        >
          <h3>
            {token == "" ? "Es necesario ser Admin" : "Bienvenido/a"}
            <br />
          </h3>
          {token !== "" ? (
            <ul className="p-0 mb-0">
              <DropdownItem img={user} text={"Mi Perfil"} to={"/admin"} />
              <DropdownItem
                img={logout}
                text={"Cerrar Sesión"}
                to={"/cerrarSesion"}
              />
            </ul>
          ) : (
            <ul className="p-0 mb-0">
              <DropdownItem
                img={logout}
                text={"Iniciar Sesión"}
                to={"/iniciarSesion"}
              />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function DropdownItem({ img, text, to }) {
  return (
    <li
      className={`text-center ${styles["dropdownItem"]}  border-top d-flex align-items-center p-2`}
    >
      <img src={img}></img>
      <Link to={to} className="ps-3">
        {text}
      </Link>
    </li>
  );
}

export default UserIcon;
