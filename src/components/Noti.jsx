// Notification.jsx
import React, { useState, useEffect } from 'react';

const Notification = ({ message, onReload }) => {
    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 15000); // Ocultar después de 15 segundos

        return () => clearTimeout(timer); // Limpiar el timer al desmontar
    }, []);

    if (!showNotification) return null; // No mostrar nada si la notificación está oculta

    return (
        <div className="notification fixed bottom-5 right-5 p-4 bg-blue-500 text-white rounded shadow-lg">
            <p>{message}</p>
            <div className="mt-2">
                
            </div>
        </div>
    );
};

export default Notification;



