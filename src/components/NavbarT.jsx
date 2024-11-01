import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "react-cookies";



const NavbarT = () => {

  const navigate = useNavigate();
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
    return (
        <nav className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bebas text-white">Sistema de Tickets</h1>
        <div className="hidden md:flex md:space-x-8">
          <button
            onClick={() => (navigate(-1))}
            className="text-white hover:bg-green-700 hover:text-gray-200 px-4 py-2 rounded-md text-3xl font-bebas"
          >
            Volver
          </button>

          <button
            onClick={handleLogout}
            className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md font-bebas text-3xl"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    )
};

export default NavbarT