import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'react-cookies';

const PopupPassword = ({ edit = false, onClose, onSave, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [cargoResults, setCargoResults] = useState([]);

  useEffect(() => {
    setFormData(initialFormData); // Actualiza los datos cuando cambien
  }, [initialFormData]);

  useEffect(() => {
    // Realizar búsqueda de usuario si hay texto en el campo de búsqueda de usuario
    if (userSearchTerm) {
      const debounceSearch = setTimeout(() => {
        handleSearchUser();
      }, 1000); // Tiempo de espera para evitar múltiples llamadas a la API mientras se escribe
      return () => clearTimeout(debounceSearch);
    } else {
      setUserResults([]); // Limpiar resultados si no hay término de búsqueda
    }
  }, [userSearchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Para el campo de usuario, actualizar el término de búsqueda
    if (name === 'Usuario') {
      setUserSearchTerm(value);
    }
  };

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(`https://inventariodeporcali.onrender.com/getUserss2/?q=${userSearchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setUserResults(response.data.userss); // Asegúrate de que 'users' sea el campo correcto en la respuesta
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSelectUser = (user) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Usuario: user.nombre,
    }));
    setUserResults([]); // Limpiar resultados de búsqueda
    setUserSearchTerm(''); // Limpiar término de búsqueda
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria
    setFormData({
      ...formData,
      contrasena: randomPassword, // Actualiza el campo de contraseña con la aleatoria
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
        <h2 className="text-lg font-bold mb-4">{edit ? 'Editar Información' : 'Ver Información'}</h2>

        <form className="grid grid-cols-2 gap-4">
          {/* Ubicación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              name="Ubicacion"
              value={formData.Ubicacion || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Usuario con lupa */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="Usuario"
                value={formData.Usuario || ''}
                onChange={handleChange}
                disabled={!edit}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {edit && (
                <>
                  <button
                    type="button"
                    onClick={handleSearchUser}
                    className="ml-2 bg-gray-300 p-2 rounded-md"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
                    </svg>
                  </button>
                  {userResults.length > 0 && (
                    <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full z-10">
                      <ul className="max-h-60 overflow-y-auto">
                        {userResults.map((user) => (
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

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="contrasena"
                value={formData.contrasena || ''}
                onChange={handleChange}
                disabled={!edit}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {edit && (
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="ml-2 bg-gray-300 p-2 rounded-md"
                >
                  Generar
                </button>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <input
              type="text"
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Tipo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo || ''}
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

export default PopupPassword;



