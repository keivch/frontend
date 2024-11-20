import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import ContentUsers from '../components/contentUsers';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import PopupAddUser from '../components/popupAddUser';
import PopupCargo from '../components/PopupCargo';
import PopupM from '../components/PopupM';

const AddUsers = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupCargoOpen, setIsPopupCargoOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
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
      const response = await axios.get('https://inventariodeporcali.onrender.com/getUsers/', {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
      setUsers(response.data.userss); // Actualiza el estado con los usuarios obtenidos
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
      const response = await axios.post('https://inventariodeporcali.onrender.com/getUser/', { id }, {
        headers: {
          'Authorization': `Bearer ${cookies.load("sessionid")}`
        }
      });
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
    if (formData.nombre === '' || formData.cargo === '' || formData.cedula === '' || formData.correo === '' || formData.telefono === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    if (formData.correo !== '' && !/\S+@\S+\.\S+/.test(formData.correo)) {
      setMessagePopupM("El correo no es valido");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addUsers/', formData, 
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
      setMessagePopupM(error.response.data.error);
      setTitlePopupM("Error");
      setShowPopupM(true);
    }
  };

  const saveCargo = async (formData) => {
    if (formData.nombre === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addCargo/', formData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setMessagePopupM(response.data.message);
      setTitlePopupM("Exito");
      setShowPopupM(true);
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
      <PopupM
        isOpen={showPopupM}
        onClose={handleOpenPopupM}
        title={tittlePopupM}
        message={messagePopupM}
      />
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

