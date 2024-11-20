import React, { useState } from 'react';
import axios from 'axios';
import cookies from 'react-cookies';
import PopupM from '../components/PopupM';

const GenericComponents = ({ components, onFetch }) => {
  const [newComponent, setNewComponent] = useState({ nombre: '', descripcion: '', cantidad: 0, marca: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [messagePopup, setMessagePopup] = useState('');
  const [popupTitle, setTitlePopup] = useState('');

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessagePopup('');
    setTitlePopup('');
  };

  const handleAddComponent = async () => {
    if (!newComponent.nombre || !newComponent.descripcion || newComponent.cantidad <= 0 || !newComponent.marca) {
      setMessagePopup('Por favor, completa todos los campos.');
      setTitlePopup('Error');
      setShowPopup(true);
      return;
    }

    try {
      await axios.post('https://inventariodeporcali.onrender.com/addGenericComponent/', newComponent, {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
      setNewComponent({ nombre: '', descripcion: '', cantidad: 0 });
      onFetch(); // Actualizar lista de componentes genéricos
    } catch (error) {
      console.error('Error al añadir componente:', error);
    }
  };

  return (
    <div className="p-4">
      <PopupM
        isOpen={showPopup}
        onClose={handleClosePopup}
        title={popupTitle}
        message={messagePopup}
      />
      <h2 className="text-lg font-bold mb-4">Componentes Genéricos</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newComponent.nombre}
          onChange={(e) => setNewComponent({ ...newComponent, nombre: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newComponent.descripcion}
          onChange={(e) => setNewComponent({ ...newComponent, descripcion: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={newComponent.cantidad}
          onChange={(e) => setNewComponent({ ...newComponent, cantidad: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Marca"
          value={newComponent.nombre}
          onChange={(e) => setNewComponent({ ...newComponent, marca: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleAddComponent}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Añadir Componente
        </button>
      </div>

      <ul className="mt-4">
        {components.map((comp, index) => (
          <li key={index} className="border-b py-2">
            <h4 className="font-bold">{comp.nombre}</h4>
            <p>{comp.descripcion}</p>
            <p>Cantidad: {comp.cantidad}</p>
          </li>
        ))}
      </ul>
    </div>
  
  );
};

export default GenericComponents;
