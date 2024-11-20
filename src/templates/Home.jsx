import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "react-cookies";
import Notification from "../components/Noti";
import Pusher from "pusher-js";
import PopupM from "../components/PopupM";

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [observations, setObservations] = useState("");
  const navigate = useNavigate();
  const [showPopupM, setShowPopupM] = useState(false);
  const [tittlePopupM, setTitlePopupM] = useState("");
  const [messagePopupM, setMessagePopupM] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Nuevos estados para el backup
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleBackupDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(10); // Iniciar la barra de progreso

    try {
      const response = await axios.get(
        "https://inventariodeporcali.onrender.com/backup/",
        {
          headers: {
            Authorization: `Bearer ${cookies.load("sessionid")}`,
          },
          responseType: "blob", // Asegurarnos de recibir el archivo como Blob
          onDownloadProgress: (progressEvent) => {
            // Actualizar la barra de progreso
            const total = progressEvent.total || 100; // Si no se conoce el tamaño, usar 100
            const percent = Math.round((progressEvent.loaded * 100) / total);
            setDownloadProgress(percent);
          },
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.json"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();

      setMessagePopupM("Backup descargado con éxito");
      setTitlePopupM("Éxito");
      setShowPopupM(true);
    } catch (error) {
      console.error("Error al descargar el backup:", error);
      setMessagePopupM("Error al generar el backup");
      setTitlePopupM("Error");
      setShowPopupM(true);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const ITEMS_PER_PAGE = 2;

  const handleOpenPopupM = () => {
    setShowPopupM(false);
    setTitlePopupM("");
    setMessagePopupM("");
  };

  // Función para obtener tickets de la API
  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "https://inventariodeporcali.onrender.com/getTickets/",
        {
          headers: {
            Authorization: `Bearer ${cookies.load("sessionid")}`,
          },
        }
      );
      const fetchedTickets = response.data.tickets;
      setTickets(fetchedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("No se pudo cargar los tickets. Inténtalo de nuevo.");
    }
  };

  // Cargar tickets al montar el componente
  useEffect(() => {
    if (!cookies.load("sessionid")) {
      navigate("/"), { replace: true };
    } else {
      fetchTickets();
    }
  }, []);

   // Calcular el índice de los tickets para la página actual
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

   // Cambiar de página
  const goToNextPage = () => {
    if (currentPage * ITEMS_PER_PAGE < tickets.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Suscripción a Pusher para recibir notificaciones de nuevos tickets
  useEffect(() => {
    const pusher = new Pusher("8e2e015ec7fb8fa317d6", {
      cluster: "sa1",
    });

    const channel = pusher.subscribe("tickets_channel");

    channel.bind("new_ticket", function (data) {
      setShowNotification(true); // Mostrar notificación
      fetchTickets(); // Recargar tickets automáticamente
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleChangeStatus = async (id, newStatus, observations = "") => {
    try {
      const response = await axios.post(
        "https://inventariodeporcali.onrender.com/changeStatus/",
        {
          id: id,
          estado: newStatus,
          observaciones: observations,
          sessionid: cookies.load("sessionid"),
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.load("sessionid")}`,
          },
        }
      );

      if (response.status === 200) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === id ? { ...ticket, estado: newStatus } : ticket
          )
        );
        setMessagePopupM("Estado cambiado con éxito");
        setTitlePopupM("Éxito");
        setShowPopupM(true);
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
      setMessagePopupM("Observaciones vacías");
      setTitlePopupM("Error");
      setShowPopupM(true);
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
        SessionId: cookies.load("sessionid"),
      });
      cookies.remove("sessionid");
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
        {/* Botón para generar el backup */}
        <div className="mb-6">
          <button
            onClick={handleBackupDownload}
            className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
              isDownloading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDownloading}
          >
            {isDownloading ? "Generando Backup..." : "Descargar Backup"}
          </button>
          {/* Barra de progreso */}
          {isDownloading && (
            <div className="mt-2 w-full bg-gray-200 rounded-md">
              <div
                className="bg-green-500 h-4 rounded-md"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
  
        {/* Mostrar notificación si hay un nuevo ticket */}
        {showNotification && (
          <Notification
            message="¡Nuevo ticket recibido!"
            onReload={fetchTickets}
          />
        )}
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-bebas text-black">
              Tickets Abiertos
            </h2>
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
            <>
              {/* Mostrar los tickets de la página actual */}
              <ul className="space-y-4">
                {currentTickets.map((ticket) => (
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
                        className={`${
                          ticket.estado === "Resuelto"
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
                      <strong>Fecha y Hora:</strong>{" "}
                      {new Date(ticket.fecha_creacion).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
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
  
              {/* Paginación */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                >
                  Página Anterior
                </button>
                <span>
                  Página {currentPage} de{" "}
                  {Math.ceil(tickets.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage * ITEMS_PER_PAGE >= tickets.length}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                >
                  Página Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      <PopupM
        isOpen={showPopupM}
        onClose={handleOpenPopupM}
        title={tittlePopupM}
        message={messagePopupM}
      />
    </main>
  );
};  

export default Home;





