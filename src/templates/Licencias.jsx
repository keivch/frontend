import React, { useState, useEffect } from 'react';
import Sidebar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import ContentLicencias from '../components/ContentLicencias';
import PopupLicencias from '../components/PopupLicencias';
import PopupLlave from '../components/PopupLlave';
import PopupM from '../components/PopupM';
import { set } from 'date-fns';

const Licencias = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenLlave, setIsPopupOpenLlave] = useState(false);

  const [formLicenciaData, setFormLicenciaData] = useState({}); // Estado para licencias
  const [formLlaveData, setFormLlaveData] = useState({}); // Estado para llaves

  const [Licencias, setLicencias] = useState([]);
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
      const response = await axios.get('https://inventariodeporcali.onrender.com/getLicencias/', {
        headers: {  
          'Authorization': `Bearer ${cookies.load("sessionid")}`
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
    if (!cookies.load("sessionid")) {
      navigate("/"), { replace: true };
    }
  }, []);

  const handleViewMore = async (id, edit) => {
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/getLicencia/', { id },
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
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

  const handleSaveLicencia = async (formData) => {
    if (formData.nombre === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    if (formData.llave === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addLicencia/', formData,
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
      fetchUsuarios(); // Actualiza la lista de licencias
    } catch (error) {
      console.error('Error al agregar la licencia:', error);
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleSaveLlave = async (formData) => {
    if (formData.llave === '') {
      setMessagePopupM("Por favor llene todos los campos");
      setTitlePopupM("Error");
      setShowPopupM(true);
      return;
    }
    try {
      const response = await axios.post('https://inventariodeporcali.onrender.com/addLlave/', formData,
        {
          headers: {
            'Authorization': `Bearer ${cookies.load("sessionid")}`
          }
        }
      );
      setMessagePopupM(response.data.message);
      setTitlePopupM("Exito");
      setShowPopupM(true);
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
      <PopupM
        isOpen={showPopupM}
        onClose={handleOpenPopupM}
        title={tittlePopupM}
        message={messagePopupM}
      />
    </main>

  );
};

export default Licencias;
