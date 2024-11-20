import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import axios from "axios";
import { replace, useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import PopupComponents from '../components/PopupComponents';
import ContentComponents from '../components/ContentComponents';
import PopupM from '../components/PopupM';
import ConfirmPopup from '../components/PopupConfirmacion';

const Components = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [components, setComponents] = useState([]);
  const [showGenericComponents, setShowGenericComponents] = useState(false); // Mostrar u ocultar componentes genéricos
  const [genericComponents, setGenericComponents] = useState([]);
  const [genericForm, setGenericForm] = useState({ nombre: '', descripcion: '', cantidad: 0, marca: '' });
  const [isEdit, setIsEdit] = useState(false)
  const [showPopupM, setShowPopupM] = useState(false);
  const [messagePopupM, setMessagePopupM] = useState('');
  const [popupTitle, setTitlePopupM] = useState('');
  const [showPopupC, setShowPopupC] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleClosePopupC = () => {
    setShowPopupC(false);
  };


  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopupM(false);
    setTitlePopupM('');
    setMessagePopupM('');
  };

  const fetchDiscos = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getDiscos/', {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
      setComponents(response.data.Discos);
    } catch (error) {
      console.error('Error al obtener los discos:', error);
    }
  };

  // Obtener Componentes Genéricos
  const fetchGenericComponents = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getGenericComponents/', {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
      setGenericComponents(response.data.componentesGenericos);
    } catch (error) {
      console.error('Error al obtener componentes genéricos:', error);
    }
  };

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getDisco/', { id },
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setFormData(response.data.disco); // actualiza el formulario con la información del equipo
      setIsEdit(edit);  // Desactiva la edición
      setIsPopupOpen(true); // Abre el popup
    } catch (error) {
      console.error('Error al obtener el Disco:', error);
      alert('Error al obtener la información del disco');
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await axios.post("https://inventariodeporcali.onrender.com/logout/", {
        SessionId: cookies.load("sessionid"),
      });
      cookies.remove("sessionid");
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleEdit = (id) => {
    setIsEdit(true);  // Activa la edición
    handleViewMore(id, true);
  };

  const handleSave = async (formData) => {
    if (formData.nombre === '' || formData.capacidad_total === '' || formData.ocupado === '' || formData.disponible === '' || formData.contenido === '' || formData.observaciones === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addDisco/', formData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setMessagePopupM(response.data.message);
      setTitlePopupM("Exito");
      setShowPopupM(true);
      setIsPopupOpen(false); // Cierra el popup tras guardar
      fetchUsuarios(); // Actualiza la lista de equipos
    } catch (error) {
      console.error('Error al agregar el disco:', error);
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleClick = async () => {
    setFormData({                // Este será generado automáticamente en Django, así que no necesitas llenarlo en el formulario
      nombre: '',
      capacidad_total: '',
      ocupado: '',
      disponible: '',
      contenido: '',
      observaciones: '',
    });
    setIsEdit(true);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (!cookies.load("sessionid")) {
      navigate("/",  { replace: true });
    }
  }, []);

  useEffect(() => {
    fetchDiscos();
    fetchGenericComponents();
  }, []);

  // Función para añadir un componente genérico
  const handleAddGenericComponent = async () => {
    if (!genericForm.nombre || !genericForm.descripcion || genericForm.cantidad <= 0) {
      setMessagePopupM('Por favor, completa los campos necesarios.');
      setTitlePopupM('Error');
      setShowPopupM(true);

      return;
    }
    try {
      await axios.post('https://inventariodeporcali.onrender.com/addGenericComponent/', genericForm, {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
      setGenericForm({ nombre: '', descripcion: '', cantidad: 0, marca: '' });
      fetchGenericComponents(); // Recargar lista
    } catch (error) {
      console.error('Error al añadir componente:', error);
    }
  };

  const handleShowPopup = (id) => {
    setShowPopupC(true);
    setSelectedId(id);
  };

 const handleDelete = async () => {
  console.log(selectedId);
  try {
    await axios.delete('https://inventariodeporcali.onrender.com/deleteComponente/', {
      params: { id: selectedId },
      headers: {
        'Authorization': `Bearer ${cookies.load("sessionid")}`,
      },
    });
    setTitlePopupM('Éxito');
    setMessagePopupM('Equipo eliminado con éxito');
    setShowPopupM(true);
    setSelectedId("");
    fetchGenericComponents();
  } catch (error) {
    console.error('Error al eliminar el equipo:', error);
  }
};


  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>

      <section className="w-[84%] h-full bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        <div className="p-8">
          {/* Botón para alternar entre Discos y Componentes Genéricos */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{showGenericComponents ? "Componentes Genéricos" : "Discos Duros"}</h2>
            <button
              onClick={() => setShowGenericComponents(!showGenericComponents)}
              className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all hover:scale-105 text-white text-xl font-bold p-4 rounded-lg shadow-lg"
            >
              {showGenericComponents ? "Ocultar Otros Componentes" : "Componentes Genéricos"}
            </button>
          </div>
          {/* Renderiza el Popup si isPopupOpen es true */}
          {isPopupOpen && (
            <PopupComponents
              edit={isEdit} // Controla si se puede editar o no
              formData={formData} // Pasa la información del equipo al popup
              onClose={() => setIsPopupOpen(false)}
              onSave={handleSave}
            />
          )}
          <PopupM
            title={popupTitle}
            message={messagePopupM}
            isOpen={showPopupM}
            onClose={handleClosePopup}
          />

          {/* Render Condicional */}
          {!showGenericComponents ? (
            <div className="mt-4">
              <ContentComponents
                title="Discos Duros"
                items={components}
                onViewMore={handleViewMore}
                onEdit={handleEdit}
                onHandleClick={handleClick}
              />
            </div>
          ) : (
            <div className="mt-4 p-6 rounded shadow-md">
              <h3 className="text-lg font-bold mb-4 text-white">Añadir Componente Genérico</h3>
              <input
                type="text"
                placeholder="Nombre *"
                value={genericForm.nombre}
                onChange={(e) => setGenericForm({ ...genericForm, nombre: e.target.value })}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Marca"
                value={genericForm.marca}
                onChange={(e) => setGenericForm({ ...genericForm, marca: e.target.value })}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Descripción *"
                value={genericForm.descripcion}
                onChange={(e) => setGenericForm({ ...genericForm, descripcion: e.target.value })}
                className="border p-2 w-full mb-2"
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={genericForm.cantidad}
                onChange={(e) => setGenericForm({ ...genericForm, cantidad: Number(e.target.value) })}
                className="border p-2 w-full mb-4"
              />
              <button
                onClick={handleAddGenericComponent}
                className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 text-white px-4 py-2 rounded-md transition-all hover:scale-105 mb-6"
              >
                Añadir Componente
              </button>

              {/* Listado de Componentes Genéricos */}
              <ul className="mt-6">
                {(genericComponents || []).map((comp, index) => (
                  <li key={index} className="border-b py-2 text-white">
                    <strong>{comp?.nombre || "Sin nombre"}</strong> - {comp?.descripcion || "Sin descripción"} (Cantidad: {comp?.cantidad || 0})(Marca: {comp?.marca || "Sin marca"})
                    <button onClick={() => handleShowPopup(comp?.id)} className="bg-red-500 text-white p-2 rounded ml-2">Eliminar</button>
                  </li>
                ))}
              </ul>

            </div>
          )}
        </div>
      </section>
      <ConfirmPopup
        show={showPopupC}
        onClose={handleClosePopupC}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default Components;

