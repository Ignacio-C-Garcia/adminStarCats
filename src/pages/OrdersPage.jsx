import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ReactTabulator } from "react-tabulator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TabulatorFull as Tabulator } from "tabulator-tables"; // Import Tabulator
import "../styles/NestedTable.css"; // Custom styles for tables
function OrdersPage() {
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        });
        if (!response.ok) {
          throw new Error("API fetch error, !ok");
        }
        const { orders } = await response.json();
        console.log(orders);
        setData(orders);
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Usuario",
      field: "user",
      formatter: (cell) => {
        return cell.getRow().getData().user.name;
      },
    },
    { title: "Estatus", field: "status" },
    { title: "Direccion", field: "address" },
  ];

  const nestedColumns = [
    {
      title: "Product Name",
      field: "name",
    },
    { title: "Product Price", field: "price" },
    { title: "Quantity", field: "qty" },
  ];
  const rowFormatter = (row) => {
    const element = row.getElement(); // Get row element
    const data = row.getData(); // Get row data

    if (data.products && data.products.length > 0) {
      const nestedTable = document.createElement("div");
      nestedTable.style.margin = "10px 0";
      nestedTable.className = "nested-table";
      element.appendChild(nestedTable);

      new Tabulator(nestedTable, {
        data: data.products,
        columns: nestedColumns,
        layout: "fitColumns",
      });
    }
  };
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="tabulator-wrapper">
          <ReactTabulator
            data={data}
            columns={columns}
            layout="fitColumns"
            rowFormatter={rowFormatter}
            options={{
              responsiveLayout: "hide",
              height: "500px",
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrdersPage;
