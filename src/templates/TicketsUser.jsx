import NavbarT from "../components/NavbarT";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from "react-cookies";
import { useNavigate } from "react-router-dom";

const TicketsUser = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); 

    // Función para obtener los tickets desde el backend
    const fetchTickets = async () => {
        try {
            const token = cookies.load('sessionid'); // Se asume que el token se almacena en las cookies
            const response = await axios.get('https://inventariodeporcali.onrender.com/getAllMyTickets', {
                params: {
                    q: token
                }, 
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTickets(response.data.tickets);
        } catch (error) {
            setError('Error al obtener los tickets');
            console.error(error);
        }
    };

    useEffect(() => {
        if (!cookies.load("sessionid")) {
          navigate("/"), { replace: true };
        }
      }, []);

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <main className="min-h-screen bg-cover bg-center bg-[url('./assets/fondoLogin.jpg')]">
            <NavbarT />
            <section className="flex flex-col items-center justify-center py-8">
                <h1 className="text-3xl font-bebas text-white mb-6">Mis Tickets Cerrados</h1>
                {error && <p className="text-red-500">{error}</p>}
                {tickets.length > 0 ? (
                    <div className="overflow-x-auto w-full max-w-6xl bg-white rounded-lg shadow-lg">
                        <table className="min-w-full bg-white text-gray-800 table-auto">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Tipo</th>
                                    <th className="px-4 py-2 text-left">Descripción</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">Cerrado</th>
                                    <th className="px-4 py-2 text-left">Observación</th>
                                    <th className="px-4 py-2 text-left">Fecha Creación</th>
                                    <th className="px-4 py-2 text-left">Fecha Proceso</th>
                                    <th className="px-4 py-2 text-left">Fecha Cierre</th>
                                    <th className="px-4 py-2 text-left">Encargado</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tickets.filter((t) => t.cerrado === true).map((ticket) => (
                                    <tr key={ticket.id} className="border-t">
                                        <td className="px-4 py-2">{ticket.tipo}</td>
                                        <td className="px-4 py-2">{ticket.descripcion}</td>
                                        <td className="px-4 py-2">{ticket.estado}</td>
                                        <td className="px-4 py-2">{ticket.cerrado ? 'Sí' : 'No'}</td>
                                        <td className="px-4 py-2">{ticket.observacion}</td>
                                        <td className="px-4 py-2">
                                            {ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {ticket.fecha_proceso ? new Date(ticket.fecha_proceso).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {ticket.fecha_cierre ? new Date(ticket.fecha_cierre).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">{ticket.encargado.nombre? ticket.encargado.nombre : 'N/A'}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-white">No tienes tickets disponibles.</p>
                )}
            </section>
        </main>
    );
};

export default TicketsUser;

