import Header from "../components/Header";
import Departments from "../components/Departments";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <>
            {/* Header */}
            <Header />
            <section id="home" className="hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold">
                                Agenda tus citas médicas fácilmente desde cualquier lugar
                            </h1>
                            <p className="lead">
                                Con MediCitas puedes programar, consultar y gestionar tus citas de forma rápida y segura.
                            </p>
                            <a href="#contact" className="btn-import mt-3">Comienza Ahora</a>
                        </div>
                        <div className="col-lg-6 text-center mt-4 mt-lg-0">
                            <img
                                src="https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/clinic/medic1.png"
                                alt="Doctor con calendario"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Servicios */}
            <Departments />

            {/* Contacto */}
            <Contact />

            {/* Sobre nosotros */}
            <AboutUs />

            {/* Footer */}
            <Footer />
        </>
    );
}
