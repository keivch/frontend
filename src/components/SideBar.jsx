import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isTechOpen, setIsTechOpen] = useState(false);

  // Funciones de navegación
  const onPasswordsClick = () => {
    navigate("/Passwords");
  };

  const onComponentsClick = () => {
    navigate("/Components");
  };

  const onEquiposClick = () => {
    navigate("/Equipo");
  };

  const onLicensesClick = () => {
    navigate("/Licencias");
  };

  const onDocumentationClick = () => {
    navigate("/Documentacion");
  };

  const addUsers = () => {
    navigate("/AddUsers");
  };

  const Htickets = () => {
    navigate("/HTickets");
  };
  const changePassword = () => {
    navigate("/RestorePassword");
  };

  // Manejar el despliegue de la sección de Tecnología
  const toggleTechSection = () => {
    setIsTechOpen(!isTechOpen);
  };

  return (
    <aside className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all text-white w-full h-screen p-5">
      <a href="/Home">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Escudo_Deportivo_Cali.png/600px-Escudo_Deportivo_Cali.png"
          alt="Logo"
          className="lg:w-auto lg:h-auto md:w-[315px] md:h-[315px] mx-auto"
        />
      </a>
      <ul className="space-y-4 mt-6">
        {/* Botón de Tecnología */}
        <li>
          <button
            onClick={toggleTechSection}
            className="text-slate-50 lg:text-2xl md:text-5xl font-bebas hover:text-gray-400 w-full text-left"
          >
            Tecnología
          </button>
        </li>

        {/* Desplegar sub-opciones de Tecnología si está abierto */}
        {isTechOpen && (
          <ul className="ml-4 space-y-2">
            <li>
              <button
                onClick={onPasswordsClick}
                className="text-slate-50 lg:text-xl md:text-4xl font-bebas hover:text-gray-400 w-full text-left"
              >
                Contraseñas
              </button>
            </li>
            <li>
              <button
                onClick={onComponentsClick}
                className="text-slate-50 lg:text-xl md:text-4xl font-bebas hover:text-gray-400 w-full text-left"
              >
                Componentes
              </button>
            </li>
            <li>
              <button
                onClick={onLicensesClick}
                className="text-slate-50 lg:text-xl md:text-4xl font-bebas hover:text-gray-400 w-full text-left"
              >
                Licencias
              </button>
            </li>
            <li>
              <button
                onClick={onDocumentationClick}
                className="text-slate-50 lg:text-xl md:text-4xl font-bebas hover:text-gray-400 w-full text-left"
              >
                Documentación
              </button>
            </li>
            <li>
              <button
                onClick={onEquiposClick}
                className="text-slate-50 lg:text-xl md:text-4xl font-bebas hover:text-gray-400 w-full text-left"
              >
                Equipos
              </button>
            </li>
          </ul>
        )}

        {/* Botón para añadir usuarios */}
        <li>
          <button
            onClick={addUsers}
            className="text-slate-50 lg:text-2xl md:text-5xl font-bebas hover:text-gray-400 w-full text-left"
          >
            Añadir Usuarios
          </button>
        </li>
        <button
            onClick={Htickets}
            className="text-slate-50 lg:text-2xl md:text-5xl font-bebas hover:text-gray-400 w-full text-left"
          >
            Historial Tickets
          </button>
          <button
            onClick={changePassword}
            className="text-slate-50 lg:text-2xl md:text-5xl  font-bebas hover:text-gray-400 w-full text-left"
          >
            Cambio de Contraseñas
          </button>

        {/* Botón para cerrar sesión */}
        <li>
          <button
            onClick={onLogout}
            className="text-slate-50 lg:text-2xl md:text-5xl font-bebas hover:text-gray-400 w-full text-left"
          >
            Cerrar Sesión
          </button>
          
        </li>
      </ul>
    </aside>  
  );
};

export default Sidebar;



