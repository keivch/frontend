import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import ContentPassword from '../components/contentPassword';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import PopupPassword from '../components/popupPassword';
import PopupM from '../components/PopupM';

const Passwords = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [pasword, setPasswords] = useState([]);
  const [isEdit, setIsEdit] = useState(false);  
  const [showPopupM, setShowPopupM] = useState(false);
  const [tittlePopupM, setTitlePopupM] = useState('');
  const [messagePopupM, setMessagePopupM] = useState('');

  const navigate = useNavigate();

  const handleOpenPopupM = () => {
    setShowPopupM(false);
    setTitlePopupM('');
    setMessagePopupM('');
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://inventariodeporcali.onrender.com/getContrasenas/',
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setPasswords(response.data.contrasenas); // Actualiza el estado con los equipos obtenidos
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  useEffect(() => {
    if (!cookies.load("sessionid")) {
      navigate("/"), { replace: true };
    }
  }, []);

  useEffect(() => {
    fetchUsuarios(); // Llamar a la función para obtener equipos
  }, []);

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getContrasena/', { id },
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      response.data.contrasena.Usuario = response.data.contrasena.Usuario.nombre;
      setFormData(response.data.contrasena); // actualiza el formulario con la información del equipo
      setIsEdit(edit);  // Desactiva la edición
      setIsPopupOpen(true); // Abre el popup
    } catch (error) {
      console.error('Error al obtener de la contrasena:', error);
      alert('Error al obtener la información de la contrasena');
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
    if (formData.ubicacion === '' || formData.Usuario === '' || formData.contrasena === '' || formData.correo === '' || formData.estado === '' || formData.tipo === '') {

      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;

    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addContrasenas/', formData,
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
      console.error('Error al agregar el usuario:', error);
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleClick = async () => {
    setFormData({                // Este será generado automáticamente en Django, así que no necesitas llenarlo en el formulario
      Ubicacion: '',
      Usuario: '',
      contrasena: '',
      correo: '',
      estado: '',
      tipo: '',
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
        <ContentPassword
          title="Gestión de contraseñas"
          items={pasword}
          onViewMore={handleViewMore}
          onEdit={handleEdit}
          onHandleClick={handleClick}
        />
      </section>

      {/* Renderiza el Popup si isPopupOpen es true */}
      {isPopupOpen && (
        <PopupPassword
          edit={isEdit} // Controla si se puede editar o no
          formData={formData} // Pasa la información del equipo al popup
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSave}
        />
      )}
      <PopupM
        isOpen={showPopupM}
        onClose={handleOpenPopupM}
        title={tittlePopupM}
        message={messagePopupM}
      />
    </main>

  );
};

export default Passwords;
