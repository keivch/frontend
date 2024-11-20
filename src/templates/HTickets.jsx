import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar";
import cookies from "react-cookies";
import { replace, useNavigate } from "react-router-dom";

const Htickets = () => {
  const [tickets, setTickets] = useState([]); // Estado para almacenar los tickets
  const [loading, setLoading] = useState(true); // Estado para mostrar el loader

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!cookies.load("sessionid")) {
      navigate("/"), {replace: true};
    }
  }, []);

  // Obtener los tickets desde el backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://inventariodeporcali.onrender.com/getAllTickets/",
          {
            headers: {
              "Authorization": `Bearer ${cookies.load("sessionid")}`,
            },
          }
        );
        setTickets(response.data.tickets);
        setLoading(false); // Desactivar el loader
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>
  
      <section className="w-[84%] h-full p-8 bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        {loading ? (
          <p className="text-white">Cargando tickets...</p>
        ) : (
          <div>
            <h1 className="text-4xl text-white font-bebas mb-4">Historial Tickets</h1>
            <table className="min-w-full bg-white text-gray-800 table-auto border-collapse text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-2 py-1">Tipo</th>
                  <th className="px-2 py-1">Descripción</th>
                  <th className="px-2 py-1">Estado</th>
                  <th className="px-2 py-1">Cerrado</th>
                  <th className="px-2 py-1">Observación</th>
                  <th className="px-2 py-1">Creación</th>
                  <th className="px-2 py-1">Proceso</th>
                  <th className="px-2 py-1">Cierre</th>
                  <th className="px-2 py-1">Usuario</th>
                  <th className="px-2 py-1">Encargado</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-100">
                    <td className="px-2 py-1 text-center">{ticket.tipo}</td>
                    <td className="px-2 py-1 text-center truncate max-w-[150px]">{ticket.descripcion}</td>
                    <td className="px-2 py-1 text-center">{ticket.estado}</td>
                    <td className="px-2 py-1 text-center">{ticket.cerrado ? "Sí" : "No"}</td>
                    <td className="px-2 py-1 text-center truncate max-w-[100px]">
                      {ticket.observacion}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {ticket.fecha_creacion
                        ? new Date(ticket.fecha_creacion).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {ticket.fecha_proceso
                        ? new Date(ticket.fecha_proceso).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {ticket.fecha_cierre
                        ? new Date(ticket.fecha_cierre).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-2 py-1 text-center">{ticket.user?.nombre || "N/A"}</td>
                    <td className="px-2 py-1 text-center">{ticket.encargado?.nombre || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
  
};

export default Htickets;
