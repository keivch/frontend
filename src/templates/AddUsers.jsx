import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import ContentUsers from '../components/contentUsers';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import PopupAddUser from '../components/popupAddUser';
import PopupCargo from '../components/PopupCargo';

const AddUsers = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupCargoOpen, setIsPopupCargoOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);  // Estado para controlar si el popup está en modo edición o solo vista

  const navigate = useNavigate();


  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getUsers/');
      setUsers(response.data.userss); // Actualiza el estado con los equipos obtenidos
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
      const response = await axios.post('https://inventariodeporcali.onrender.com/getUser/', { id });
      response.data.user.cargo = response.data.user.cargo.nombre;
      setFormData(response.data.user); // Actualiza el formulario con la información del equipo
      setIsEdit(edit);  // Desactiva la edición
      setIsPopupOpen(true); // Abre el popup
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      alert('Error al obtener la información del equipo');
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
    if (formData.nombre === '' || formData.cargo === '' || formData.cedula === '' || formData.correo === '' || formData.telefono === '') {
      alert('Por favor llene todos los campos');
      return;
    }
    if (formData.correo !== '' && !/\S+@\S+\.\S+/.test(formData.correo)) {
      alert('Por favor ingrese un correo valido');
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addUsers/', formData);
      alert(response.data.message);
      setIsPopupOpen(false); // Cierra el popup tras guardar
      fetchUsuarios(); // Actualiza la lista de equipos
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      alert('Error : ' + error.response.data.error);
    }
  };

  const saveCargo = async (formData) => {
    if (formData.nombre === '') {
      alert('Por favor llene todos los campos');
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addCargo/', formData);
      alert(response.data.message);
      setIsPopupCargoOpen(false); // Cierra el popup tras guardar
      fetchUsuarios(); // Actualiza la lista de equipos
    } catch (error) {
      console.error('Error al agregar el cargo:', error);
      alert('Error : ' + error.response.data.error);
    }
  };

  const handleClick = async () => {
    setFormData({                // Este será generado automáticamente en Django, así que no necesitas llenarlo en el formulario
      nombre: '',
      telefono: '',
      correo: '',
      cedula: '',
      cargo: '',
    });
    setIsEdit(true);
    setIsPopupOpen(true);
  };

  const handleClickCargo = async () => {
    setFormData({                // Este será generado aquí en Django, así que no necesitas llenarlo en el formulario
      nombre: ''
    });
    setIsEdit(true);
    setIsPopupCargoOpen(true);
  };

  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>

      <section className="w-[84%] h-full bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        <ContentUsers
          title="Usuarios"
          items={users}
          onViewMore={handleViewMore}
          onEdit={handleEdit}
          onHandleClick={handleClick}
          addCargo={handleClickCargo}
        />
      </section>

      {/* Renderiza el Popup si isPopupOpen es true */}
      {isPopupOpen && (
        <PopupAddUser
          edit={isEdit} // Controla si se puede editar o no
          formData={formData} // Pasa la información del equipo al popup
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSave}
        />
      )}
      {isPopupCargoOpen && (
        <PopupCargo
          edit={isEdit} // Controla si se puede editar o no
          formData={formData} // Pasa la información del equipo al popup
          onClose={() => setIsPopupCargoOpen(false)}
          onSave={saveCargo}
        />
      )}
    </main>

  );
};

export default AddUsers;

