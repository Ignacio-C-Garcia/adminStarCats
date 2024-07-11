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
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
      field: "user",
      formatter: (cell) => {
        return cell.getRow().getData().user.name;
      },
    },
    {
      title: "Estatus",
      headerSort: false,
      hozAlign: "center",
      headerHozAlign: "center",
      field: "status",
    },
    {
      title: "Total",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
      field: "products",
      formatter: (cell) => {
        const totalPrice = cell.getValue().reduce((prev, current) => {
          console.log(cell.getValue());
          return prev + parseFloat(current.price[current.volume]) * current.qty;
        }, 0);
        return totalPrice.toFixed(2);
      },
    },
  ];

  const nestedColumns = [
    {
      title: "Producto",
      headerSort: false,
      field: "name",
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Medida",
      headerSort: false,
      field: "volume",
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Precio",
      headerSort: false,
      field: "price",
      hozAlign: "center",
      formatter: (cell) => {
        const { price, volume } = cell.getData();
        return price[volume];
      },
      headerHozAlign: "center",
    },
    {
      title: "Cantidad",
      headerSort: false,
      field: "qty",
      hozAlign: "center",
      headerHozAlign: "center",
    },
    {
      title: "Subtotal",
      hozAlign: "center",
      headerSort: false,
      headerHozAlign: "center",
      formatter: (cell) => {
        const { price, volume, qty } = cell.getData();
        const total = price[volume] * qty;
        return total.toFixed(2);
      },
    },
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
