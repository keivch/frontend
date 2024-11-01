import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado

const Popup = ({ edit = false, onClose, onSave, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setFormData(initialFormData); // Actualiza los datos cuando cambien
  }, [initialFormData]);

  useEffect(() => {
    // Solo realizar búsqueda si hay texto en el campo de búsqueda
    if (searchTerm) {
      const debounceSearch = setTimeout(() => {
        handleSearch();
      }, 2000); // Tiempo de espera para evitar múltiples llamadas a la API mientras se escribe
      return () => clearTimeout(debounceSearch);
    } else {
      setUserResults([]); // Limpiar resultados si no hay término de búsqueda
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Actualizar el estado del término de búsqueda si el campo de entrada es 'usuario'
    if (name === 'usuario') {
      setSearchTerm(value);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://inventariodeporcali.onrender.com/getUserss/?q=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("SessionId")}`
          }
        }
      );
      setUserResults(response.data.userss);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData(prevFormData => ({
      ...prevFormData,
      usuario: user.nombre,
      cargo: user.cargo.nombre
    }));
    setUserResults([]); // Limpiar resultados de búsqueda
    setSearchTerm(''); // Limpiar término de búsqueda
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);  // Llama a la función onSave pasada desde el componente padre
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto"> {/* Altura ajustada y barra de desplazamiento */}
        <h2 className="text-xl font-bold mb-4">{edit ? 'Editar Información' : 'Ver Información'}</h2>

        {/* Contenedor con barra de desplazamiento */}
        <div className="overflow-y-auto max-h-[70vh] relative ">
          <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Object.keys(formData).map((key) => (
              key !== 'revisado' && key !== 'windows' && key !== 'office' && key !== 'observaciones' ? (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace('_', ' ')}
                  </label>
                  <div className="flex items-center">
                    <input
                      type={key === 'codigo' ? 'number' : 'text'}
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      disabled={key === 'cargo' || !edit}  // Deshabilita el campo cargo si no está en modo edición
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-lg py-2 px-3"
                    />
                    {key === 'usuario' && (
                      <>
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="ml-2 bg-gray-300 p-2 rounded-md"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
                          </svg>
                        </button>
                        {userResults.length > 0 && (
                          <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full">
                            <ul className="max-h-60 overflow-y-auto">
                              {userResults.map(user => (
                                <li
                                  key={user.id}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => handleSelectUser(user)}
                                >
                                  {user.nombre}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : key === 'observaciones' ? (
                <div key={key} className="mb-4 col-span-4">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    Observaciones
                  </label>
                  <textarea
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    disabled={!edit}  // Deshabilita el campo si no está en modo edición
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-lg py-2 px-3"
                    rows={4} // Hacer que el textarea sea más grande que los demás campos
                  />
                </div>
              ) : (
                <div key={key} className="flex items-center mb-4 col-span-1">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key] || false}
                    onChange={handleChange}
                    disabled={!edit}  // Deshabilita los campos si no está en modo edición
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={key} className="ml-2 block text-sm font-medium text-gray-700 capitalize">
                    {key}
                  </label>
                </div>
              )
            ))}

            <div className="flex justify-end space-x-4 col-span-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
              >
                Cerrar
              </button>
              {edit && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-900 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-800"
                >
                  Guardar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;







