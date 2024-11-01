import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import Content from "../components/Content";
import Popup from "../components/Popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";

const Equipo = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);  // Estado para controlar si el popup está en modo edición o solo vista

  const navigate = useNavigate();


  const fetchEquipos = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getEquipos/', 
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setEquipos(response.data.equipos); // Actualiza el estado con los equipos obtenidos
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  };

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchEquipos(); // Llamar a la función para obtener equipos
  }, []);

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getEquipo/', { id },
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      response.data.equipo.usuario = response.data.equipo.usuario.nombre;
      setFormData(response.data.equipo); // Actualiza el formulario con la información del equipo
      setIsEdit(edit);  // Desactiva la edición
      setIsPopupOpen(true); // Abre el popup
    } catch (error) {
      console.error('Error al obtener el equipo:', error);
      alert('Error al obtener la información del equipo');
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
    if (formData.usuario === '') {
      alert('Error al agregar el equipo: falta seleccionar usuario');
      return;
    }
    if (formData.serial === '') {
      alert('Error al agregar el equipo: falta rellenar serial');
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addEquipo/', formData, 
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      alert(response.data.message);
      setIsPopupOpen(false); // Cierra el popup tras guardar
      fetchEquipos(); // Actualiza la lista de equipos
    } catch (error) {
      console.error('Error al agregar el equipo:', error);
      alert('Error al agregar el equipo: falta rellenar campos' );
    }
  };

  const handleClick = async () => {
    setFormData({ sede: '',
      ubicacion: '',
      tipo: '',
      marca: '',
      modelo: '',
      estado: '',
      codigo: '',
      serial: '',
      procesador: '',
      ram: '',
      Disco: '',
      perifericos: '',
      disco_externo: '',
      observaciones: '',
      cargo: '',
      usuario : '',
      revisado: false,
      windows: false,
      office: false,});
      setIsEdit(true);
      setIsPopupOpen(true);
  };

  return (
    <main className="bg-slate-50 w-full h-screen flex">
    <section className="w-[16%] h-full">
      <Sidebar onLogout={handleLogout} />
    </section>
  
    <section className="w-[84%] h-full bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
      <Content
        title="Equipos"
        items={equipos}
        onViewMore={handleViewMore}
        onEdit={handleEdit}
        onHandleClick={handleClick}
      />
    </section>
  
    {/* Renderiza el Popup si isPopupOpen es true */}
    {isPopupOpen && (
      <Popup
        edit={isEdit} // Controla si se puede editar o no
        formData={formData} // Pasa la información del equipo al popup
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSave}
      />
    )}
  </main>
  
  );
};

export default Equipo;


