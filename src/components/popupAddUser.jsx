import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopupAddUser = ({ edit = false, onClose, onSave, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [cargoResults, setCargoResults] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);

  useEffect(() => {
    setFormData(initialFormData); // Actualiza los datos cuando cambien
  }, [initialFormData]);

  useEffect(() => {
    // Realizar búsqueda si hay texto en el campo de búsqueda de cargo
    if (searchTerm) {
      const debounceSearch = setTimeout(() => {
        handleSearchCargo();
      }, 1000); // Tiempo de espera para evitar múltiples llamadas a la API mientras se escribe
      return () => clearTimeout(debounceSearch);
    } else {
      setCargoResults([]); // Limpiar resultados si no hay término de búsqueda
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'cargo') {
      setSearchTerm(value); // Actualizar el término de búsqueda para el cargo
    }
  };

  const handleSearchCargo = async () => {
    try {
      const response = await axios.get(`https://inventariodeporcali.onrender.com/getCargos/?q=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("SessionId")}`
          }
        }
      );
      setCargoResults(response.data.cargos);
    } catch (error) {
      console.error('Error al buscar cargos:', error);
    }
  };

  const handleSelectCargo = (cargo) => {
    setSelectedCargo(cargo);
    setFormData(prevFormData => ({
      ...prevFormData,
      cargo: cargo.nombre
    }));
    setCargoResults([]); // Limpiar resultados de búsqueda
    setSearchTerm(''); // Limpiar término de búsqueda
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData); // Llama a la función onSave pasada desde el componente padre
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">{edit ? 'Editar Información' : 'Ver Información'}</h2>

        <form className="grid grid-cols-1 gap-4">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre
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

          {/* Cargo con lupa */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="cargo"
                value={formData.cargo || ''}
                onChange={handleChange}
                disabled={!edit}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {edit && (
                <>
                  <button
                    type="button"
                    onClick={handleSearchCargo}
                    className="ml-2 bg-gray-300 p-2 rounded-md"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
                    </svg>
                  </button>
                  {cargoResults.length > 0 && (
                    <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full">
                      <ul className="max-h-60 overflow-y-auto">
                        {cargoResults.map(cargo => (
                          <li
                            key={cargo.id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectCargo(cargo)}
                          >
                            {cargo.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="number"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Correo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Cédula */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cédula
            </label>
            <input
              type="number"
              name="cedula"
              value={formData.cedula || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
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

export default PopupAddUser;

