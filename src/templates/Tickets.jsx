import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "react-cookies";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Noti";

// Componente de notificación con botón para recargar tickets


const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [ticketForm, setTicketForm] = useState({
    type: "",
    description: "",
  });

  // Manejar el cambio en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!cookies.load("SessionId")) {
      navigate("/");
    }
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga
    if (ticketForm.type && ticketForm.description) {
      try {
        await axios.post("https://inventariodeporcali.onrender.com/addTicket/", {
          tipo: ticketForm.type,
          descripcion: ticketForm.description,
          estado: "Pendiente",
          SessionId: cookies.load("SessionId"),
        });

        // Limpiar el formulario y mostrar mensaje de éxito
        setTicketForm({ type: "", description: "" });
        alert("Ticket enviado exitosamente.");
      } catch (error) {
        console.error("Error al enviar el ticket:", error);
        alert("No se pudo enviar el ticket. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para obtener los tickets enviados por el usuario
  const fetchTickets = async () => {
    try {
      const token = cookies.load("SessionId");
      const response = await axios.get(
        `https://inventariodeporcali.onrender.com/getMyTickets/?q=${token}`
      );
      setTickets(response.data.tickets.filter((ticket) => ticket.estado !== "Resuelto"));
      setShowNotification(false);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      alert("Error al obtener los tickets. Inténtalo de nuevo.");
    }
  };

  // Función para manejar el cambio de estado de los tickets desde la notificación
  const handleTicketStatusChange = (ticket) => {
    setNotificationMessage("El estado del ticket ha cambiado ");
    setShowNotification(true);
  };

  // Suscripción a Pusher para cambios en los tickets
  useEffect(() => {
    fetchTickets(); // Cargar tickets inicialmente
    const pusher = new Pusher("8e2e015ec7fb8fa317d6", {
      cluster: "sa1",
    });

    const channel = pusher.subscribe("tickets_channel");

    // Escuchar por el evento de cambio de estado
    channel.bind("change_status", function (data) {
      handleTicketStatusChange(data); // Llamada para mostrar la notificación cuando cambia el estado de un ticket
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

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
    <div className="min-h-screen bg-[url('./assets/fondoLogin.jpg')] bg-center bg-cover text-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bebas text-white">Sistema de Tickets</h1>
        <div className="hidden md:flex md:space-x-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:bg-green-700 hover:text-gray-200 px-4 py-2 rounded-md text-3xl font-bebas"
          >
            Volver
          </button>
          <button
            onClick={() => navigate("/TicketsUser")}
            className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md font-bebas text-3xl"
          >
            Mis Tickets Cerrados
          </button>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md font-bebas text-3xl"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Mostrar notificación si el estado de un ticket cambia */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          onReload={fetchTickets} // Al hacer clic en el botón de la notificación, se recargan los tickets
        />
      )}

      {/* Contenedor principal */}
      <div className="flex flex-row w-full p-8">
        {/* Lista de tickets */}
        <div className="w-1/3 p-4 bg-black rounded-md mr-4">
          <h2 className="text-2xl font-bold mb-4">Tickets Enviados y en espera</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-300">No has enviado ningún ticket aún.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="bg-white text-black p-4 rounded-md shadow-md"
                >
                  <p><strong>Tipo:</strong> {ticket.tipo}</p>
                  <p><strong>Descripción:</strong> {ticket.descripcion}</p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`${
                        ticket.estado === "Resuelto"
                          ? "text-green-700"
                          : ticket.estado === "En Proceso"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      } font-bold`}
                    >
                      {ticket.estado}
                    </span>
                  </p>
                  <p><strong>Observación:</strong> {ticket.observacion}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulario de nuevo ticket */}
        <div className="w-2/3 p-4 bg-white text-black rounded-md">
          <h2 className="text-2xl font-bold mb-4">Enviar Nuevo Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Tipo de Ticket
              </label>
              <select
                name="type"
                value={ticketForm.type}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Soporte técnico">Soporte técnico</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Impresora">Impresora</option>
                <option value="Red">Red</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={ticketForm.description}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="bg-green-700 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800"
              >
               {loading ? "Enviando..." : "Enviar Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tickets;



