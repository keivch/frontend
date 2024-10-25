import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import PopupComponents from '../components/PopupComponents';
import ContentComponents from '../components/ContentComponents';

const Components = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [Components, setComponents] = useState([]);
  const [isEdit, setIsEdit] = useState(false);  // Estado para controlar si el popup está en modo edición o solo vista

  const navigate = useNavigate();



  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getDiscos/');
      setComponents(response.data.Discos); // Actualiza el estado con los equipos obtenidos
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchUsuarios(); // Llamar a la función para obtener equipos
  }, []);

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getDisco/', { id });
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
        SessionId: cookies.load("SessionId"),
      });
      cookies.remove("SessionId");
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
      alert('Por favor llene todos los campos');
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addDisco/', formData);
      alert(response.data.message);
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

  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>

      <section className="w-[84%] h-full bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        <ContentComponents
          title="Discos duros"
          items={Components}
          onViewMore={handleViewMore}
          onEdit={handleEdit}
          onHandleClick={handleClick}
        />
      </section>

      {/* Renderiza el Popup si isPopupOpen es true */}
      {isPopupOpen && (
        <PopupComponents
          edit={isEdit} // Controla si se puede editar o no
          formData={formData} // Pasa la información del equipo al popup
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>

  );
};

export default Components;