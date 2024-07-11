import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function DashboardPage() {
  return (
    <>
      <NavBar />

      <div className="row">
        <div className="col-2"></div>
        <div className="col-10">
          <h4>Welcome to StarCats Admin</h4>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DashboardPage;
