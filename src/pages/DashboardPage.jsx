import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import styles from "../styles/Dashboard.module.css";

function DashboardPage() {
  return (
    <>
      <NavBar />
      <header className={`container-fluid ${styles.parallax}`}>
        <div
          className={`container animate__animated animate__zoomIn ${styles.containerHeader}`}
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <h1 className={styles["home-title"]}>STARCATS</h1>
              <p className={styles["p-header"]}>
                Vive la experiencia <br /> del café con felinos
              </p>
            </div>
            <div className="col-12 col-md-6">
              <img
                src="/cup-coffee.png"
                alt="cup-coffee"
                className={styles["cup-coffee"]}
              />
            </div>
          </div>
        </div>
      </header>
      <Footer />
    </>
  );
}

export default DashboardPage;
