/* eslint-disable react/prop-types */
import { useState } from "react";

import Modal from "react-bootstrap/Modal";
import StarCatsButton from "./StarCatsButton";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
function ModalAddProduct({ setData, data }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const auth = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    pic: "",
    name: "",
    categoryId: undefined,
    price: { base: 0, 350: 0, 450: 0 },
    stock: 99,
    featured: false,
    description: "",
    calories: "99",
  });
  const handleInputChange = (e) => {
    const name = e.target.name;
    if (name == "pic") {
      const parts = e.target.value.split(/[\\/]/);
      const value = parts[parts.length - 1];
      console.log(value);
      setFormValues({
        ...formValues,
        [name]: value,
      });
    } else {
      const value = e.target.value;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newPrice = { ...formValues.price, [name]: value };
    setFormValues((prev) => {
      return { ...prev, price: newPrice };
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

    const data = await response.json();
    console.log("producto creado", data);
    setData((prev) => [...prev, data.product]);
  };
  return (
    <>
      <StarCatsButton onClick={handleShow} className={"w-25"}>
        Producto nuevo
      </StarCatsButton>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar producto nuevo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="addProductForm" onSubmit={handleOnSubmit}>
            <div className="form-group">
              <label htmlFor="imagen">Imagen</label>
              <input
                type="file"
                className="form-control"
                id="pic"
                name="pic"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
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
              <label htmlFor="category">Categoría</label>
              <Form.Select
                onChange={handleInputChange}
                name="categoryId"
                value={formValues.categoryId}
              >
                <option>Seleccionar</option>
                {data.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            {formValues.categoryId == 1 && (
              <div className="form-group">
                <label htmlFor="price">Precio base</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="base"
                  value={formValues.price.base}
                  onChange={handlePriceChange}
                  required
                />
                <label htmlFor="price">Precio 350</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="350"
                  value={formValues.price[350]}
                  onChange={handlePriceChange}
                  required
                />
                <label htmlFor="price">Precio 450</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="450"
                  value={formValues.price[450]}
                  onChange={handlePriceChange}
                  required
                />
              </div>
            )}

            {formValues.categoryId != 1 && (
              <div className="form-group">
                <label htmlFor="price">Precio base</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="base"
                  value={formValues.price.base}
                  onChange={handlePriceChange}
                  required
                />
              </div>
            )}

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

export default ModalAddProduct;
