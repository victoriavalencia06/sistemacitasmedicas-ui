export default function Header() {
  return (
    <header className="glass">
      <nav className="navbar navbar-expand-lg container">
        <a className="navbar-brand" href="#">MediCitas</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="#home">Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="#services">Servicios</a></li>
            <li className="nav-item"><a className="nav-link" href="#about">Sobre Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contacto</a></li>
          </ul>
          <a href="#login" className="btn-import ms-2">Iniciar Sesión</a>
        </div>
      </nav>
    </header>
  );
}
