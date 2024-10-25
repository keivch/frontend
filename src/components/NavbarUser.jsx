import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import axios from "axios";

const NavbarUser = ({ name }) => {
    const navigate = useNavigate();
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
          await axios.post("http://127.0.0.1:8000/logout/", {
            SessionId: cookies.load("SessionId"),
          });
          cookies.remove("SessionId");
          navigate("/");
        } catch (error) {
          alert(error);
        }
      };
    return (
        <nav className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Escudo_Deportivo_Cali.png/600px-Escudo_Deportivo_Cali.png"
                                alt="Logo"
                                className="h-12 w-auto"
                            />
                        
                    </div>

                    {/* bienvenida */}
                    <div className="hidden md:flex md:space-x-8">
                        <h1 className="text-white px-4 py-2 rounded-md text-3xl font-bebas">Bienvenido {name}</h1>
                    </div>

                    {/* Centered Links */}
                    <div className="hidden md:flex md:space-x-8">
                        <button
                            onClick={( ) => navigate("/Tickets")}
                            className="text-white hover:bg-green-700 hover:text-gray-200 px-4 py-2 rounded-md text-3xl font-bebas"
                        >
                            Tickets
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md font-bebas text-3xl"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};



export default NavbarUser