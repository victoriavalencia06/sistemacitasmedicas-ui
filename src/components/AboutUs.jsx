import React from 'react';

const AboutUs = () => {
    return (
        <section className="about-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-subtitle">SOBRE NOSOTROS</h2>
                    <h3 className="section-title">Nuestra Esencia</h3>
                </div>

                <div className="about-content-simple">
                    <div className="about-image">
                        <img
                            src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Médicos de Mediclinic"
                        />
                    </div>

                    <div className="about-info">
                        <div className="about-details">
                            <p>
                                <strong>Mediclinic</strong> es una red de clínicas de atención primaria que ofrece
                                servicios médicos de excelencia de forma eficiente, accesible y, sobretodo, humana.
                            </p>
                            <p>
                                Nuestras especialidades son la <strong>medicina general</strong> y la
                                <strong> medicina preventiva</strong>. Nuestro mayor orgullo: un equipo de
                                médicos altamente calificados que se preocupan genuinamente por cada paciente.
                                Porque cuando hay vocación, se siente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;