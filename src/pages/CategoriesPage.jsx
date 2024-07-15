import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import StarCatsButton from "../components/StarCatsButton";
import ModalAddCategory from "../components/ModalAddCategory";
function CategoriesPage() {
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
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
    if (updatedRows.length == 0 && deletedRows.length == 0) return;
    setIsLoading(true);
    try {
      for (const row of updatedRows) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/categories/${row.id}`,
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
          `${import.meta.env.VITE_API_URL}/categories/${row.id}`,
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
        console.log(response);
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
          <StarCatsButton className={"w-25"} onClick={handleSubmitClick}>
            Guardar cambios
          </StarCatsButton>
          <ModalAddCategory setData={setData} data={data}></ModalAddCategory>
        </div>
        <div className="tabulator-wrapper">
          <ReactTabulator
            data={data}
            columns={columns}
            events={{ cellEdited: handleCellEdited }}
            options={{
              responsiveLayout: "hide",
              height: 600,
            }}
          />
        </div>
      </div>
      <Toaster richColors position="top-center" />
      <Footer />
    </>
  );
}

export default CategoriesPage;
