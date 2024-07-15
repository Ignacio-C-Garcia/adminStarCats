/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import StarCatsButton from "./StarCatsButton";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
function ModalAddCategory({ setData }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const auth = useSelector((state) => state.auth);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    setNewCategory({ name: e.target.value });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
          body: JSON.stringify(newCategory),
        }
      );
      if (response.status != 201) throw response;
      const data = await response.json();
      setData((prev) => [...prev, data.category]);
      setIsLoading(false);
      toast.success("Se ha agregado con éxito la categoría");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.status == 401)
        toast.error("Error con los permisos de autenticacion");
      else toast.error("Ha ocurrido un error");
    }
  };

  return (
    <>
      <StarCatsButton
        onClick={handleShow}
        className={"w-25"}
        isLoading={isLoading}
      >
        Agregar categoría
      </StarCatsButton>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="addProductForm" onSubmit={handleOnSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group text-center pt-4">
              <StarCatsButton
                type="submit"
                onClick={handleClose}
                className={"w-50"}
              >
                Enviar
              </StarCatsButton>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalAddCategory;
