import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar";
import Pusher from "pusher-js";
import Notification from "../components/Noti";
import cookies from "react-cookies";
import { useNavigate } from "react-router-dom";

const RestorePassword = () => {
    const [requests, setRequests] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    // Cargar solicitudes desde la API
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("https://inventariodeporcali.onrender.com/getSolicitudes/",
                    {
                        headers: {
                            'Authorization': `Bearer ${cookies.load("SessionId")}`
                        }
                    }
                );
                setRequests(response.data.solicitudes); // Usar los datos de la API
                setLoading(false);
            } catch (err) {
                setError("Error al cargar las solicitudes.");
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    useEffect(() => {
      if (!cookies.load("SessionId")) {
        navigate("/");
      }
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get("https://inventariodeporcali.onrender.com/getSolicitudes/",
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.load("SessionId")}`
                    }
                }
            );
            setRequests(response.data.solicitudes); // Usar los datos de la API
            setLoading(false);
            setShowNotification(false);
        } catch (err) {
            setError("Error al cargar las solicitudes.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const pusher = new Pusher("8e2e015ec7fb8fa317d6", {
            cluster: "sa1",
        });

        const channel = pusher.subscribe("solicitudes_channel"); // Cambiar por tu canal de Pusher

        channel.bind("new_solicitudes", function (data) {
            setShowNotification(true); // Mostrar la notificación cuando llegue un nuevo ticket
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [requests]);


    const handleEditClick = (id) => {
        setEditingId(id);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
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

    const handleSavePassword = async (correo) => {
        if (!newPassword || !newPassword.trim()) {
            return alert('Por favor ingrese una nueva contraseña');
        }

        if (newPassword.length < 8) {
            return alert('La nueva contraseña debe tener al menos 8 caracteres');
        }
        
        try {
            await axios.post("https://inventariodeporcali.onrender.com/changePassword/", {
                correo: correo,
                newPassword: newPassword
            },
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.load("SessionId")}`
                    }
                }
            );
            setEditingId(null);
            setNewPassword(''); // Limpiar el input de nueva contrase
            fetchRequests();
            alert('Contraseña cambiada exitosamente');
        } catch (error) {
            console.log(error);
        }

    };

    if (loading) {
        return <div className="text-white">Cargando solicitudes...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
        <main className="bg-slate-50 w-full h-screen flex">
          <section className="w-[16%]">
            <Sidebar onLogout={handleLogout} />
            {showNotification && (
              <Notification
                message={"Se agregó una solicitud de recuperación de contraseña"}
                onReload={fetchRequests} // Recargar tickets al hacer clic
              />
            )}
          </section>
      
          <section className="w-[84%] bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover p-8">
            <h2 className="text-2xl font-bebas text-white mb-6">Solicitudes de Recuperación de Contraseña</h2>
            <div className="bg-white bg-opacity-30 p-6 rounded-lg shadow-lg">
              {requests.length === 0 ? (  // Condición para verificar si no hay solicitudes
                <p className="text-gray-400 text-lg">No hay solicitudes de recuperación de contraseña en este momento.</p>
              ) : (
                requests.map(request => (
                  <div key={request.id} className="mb-4 p-4 border-b border-gray-200">
                    <p className="text-lg font-semibold text-white">{request.nombre}</p>
                    <p className="text-gray-200">{request.correo}</p>
                    {editingId === request.id ? (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nueva contraseña"
                          className="border-2 border-gray-300 rounded-lg p-2 w-full mb-2"
                        />
                        <button
                          onClick={() => handleSavePassword(request.correo)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Guardar Contraseña
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(request.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-700"
                      >
                        Cambiar Contraseña
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
      
    );
};

export default RestorePassword;

