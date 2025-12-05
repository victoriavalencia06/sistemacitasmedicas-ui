// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-sections">
        {/* Columna Logo + Descripción */}
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-dot">M</span>MediClinic
          </div>
          <p>
            Clínica especializada en medicina integral, atención preventiva y
            servicios profesionales para el bienestar de toda la familia.
          </p>
        </div>

        {/* Columna Información */}
        <div className="footer-section" aria-label="Quick Information Links">
          <h5>Información</h5>
          <ul>
            <li><a href="#">Nuestra Clínica</a></li>
            <li><a href="#">Especialidades</a></li>
            <li><a href="#">Equipo Médico</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        {/* Columna Contacto */}
        <div className="footer-section" aria-label="Contact Information">
          <h5>Contacto</h5>
          <ul>
            <li>Calle Salud 123, Centro Médico, Ciudad</li>
            <li>
              <a
                href="mailto:contacto@mediclinic.com"
                className="footer-link d-inline-flex align-items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                  className="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.217l-8 4.8-8-4.8V4z"/>
                  <path d="M0 6.383v6.634l5.803-3.48L0 6.383zM6.761 9.83 16 16V6.383l-5.803 3.447-3.436 2.02z"/>
                </svg>
                contacto@mediclinic.com
              </a>
            </li>
            <li>
              <a
                href="tel:+34900111222"
                className="footer-link d-inline-flex align-items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                  className="bi bi-telephone" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 1 .736-.091c.637.273 1.82.933 
                    2.232 1.217a.678.678 0 0 1 .264.68l-.7 2.13a.678.678 0 0 
                    1-.448.463L5.78 5.847c.376.476.745 1.087 
                    1.124 1.685.174.258.422.524.774.686l.243.112a3.435 
                    3.435 0 0 1-.693 1.796c-.41.63-1.27 
                    2.16-2.899 2.902a3.513 3.513 0 0 
                    1-1.44.44c-.251.03-.477-.176-.51-.412a39.525 
                    39.525 0 0 1-.219-1.267C1.64 10.068 
                    1 5.584 1 5.584c-.01-.28.204-.527.485-.55l2.17-.23a.678.678 
                    0 0 1 .65.523l.466 2.093a.678.678 
                    0 0 1-.111.664l-1.2 1.527a11.064 11.064 
                    0 0 0 3.69 3.69l1.527-1.2a.678.678 
                    0 0 1 .664-.111l2.093.466a.678.678 
                    0 0 1 .523.65l-.23 2.17c-.023.28-.27.496-.55.485-.41-.023-4.484-.81-8.81-5.136C.64 4.584.854.527.854.527z"/>
                </svg>
                +34 900 111 222
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy */}
      <div className="footer-copy">© MediClinic. Todos los derechos reservados.</div>
    </footer>
  );
};

export default Footer;
