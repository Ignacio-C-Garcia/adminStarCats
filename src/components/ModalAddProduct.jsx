import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StarCatsButton from "./StarCatsButton";
/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";

function ModalAddProduct({ setData }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const auth = useSelector((state) => state.auth);
  const [error, setError] = useState(false);
  const [formValues, setFormValues] = useState({
    pic: "",
    name: "",
    categoryId: undefined,
    price: 0,
    stock: 0,
    featured: false,
    description: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log("estos son los inputs", formValues);
    const response = await fetch(import.meta.env.VITE_API_URL + "/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth.token,
      },
      body: JSON.stringify(formValues),
    });
    if (!response.ok) {
      setError(true);
    }
    if (!response.ok) return setError(true);
    const data = await response.json();
    console.log("producto creado", data);
    setData((prev) => [...prev, data.product]);
  };
  return (
    <>
      <StarCatsButton onClick={handleShow}>
        Agregar nuevo Producto
      </StarCatsButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar producto nuevo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="addProductForm" onSubmit={handleOnSubmit}>
            <div className="form-group">
              <label htmlFor="pic">Pic</label>
              <input
                type="text"
                className="form-control"
                id="pic"
                name="pic"
                value={formValues.pic}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="categoryId"
                value={formValues.categoryId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="text"
                className="form-control"
                id="stock"
                name="stock"
                value={formValues.stock}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAddProduct;
