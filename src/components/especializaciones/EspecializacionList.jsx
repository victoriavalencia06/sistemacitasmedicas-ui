import React from 'react';
import { FaStethoscope } from 'react-icons/fa';
import EspecializacionItem from './EspecializacionItem';

const EspecializacionList = ({ especializaciones, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando especializaciones...</p>
            </div>
        );
    }

    if (especializaciones.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaStethoscope size={48} />
                </div>
                <h3 className="management-empty-title">No hay especializaciones registradas</h3>
                <p className="management-empty-text">Comienza creando la primera especialización en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Especializaciones</h2>
                <p className="management-table-subtitle">
                    {especializaciones.length} {especializaciones.length === 1 ? 'especialización registrada' : 'especializaciones registradas'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre de la Especialización</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {especializaciones.map((especializacion) => (
                            <EspecializacionItem
                                key={especializacion.id}
                                especializacion={especializacion}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EspecializacionList;