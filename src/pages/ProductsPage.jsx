import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import ModalAddProduct from "../components/ModalAddProduct";
import StarCatsButton from "../components/StarCatsButton";
function ProductsPage() {
  const mapeo = { 1: "Cafés", 2: "Pastelería", 3: "Granos" };
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const selectEditor = (cell, onRendered, success, cancel) => {
    const options = { Cafés: 1, Pastelería: 2, Granos: 3 };

    const select = document.createElement("select");
    for (const [key, value] of Object.entries(options)) {
      const optionElement = document.createElement("option");
      optionElement.text = key;
      optionElement.value = value;
      select.appendChild(optionElement);
    }
    select.value = cell.getValue(); // establece el valor inicial

    // Eventos para manejar el cambio de valor
    select.addEventListener("change", () => {
      success(select.value);
    });
    select.addEventListener("blur", () => {
      cancel();
    });

    onRendered(() => {
      select.focus();
    });

    return select;
  };
  const priceEditor = (cell, onRendered, success, cancel) => {
    const inputBase = document.createElement("input");
    const input350 = document.createElement("input");
    const input450 = document.createElement("input");
    const div = document.createElement("div");
    div.classList.add("d-flex");
    div.classList.add("flex-column");
    inputBase.value = cell.getValue().base;
    input350.value = cell.getValue()[350] ? cell.getValue()[350] : "";
    input450.value = cell.getValue()[450] ? cell.getValue()[450] : "";

    inputBase.addEventListener("change", () => {
      success({ ...cell.getValue(), base: inputBase.value });
    });
    input350.addEventListener("change", () => {
      success({ ...cell.getValue(), 350: input350.value });
    });
    input450.addEventListener("change", () => {
      success({ ...cell.getValue(), 450: input450.value });
    });
    div.addEventListener("blur", () => {
      cancel();
    });

    onRendered(() => {
      inputBase.focus();
    });

    div.appendChild(input350);
    div.appendChild(input450);
    div.appendChild(inputBase);

    return div;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/products"
        );
        if (!response.ok) {
          throw new Error("API fetch error, !ok");
        }
        const { products } = await response.json();

        setData(products);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);
  const columns = [
    {
      headerSort: false,
      vertAlign: "middle",
      formatter: "buttonCross",
      hozAlign: "center",
      cellClick: (e, cell) => {
        const data = cell.getRow().getData();
        setDeletedRows((prev) => [...prev, data]);
        setData((prev) => {
          return prev.filter((row) => row.id !== data.id);
        });
      },
      headerFilter: false,
      width: 20,
    },
    {
      title: "Imagen",
      field: "pic",
      vertAlign: "top",
      hozAlign: "center",
      formatter: (cell) => {
        const imgUrl = import.meta.env.VITE_IMG_PATH;
        return `<img src="${imgUrl}${cell.getValue()}" style="height:50px;width:50px;">`;
      },
      formatterParams: {
        height: "100px",
        width: "100px",
      },
      editor: "input",
      headerSort: false,
      width: 70,
      headerHozAlign: "center",
    },
    {
      title: "Nombre",
      field: "name",
      editor: "input",
      width: 120,
      vertAlign: "middle",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
    },
    {
      title: "Categoría",
      field: "categoryId",
      editor: selectEditor,
      width: 110,
      vertAlign: "middle",
      hozAlign: "center",
      headerHozAlign: "center",
      formatter: (cell) => {
        return `${mapeo[cell.getValue()]}`;
      },
      headerSort: false,
    },
    {
      title: "Precios",
      field: "price",
      editor: priceEditor,
      width: 180,
      vertAlign: "middle",
      hozAlign: "center",
      headerHozAlign: "center",
      formatter: (cell) => {
        let result = "<ul>";
        for (const [key, value] of Object.entries(cell.getValue())) {
          result += `<li>${key}: ${value}</li>`;
        }
        result += "</ul>";
        return result;
      },
      headerSort: false,
    },
    {
      title: "Descripción",
      field: "description",
      editor: "input",
      vertAlign: "middle",
      headerSort: false,
    },
  ];

  const handleCellEdited = (cell) => {
    const updatedRow = cell.getRow().getData();
    setUpdatedRows((prev) => {
      const updatedIndex = prev.findIndex((row) => row.id === updatedRow.id);

      if (updatedIndex >= 0) {
        const updatedRowsCopy = [...prev];
        updatedRowsCopy[updatedIndex] = updatedRow;
        return updatedRowsCopy;
      } else {
        return [...prev, updatedRow];
      }
    });
  };
  const handleSubmitClick = async () => {
    console.log("Updated Rows:", updatedRows);
    console.log("Deleted Rows:", deletedRows);
    for (const row of updatedRows) {
      await fetch(`${import.meta.env.VITE_API_URL}/products/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(row),
      });
    }
    for (const row of deletedRows) {
      await fetch(`${import.meta.env.VITE_API_URL}/products/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
      });
    }
    console.log("actualizado");
  };

  return (
    <>
      <NavBar />
      <div className="container ">
        <div className="d-flex justify-content-around pt-3">
          <StarCatsButton onClick={handleSubmitClick}>
            Guardar cambios
          </StarCatsButton>
          <ModalAddProduct setData={setData}></ModalAddProduct>
        </div>
        <div className="tabulator-wrapper">
          <ReactTabulator
            data={data}
            columns={columns}
            events={{ cellEdited: handleCellEdited }}
            options={{
              layout: "fitColumns",
              responsiveLayout: "hide",
              height: 600,
            }}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductsPage;
