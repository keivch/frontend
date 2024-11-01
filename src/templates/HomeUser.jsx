import React, { useState, useEffect  } from 'react'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavbarUser from "../components/NavbarUser";
import News from "../components/News";
import cookies from 'react-cookies';
import Pusher from 'pusher-js';
import { useNavigate } from "react-router-dom";
import Notification from '../components/Noti';

const HomeUser = () => {
    const { nombre } = useParams();
    const [comunicados, setComunicados] = useState([]);
    const [newComunicado, setNewComunicado] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);  // Imagen seleccionada
    const [loading, setLoading] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const navigate = useNavigate();

    // Obtener comunicados al cargar la página
    useEffect(() => {
        fetchComunicados();
    }, []);

    useEffect(() => {
        const pusher = new Pusher('8e2e015ec7fb8fa317d6', {
            cluster: 'sa1',
        });

        const channel = pusher.subscribe('comunicado_channel');

        channel.bind('new_comunicado', function (data) {
            setNotificaciones((prev) => [...prev, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!cookies.load("SessionId")) {
          navigate("/");
        }
      }, []);

    const fetchComunicados = async () => {
        try {
            const response = await axios.get('https://inventariodeporcali.onrender.com/getComunicados',
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.load("SessionId")}`
                    }
                }
            );
            const sortedComunicados = response.data.coms.sort(
                (a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
            );
            setComunicados(sortedComunicados);
        } catch (error) {
            console.error('Error fetching comunicados:', error);
        }
    };

    const handleCreateComunicado = async (e) => {
        e.preventDefault();
        if (!newComunicado) return;

        setLoading(true);

        // Crear un FormData para enviar texto e imagen
        const formData = new FormData();
        formData.append('contenido', newComunicado);
        formData.append('SessionId', cookies.load('SessionId'));

        // Verificar si hay una imagen seleccionada
        if (selectedImage) {
            formData.append('imagen', selectedImage);
        }

        try {
            await axios.post('https://inventariodeporcali.onrender.com/addComunicado/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${cookies.load("SessionId")}`
                },
            });
            setNewComunicado(''); // Limpiar el formulario
            setSelectedImage(null); // Limpiar la imagen seleccionada
            fetchComunicados(); // Refrescar la lista
        } catch (error) {
            console.error('Error creating comunicado:', error);
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleReaction = async (comunicadoId, tipo) => {
        try {
            await axios.post('https://inventariodeporcali.onrender.com/addReaccion/', {
                id: comunicadoId,
                tipo: tipo,
                SessionId: cookies.load('SessionId'),
            },
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.load("SessionId")}`
                    }
                });
            fetchComunicados(); // Actualizar la lista después de la reacción
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    const handleComment = async (comunicadoId, comentario) => {
        if (!comentario) return;

        try {
            await axios.post('https://inventariodeporcali.onrender.com/addComentario/', { id: comunicadoId, contenido: comentario, SessionId: cookies.load('SessionId') });
            fetchComunicados(); // Actualizar los comentarios
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

        // Función para eliminar una notificación
        const removeNotification = (index) => {
            setNotificaciones((prev) => prev.filter((_, i) => i !== index));
        };

    return (
        <main className="min-h-screen bg-cover bg-center bg-[url('./assets/fondoLogin.jpg')]">
            <NavbarUser name={nombre} />
            <News />
            <div>
                {notificaciones.map((noti, index) => (
                    <Notification 
                        key={index} 
                        message={noti.title} 
                        onReload={() => {
                            fetchComunicados();
                            removeNotification(index); // Eliminar la notificación
                        }} 
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleCreateComunicado} className="flex flex-col space-y-4">
                        <textarea
                            className="border border-gray-300 rounded-md p-3 w-full"
                            placeholder="¿Qué tienes en mente?"
                            value={newComunicado}
                            onChange={(e) => setNewComunicado(e.target.value)}
                            required
                        />

                        <label className="border border-dashed border-gray-400 p-6 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all">
                            <span className="text-gray-500">Haz clic o arrastra una imagen aquí</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {selectedImage && (
                            <p className="text-sm text-gray-600">Imagen seleccionada: {selectedImage.name}</p>
                        )}

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all hover:scale-105 text-white text-2xl font-bold p-4 rounded-lg w-full shadow-lg"
                            disabled={loading}
                        >
                            {loading ? 'Publicando...' : 'Publicar Comunicado'}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    {comunicados.map((comunicado) => (
                        <div key={comunicado.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-2">{comunicado.autor ? comunicado.autor.nombre : 'Autor desconocido'}</h2>
                            <p className="text-gray-700 mb-4">{comunicado.contenido}</p>

                            {comunicado.imagen && (
                                <img
                                    src={comunicado.imagen}
                                    alt="Imagen del comunicado"
                                    className="w-full h-auto max-h-80 object-contain rounded-md mb-4"  // Imagen que se adapta
                                />
                            )}

                            <p className="text-sm text-gray-500">Publicado el {new Date(comunicado.fecha_publicacion).toLocaleString()}</p>

                            {/* Reacciones */}
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => handleReaction(comunicado.id, 'me_gusta')}
                                    className="flex items-center space-x-1 text-green-500"
                                >
                                    👍 Like ({comunicado.reacciones.filter(r => r.tipo === 'me_gusta').length})
                                </button>
                                <button
                                    onClick={() => handleReaction(comunicado.id, 'triste')}
                                    className="flex items-center space-x-1 text-red-500"
                                >
                                    👎 Dislike ({comunicado.reacciones.filter(r => r.tipo === 'triste').length})
                                </button>
                            </div>

                            {/* Comentarios */}
                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">Comentarios:</h3>
                                {comunicado.comentarios.map((comentario, index) => (
                                    <p key={index} className="text-gray-600 mb-1">
                                        <strong>{comentario.autor.nombre}:</strong> {comentario.contenido}
                                    </p>
                                ))}

                                {/* Formulario para comentar */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleComment(comunicado.id, e.target.comentario.value);
                                        e.target.comentario.value = '';
                                    }}
                                    className="mt-4 flex"
                                >
                                    <input
                                        type="text"
                                        name="comentario"
                                        placeholder="Escribe un comentario..."
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gray-800 text-white py-2 px-4 rounded ml-2"
                                    >
                                        Comentar
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default HomeUser;

