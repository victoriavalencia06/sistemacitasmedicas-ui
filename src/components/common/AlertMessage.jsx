// src/components/common/AlertMessage.jsx
import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const AlertMessage = ({ type = 'info', message }) => {
    if (!message) return null;

    const icons = {
        error: <FaExclamationTriangle style={{ marginRight: 8 }} />,
        success: <FaCheckCircle style={{ marginRight: 8 }} />,
        info: <FaInfoCircle style={{ marginRight: 8 }} />
    };

    const classes = {
        error: 'alert alert-danger',
        success: 'alert alert-success',
        info: 'alert alert-info'
    };

    return (
        <div className={classes[type] ?? classes.info} role="alert" style={{ marginBottom: 12 }}>
            {icons[type] ?? icons.info}
            <span>{message}</span>
        </div>
    );
};

export default AlertMessage;
