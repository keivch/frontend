import React from "react";

const PopupM = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-3xl text-center font-bold text-green-600">{title}</h2>
        <p className="text-gray-700 mt-4 text-center text-2xl">{message}</p>
        <div className="flex justify-end">
          <button
            className="mt-6 bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all hover:scale-105 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default PopupM;
