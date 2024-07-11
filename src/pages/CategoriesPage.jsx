import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalAddProduct from "../components/ModalAddProduct";
import StarCatsButton from "../components/StarCatsButton";
function CategoriesPage() {
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);

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

        setData(categories);
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
    },
    {
      title: "Id",
      field: "id",
      editor: "input",
      vertAlign: "middle",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
    },
    {
      title: "Nombre",
      field: "name",
      editor: "input",
      vertAlign: "middle",
      hozAlign: "center",
      headerHozAlign: "center",
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
              responsiveLayout: "hide",
              height: 300,
            }}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CategoriesPage;
