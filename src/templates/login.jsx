import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import cookies from "react-cookies";

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Para controlar el popup
  const [emailPopup, setEmailPopup] = useState("");
  const [isRequesting, setIsRequesting] = useState(false); // Nuevo estado para la solicitud

  const handleCorreoChange = (event) => {
    setCorreo(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (correo === "" || password === "") {
      alert("Por favor llene todos los campos");
      return;
    }
    try {
      const response = await axios.post("https://inventariodeporcali.onrender.com/login/", {
        correo: correo,
        password: password,
      });
      const token = response.data.SessionId;
      cookies.save("SessionId", token, 
        { path: "/", expires: new Date(Date.now() + 3600000) }
      );
      if (response.data.admin) {
        navigate("/Home");
      } else {
        navigate(`/HomeUser/${response.data.nombre}`);
      }
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  // Función para mostrar el popup
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  // Función para cerrar el popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setEmailPopup(""); // Limpiar el input de correo si se cierra el popup
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setIsRequesting(true); // Indica que la solicitud está en progreso
    try {
      const response = await axios.post("https://inventariodeporcali.onrender.com/addSolicitud/", {
        correo: emailPopup,
      });
      alert(response.data.message);
      setShowPopup(false);
    } catch (error) {
      alert(error.response.data.error);
    } finally {
      setIsRequesting(false); // Termina el estado de solicitud
    }
  };

  return (
    <main className="bg-slate-50 w-full h-screen grid grid-cols-2 relative">
      <section className="m-6 flex justify-center w-2/3 flex-col gap-6 mx-auto relative">
        <div>
          <img
            src="https://e7.pngegg.com/pngimages/662/460/png-clipart-computer-network-internet-computer-software-system-computer-computer-network-computer.png"
            className="bg-gradient-to-r from-green-950 to-black w-20 p-4 rounded-lg"
          />
        </div>
        <h1 className="text-5xl font-bold">Bienvenido</h1>
        <p className="text-2xl text-slate-700">Intranet de Deportivo Cali</p>
        <hr className="w-full border-2"></hr>
        <form className="flex flex-col gap-8">
          <Input
            type="email"
            onChange={handleCorreoChange}
            name="E-mail"
            value={correo}
            placeholder="Ejemplo: isaac@deportivocali.com.co"
          />
          <Input
            type="password"
            onChange={handlePasswordChange}
            value={password}
            name="Contraseña"
            placeholder="Ejemplo: 123456"
            resetPassword={handleForgotPasswordClick}
          />
          <Button type="submit" name="Ingresar" onClick={handleClick} />
        </form>

        {/* Popup para solicitud de cambio de contraseña */}
        {showPopup && (
          <div className="absolute bg-white border-4 border-green-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recuperar Contraseña</h2>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={emailPopup}
              onChange={(e) => setEmailPopup(e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className={`${
                  isRequesting ? "bg-gray-400" : "bg-green-500"
                } text-white px-4 py-2 rounded-md hover:bg-green-600`}
                onClick={handlePasswordReset}
                disabled={isRequesting} // Deshabilita el botón mientras se envía
              >
                {isRequesting ? "Solicitando..." : "Solicitar Cambio"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={handleClosePopup}
                disabled={isRequesting} // Opcionalmente, también puedes deshabilitar el botón de cancelar
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="m-6 rounded-lg flex">
        <div className="relative h-full w-full bg-gradient-to-r from-green-950 to-black rounded-2xl grid place-content-center">
          <article className="z-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Escudo_Deportivo_Cali.png/600px-Escudo_Deportivo_Cali.png"
              className="lg:w-auto lg:h-auto md:w-[315px] md:h-[315px] mx-auto"
            ></img>
            <h2 className="text-slate-50 lg:text-6xl md:text-5xl font-semibold text-center font-bebas">
              Intranet Deportivo Cali
            </h2>
          </article>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] rounded-2xl "></div>
        </div>
      </section>
    </main>
  );
};

export default Login;

