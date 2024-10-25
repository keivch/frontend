import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "react-cookies";
import Notification from "../components/Noti";
import Pusher from "pusher-js";

// Notificación con botón para recargar tickets


const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [lastTicketsCount, setLastTicketsCount] = useState(0);
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [observations, setObservations] = useState("");
  const navigate = useNavigate();

  // Función para obtener tickets de la API

  const fetchTickets = async () => {
    try {
      const response = await axios.get("https://inventariodeporcali.onrender.com/getTickets/");
      const fetchedTickets = response.data.tickets;

      // Si hay más tickets que los anteriores, mostrar notificación
      if (fetchedTickets.length > lastTicketsCount) {
        const newTicketsCount = fetchedTickets.length - lastTicketsCount;
        notifyNewTicket(newTicketsCount);
      }

      setTickets(fetchedTickets);
      setLastTicketsCount(fetchedTickets.length);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("No se pudo cargar los tickets. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  // Notificar cuando se reciba un nuevo ticket
  const notifyNewTicket = (newTicketsCount) => {
    setNewTicketMessage(`Tienes ${newTicketsCount} nuevo(s) ticket(s)!`);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Suscripción a Pusher para recibir notificaciones de nuevos tickets
  useEffect(() => {
    const pusher = new Pusher("8e2e015ec7fb8fa317d6", {
      cluster: "sa1",
    });

    const channel = pusher.subscribe("tickets_channel"); // Cambiar por tu canal de Pusher

    channel.bind("new_ticket", function (data) {
      setShowNotification(true); // Mostrar la notificación cuando llegue un nuevo ticket
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [lastTicketsCount]);

  const handleChangeStatus = async (id, newStatus, observations = "") => {
    try {
      const response = await axios.post("https://inventariodeporcali.onrender.com/changeStatus/", {
        id: id,
        estado: newStatus,
        observaciones: observations,
      });

      if (response.status === 200) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === id ? { ...ticket, estado: newStatus } : ticket
          )
        );
        alert("Estado cambiado exitosamente.");
        setSelectedTicketId(null);
        setObservations("");
      } else {
        alert("Error al cambiar el estado.");
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      alert("Hubo un error al intentar cambiar el estado.");
    }
  };

  const handleStartProcess = (id) => {
    handleChangeStatus(id, "En Proceso");
  };

  const handleCloseTicket = (id) => {
    setSelectedTicketId(id);
  };

  const handleSubmitCloseTicket = (id) => {
    if (observations.trim() === "") {
      alert("Por favor, añade observaciones antes de cerrar el ticket.");
      return;
    }
    handleChangeStatus(id, "Resuelto", observations);
  };

  const handleDeleteTicket = (id) => {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== id)
    );
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

  return (
    <main className="bg-slate-50 w-full h-screen flex">
      <section className="w-[16%] h-full">
        <Sidebar onLogout={handleLogout} />
      </section>

      <section className="w-[84%] h-full p-8 bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover overflow-y-auto">
        <h1 className="text-4xl font-bebas text-white mb-6">
          Bienvenido a la Intranet del Deportivo Cali
        </h1>

        {/* Mostrar notificación si hay un nuevo ticket */}
        {showNotification && (
          <Notification
            message={newTicketMessage}
            onReload={fetchTickets} // Recargar tickets al hacer clic
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-bebas text-black">
              Tickets Abiertos
            </h2>
            {/* Botón para recargar manualmente los tickets */}
            <button
              onClick={fetchTickets}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Recargar Tickets
            </button>
          </div>
          {tickets.length === 0 ? (
            <p className="text-gray-500">
              No tienes tickets abiertos en este momento.
            </p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="border border-green-500 p-4 rounded-md bg-white shadow-md"
                >
                  <p>
                    <strong>Usuario:</strong> {ticket.user.nombre}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {ticket.tipo}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {ticket.descripcion}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`${ticket.estado === "Resuelto"
                          ? "text-green-700"
                          : ticket.estado === "En Proceso"
                            ? "text-blue-500"
                            : "text-yellow-500"
                        } font-bold`}
                    >
                      {ticket.estado}
                    </span>
                  </p>
                  <p>
                    <strong>Fecha y Hora:</strong> {new Date(ticket.fecha_creacion).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>

                  {ticket.estado === "Pendiente" && (
                    <div className="mt-4 space-x-4">
                      <button
                        onClick={() => handleStartProcess(ticket.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Iniciar Proceso
                      </button>
                      <button
                        onClick={() => handleCloseTicket(ticket.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Cerrar Ticket
                      </button>
                    </div>
                  )}

                  {ticket.estado === "En Proceso" && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCloseTicket(ticket.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Cerrar Ticket
                      </button>
                    </div>
                  )}

                  {selectedTicketId === ticket.id && (
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Añade observaciones..."
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      ></textarea>
                      <button
                        onClick={() => handleSubmitCloseTicket(ticket.id)}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Confirmar Cierre
                      </button>
                    </div>
                  )}

                  {ticket.estado === "Resuelto" && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Eliminar Ticket
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>

  );
};

export default Home;





