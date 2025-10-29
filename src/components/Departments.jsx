import React, { useState } from 'react';

const Departments = () => {
  const [activeDepartment, setActiveDepartment] = useState(null);

  const departments = [
    {
      id: 0,
      title: "Medicina General",
      description: "Atención primaria de la salud para todas las edades, diagnóstico y tratamiento de enfermedades comunes.",
      services: [
        "Consulta médica general",
        "Chequeos preventivos",
        "Tratamiento de enfermedades comunes",
        "Referencia a especialistas"
      ],
      image: "/images/medicinaGeneral.png"
    },
    {
      id: 1,
      title: "Salud Preventiva",
      description: "Enfoque en la prevención de enfermedades y promoción de hábitos saludables.",
      services: [
        "Chequeos médicos periódicos",
        "Vacunación",
        "Control de presión arterial",
        "Orientación nutricional"
      ],
      image: "/images/saludPreventiva.png"
    },
    {
      id: 2,
      title: "Pediatría",
      description: "Atención integral de la salud de niños y adolescentes.",
      services: [
        "Control de crecimiento y desarrollo",
        "Vacunación infantil",
        "Atención de enfermedades infantiles",
        "Orientación a padres"
      ],
      image: "/images/pedriatria.png"
    },
    {
      id: 3,
      title: "Cirugía Menor",
      description: "Procedimientos quirúrgicos ambulatorios de baja complejidad.",
      services: [
        "Extracción de lunares",
        "Suturas de heridas menores",
        "Extracción de uñas",
        "Drenaje de abscesos"
      ],
      image: "/images/cirugiaMenor.png"
    },
    {
      id: 4,
      title: "Ginecología y Obstetricia",
      description: "Cuidado de la salud reproductiva femenina y atención durante el embarazo.",
      services: [
        "Control prenatal",
        "Ultrasonidos obstétricos",
        "Planificación familiar",
        "Atención de parto"
      ],
      image: "/images/ginecologia.png"
    },
    {
      id: 5,
      title: "Dermatología",
      description: "Diagnóstico y tratamiento de enfermedades de la piel, cabello y uñas.",
      services: [
        "Tratamiento de acné",
        "Revisión de lunares",
        "Tratamiento de dermatitis",
        "Cirugía menor de piel"
      ],
      image: "/images/dermatologia.png"
    },
    {
      id: 6,
      title: "Exámenes e Imágenes",
      description: "Estudios de diagnóstico por imágenes y pruebas de laboratorio.",
      services: [
        "Ultrasonidos",
        "Rayos X",
        "Exámenes de laboratorio",
        "Electrocardiograma (ECG)"
      ],
      image: "/images/examenes.png"
    },
    {
      id: 7,
      title: "Atención de Emergencias",
      description: "Atención médica inmediata para situaciones urgentes.",
      services: [
        "Atención de urgencias",
        "Estabilización de pacientes",
        "Curaciones rápidas",
        "Referencia a hospitalización"
      ],
      image: "/images/emergencias.png"
    }
  ];


  return (
    <section className="departments-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-subtitle">DEPARTAMENTOS</h2>
          <h3 className="section-title">Nuestros Servicios Médicos</h3>
          <p className="section-description">
            Contamos con diversas especialidades médicas para el cuidado integral de tu salud.
          </p>
        </div>

        <div className="department-selector">
          {/* Miniaturas en fila horizontal con scroll */}
          <div className="department-thumbnails">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`department-thumbnail ${activeDepartment === dept.id ? 'active' : ''}`}
                onClick={() => setActiveDepartment(dept.id)}
              >
                <img src={dept.image} alt={dept.title} />
                <div className="thumbnail-title">{dept.title}</div>
              </div>
            ))}
          </div>

          {/* Contenido dinámico debajo */}
          {activeDepartment !== null && (
            <div className="department-content">
              <button
                className="close-btn"
                onClick={() => setActiveDepartment(null)}
                aria-label="Cerrar detalle de departamento"
              >
                ×
              </button>

              <h4 className="department-title">{departments[activeDepartment].title}</h4>
              <p className="department-description">{departments[activeDepartment].description}</p>

              <div className="department-services">
                {departments[activeDepartment].services.map((service, index) => (
                  <div key={index} className="service-item">
                    <span className="check-icon">✓</span>
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <button className="know-more-btn">Ver más</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Departments;
