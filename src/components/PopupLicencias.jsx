import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'react-cookies';

const PopupLicencias = ({ edit = false, onClose, onSave, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [keySearchTerm, setKeySearchTerm] = useState('');
  const [keyResults, setKeyResults] = useState([]);

  useEffect(() => {
    setFormData(initialFormData); // Actualiza los datos cuando cambien
  }, [initialFormData]);

  // Efecto para buscar usuarios cuando el campo de búsqueda cambia
  useEffect(() => {
    if (userSearchTerm) {
      const debounceSearch = setTimeout(() => {
        handleSearchUser();
      }, 500); // Tiempo de espera para evitar múltiples llamadas a la API mientras se escribe
      return () => clearTimeout(debounceSearch);
    } else {
      setUserResults([]); // Limpiar resultados si no hay término de búsqueda
    }
  }, [userSearchTerm]);

  useEffect(() => {
    if (keySearchTerm) {
      const debounceSearch = setTimeout(() => {
        handleSearchKey();
      }, 500); // Tiempo de espera para evitar llamadas a la API mientras se escribe
      return () => clearTimeout(debounceSearch);
    } else {
      setKeyResults([]); // Limpiar resultados si no hay búsqueda
    }
  }, [keySearchTerm]);


  const handleSearchKey = async () => {
    try {
      const response = await axios.get(`https://inventariodeporcali.onrender.com/getLlaves/?q=${keySearchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setKeyResults(response.data.llaves); // 'keys' debe coincidir con la estructura de la respuesta de la API
    } catch (error) {
      console.error('Error al buscar llaves:', error);
    }
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Actualizar término de búsqueda de usuario
    if (name === 'nombre') {
      setUserSearchTerm(value);
    }

    // Actualizar búsqueda de llave
    if (name === 'llave') {
      setKeySearchTerm(value);
    }
  };

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/getUserss2/?q=${userSearchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setUserResults(response.data.userss); // 'users' debe coincidir con la estructura de la respuesta de la API
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSelectUser = (user) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      nombre: user.nombre,
      cargo: user.cargo.nombre, // Actualiza automáticamente el cargo del usuario seleccionado
    }));
    setUserResults([]); // Limpiar resultados de búsqueda
    setUserSearchTerm(''); // Limpiar término de búsqueda
  };

  const handleSelectKey = (key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      llave: key.llave,
    }));
    setKeyResults([]); // Limpiar resultados de búsqueda
    setKeySearchTerm(''); // Limpiar búsqueda
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
          {/* Fecha (solo visualización) */}
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="text"
              name="fecha"
              value={formData.fecha || new Date().toISOString().split('T')[0]} // Mostrar la fecha actual si no hay valor
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Buscador de Nombre */}
          <div className="mb-4 col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                disabled={!edit}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {edit && (
                <>
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

          {/* Cargo (actualiza automáticamente basado en el usuario seleccionado) */}
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo || ''}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Office */}
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Office
            </label>
            <input
              type="text"
              name="office"
              value={formData.office || ''}
              onChange={handleChange}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Llave */}
          <div className="mb-4 col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700">
              Llave
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="llave"
                value={formData.llave || ''}
                onChange={handleChange}
                disabled={!edit}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {edit && (
                <>
                  {keyResults.length > 0 && (
                    <div className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full z-10">
                      <ul className="max-h-60 overflow-y-auto">
                        {keyResults.map((key) => (
                          <li
                            key={key.id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectKey(key)}
                          >
                            {key.llave}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
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

export default PopupLicencias;
