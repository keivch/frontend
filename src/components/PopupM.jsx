import React from "react";

const PopupM = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-green-600">{title}</h2>
        <p className="text-gray-700 mt-4">{message}</p>
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PopupM;
