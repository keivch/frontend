import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import ContentLicencias from '../components/ContentLicencias';
import PopupLicencias from '../components/PopupLicencias';
import PopupLlave from '../components/PopupLlave';

const Licencias = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenLlave, setIsPopupOpenLlave] = useState(false);

  const [formLicenciaData, setFormLicenciaData] = useState({}); // Estado para licencias
  const [formLlaveData, setFormLlaveData] = useState({}); // Estado para llaves

  const [Licencias, setLicencias] = useState([]);
  const [isEdit, setIsEdit] = useState(false);  // Estado para controlar si el popup está en modo edición o solo vista

  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getLicencias/', {
        headers: {  
          'Authorization': `Bearer ${cookies.load("SessionId")}`
        }
      });
      setLicencias(response.data.Licencias); // Actualiza el estado con los equipos obtenidos
    } catch (error) {
      console.error('Error al obtener las licencias:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios(); // Llamar a la función para obtener equipos
  }, []);

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getLicencia/', { id });
      response.data.licencia.nombre = response.data.licencia.nombre.nombre;
      response.data.licencia.llave = response.data.licencia.llave.llave;
      setFormLicenciaData(response.data.licencia); // Actualiza el formulario con la información de la licencia
      setIsEdit(edit);  // Establece si es edición o solo visualización
      setIsPopupOpen(true); // Abre el popup de licencias
    } catch (error) {
      console.error('Error al obtener la licencia:', error);
      alert('Error al obtener la licencia');
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

  const handleSaveLicencia = async (formData) => {
    if (formData.nombre === '') {
      alert('Error al agregar la licencia: falta seleccionar nombre');
      return;
    }
    if (formData.llave === '') {
      alert('Error al agregar la licencia: falta rellenar llave');
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addLicencia/', formData);
      alert(response.data.message);
      setIsPopupOpen(false); // Cierra el popup tras guardar
      fetchUsuarios(); // Actualiza la lista de licencias
    } catch (error) {
      console.error('Error al agregar la licencia:', error);
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleSaveLlave = async (formData) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addLlave/', formData);
      alert(response.data.message);
      setIsPopupOpenLlave(false); // Cierra el popup tras guardar
      fetchUsuarios(); // Actualiza la lista de licencias
    } catch (error) {
      console.error('Error al agregar la llave:', error);
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleClick = async () => {
    setFormLicenciaData({
      fecha: '',
      nombre: '',
      cargo: '',
      office: '',
      llave: ''
    });
    setIsEdit(true);
    setIsPopupOpen(true);
    console.log('click');
  };

  const addKey = async () => {
    setFormLlaveData({ llave: '' });
    setIsEdit(true);
    setIsPopupOpenLlave(true);

  };

  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>

      <section className="w-[84%] h-full bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        <ContentLicencias
          title="Licencias"
          items={Licencias}
          onViewMore={handleViewMore}
          onEdit={handleEdit}
          onHandleClick={handleClick}
          addKey={addKey}
        />
      </section>

      {/* Renderiza el Popup de licencias si isPopupOpen es true */}
      {isPopupOpen && (
        <PopupLicencias
          edit={isEdit} // Controla si se puede editar o no
          formData={formLicenciaData} // Pasa la información de la licencia al popup
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveLicencia}
        />
      )}

      {/* Renderiza el Popup de llaves si isPopupOpenLlave es true */}
      {isPopupOpenLlave && (
        <PopupLlave
          edit={isEdit} // Controla si se puede editar o no
          formData={formLlaveData} // Pasa la información de la llave al popup
          onClose={() => setIsPopupOpenLlave(false)}
          onSave={handleSaveLlave}
        />
      )}
    </main>

  );
};

export default Licencias;
