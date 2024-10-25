import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar";
import cookies from "react-cookies";
import { useNavigate } from "react-router-dom";

const Htickets = () => {
  const [tickets, setTickets] = useState([]); // Estado para almacenar los tickets
  const [loading, setLoading] = useState(true); // Estado para mostrar el loader

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

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  // Obtener los tickets desde el backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://inventariodeporcali.onrender.com/getAllTickets/");
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
          <p>Cargando tickets...</p>
        ) : (
          <div>
            <h1 className="text-4xl text-white font-bebas mb-4">Historial Tickets</h1>
            <table className="min-w-full bg-white text-gray-800 table-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Cerrado</th>
                  <th className="px-4 py-2">Observación</th>
                  <th className="px-4 py-2">Fecha Creación</th>
                  <th className="px-4 py-2">Fecha Proceso</th>
                  <th className="px-4 py-2">Fecha Cierre</th>
                  <th className="px-4 py-2">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b">
                    <td className="px-4 py-2">{ticket.tipo}</td>
                    <td className="px-4 py-2">{ticket.descripcion}</td>
                    <td className="px-4 py-2">{ticket.estado}</td>
                    <td className="px-4 py-2">{ticket.cerrado ? "Sí" : "No"}</td>
                    <td className="px-4 py-2">{ticket.observacion}</td>
                    <td className="px-4 py-2">
                      {ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }) : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {ticket.fecha_proceso ? new Date(ticket.fecha_proceso).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {ticket.fecha_cierre ? new Date(ticket.fecha_cierre).toLocaleString() : "N/A"}
                    </td>

                    <td className="px-4 py-2">{ticket.user?.nombre || "N/A"}</td>
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
