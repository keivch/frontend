// Notification.jsx
import React, { useEffect } from 'react';

const Notification = ({ message, onReload }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Aquí puedes manejar el cierre automático si lo deseas
        }, 15000); // 15 segundos

        return () => clearTimeout(timer); // Limpiar el timer al desmontar
    }, []);

    return (
        <div className="notification fixed bottom-5 right-5 p-4 bg-blue-500 text-white rounded shadow-lg">
            {message}
            <div className="mt-2">
                <button 
                    onClick={onReload} 
                    className="bg-white text-blue-500 rounded px-2 py-1 hover:bg-gray-200"
                >
                    Recargar
                </button>
            </div>
        </div>
    );
};

export default Notification;


