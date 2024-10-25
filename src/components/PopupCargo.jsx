import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopupCargo = ({ edit = false, onClose, onSave, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData); // Actualiza los datos cuando cambien
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData); // Llama a la función onSave pasada desde el componente padre
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">{edit ? 'Añadir Cargo' : 'Ver Llave'}</h2>

        <form className="grid grid-cols-2 gap-4">
          {/* Llave */}
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cerrar
            </button>
            {edit && (
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800"
              >
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupCargo;
