import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useSelector } from "react-redux";
import ModalAddProduct from "../components/ModalAddProduct";
import StarCatsButton from "../components/StarCatsButton";
function ProductsPage() {
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/categories"
        );
        if (!response.ok) {
          throw new Error("API fetch error, !ok");
        }
        const { categories } = await response.json();

        setCategories(categories);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);
  const selectEditor = (cell, onRendered, success, cancel) => {
    const select = document.createElement("select");
    for (const cat of categories) {
      const optionElement = document.createElement("option");
      optionElement.text = cat.name;
      optionElement.value = cat.id;
      select.appendChild(optionElement);
    }
    select.value = cell.getValue();

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
        const cellValue = cell.getValue();

        for (const cat of categories) {
          if (cat.id == cellValue) {
            return cat.name;
          }
        }
        return cellValue;
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
    if (updatedRows.length == 0 && deletedRows.length == 0) return;
    setIsLoading(true);
    try {
      for (const row of updatedRows) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${row.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.token,
            },
            body: JSON.stringify(row),
          }
        );

        if (response.status != 200) throw response;
      }
      for (const row of deletedRows) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${row.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth.token,
            },
          }
        );
        setUpdatedRows([]);
        setDeletedRows([]);
        if (response.status != 200) throw response;
      }
      setIsLoading(false);
      toast.success("Se ha modificado con éxito todos los productos");
    } catch (response) {
      setIsLoading(false);
      const { status } = response;
      if (status == 401)
        return toast.error("Error con los permisos de autenticación");
      else return toast.error("Algunas modificaciones no han sido aplicadas");
    }
  };

  return (
    <>
      <NavBar />
      <div className="container ">
        <div className="d-flex justify-content-around pt-3">
          <StarCatsButton
            onClick={handleSubmitClick}
            isLoading={isLoading}
            className={"w-25"}
          >
            Guardar cambios
          </StarCatsButton>
          <ModalAddProduct
            setData={setData}
            data={categories}
          ></ModalAddProduct>
        </div>
        <div className="tabulator-wrapper">
          <ReactTabulator
            data={data}
            columns={columns}
            events={{ cellEdited: handleCellEdited }}
            options={{
              layout: "fitColumns",
              responsiveLayout: "hide",
            }}
          />
        </div>
      </div>
      <Toaster richColors position="top-center" />
      <Footer />
    </>
  );
}

export default ProductsPage;
