// src/components/ContentUsers.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';


const ContentComponents = ({ title, items, onViewMore, onEdit, onHandleClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-6  rounded-lg shadow-md">
      {/* Título */}
      <h2 className="text-3xl text-white font-bold mb-4">{title}</h2>

      {/* Botón para añadir un nuevo equipo */}
      <button
        className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 text-white px-4 py-2 rounded-md transition-all hover:scale-105 mb-6"
        onClick={onHandleClick}
      >
        Añadir Nuevo
      </button>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar..."
        className="border border-gray-300 rounded-md p-2 mb-6 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Lista de elementos */}
      <ul className="space-y-4">
        {filteredItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
            {/* Nombre del elemento */}
            <span className="text-lg">{item.nombre}</span>
            <span className="text-lg">{item.capacidad_total}</span>

            {/* Botones de acción */}
            <div className="space-x-4">
              <button
                className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 text-white px-4 py-2 rounded-md transition-all hover:scale-105"
                onClick={() => onViewMore(item.id)}
              >
                Ver más
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => onEdit(item.id)}
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
ContentComponents.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onViewMore: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onHandleClick: PropTypes.func.isRequired
};


export default ContentComponents;