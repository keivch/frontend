import Footer from "../components/footer";
import Navbar from "../components/Navbar";

const Documentacion = () => {

    return (
        <main>
            <Navbar />
            <section className="bg-slate-50 w-full h-[50%] flex grid-cols-2">
                <section className="bg-slate-50 w-full h-[50%] grid grid-cols-2 gap-4 p-8">
                    {/* Sección izquierda: Tips y Atajos */}
                    <section className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Tips para Mejorar el Desempeño del Sistema</h2>
                        <ul className="list-disc pl-5 space-y-3 text-lg">
                            <li>En la sección de Windows Update, haz clic en el botón que dice Buscar actualizaciones.</li>
                            <li>Si tu computadora está congelada, intenta presionar <span className="font-bold">Ctrl + Alt + Supr</span> y abre el administrador de tareas.</li>
                            <li>Para buscar programas que consumen muchos recursos, usa <span className="font-bold">Ctrl + Shift + Esc</span> para abrir directamente el Administrador de Tareas.</li>
                            <li>Mantén tu navegador con solo las pestañas esenciales abiertas para evitar ralentización.</li>
                            <li>Desconecta dispositivos USB no utilizados para evitar conflictos de hardware.</li>
                        </ul>
                        <img
                            src="https://pbs.twimg.com/media/DfBi7oIW0AEd8op?format=jpg&name=900x900"
                            alt="Administrador de Tareas"
                            className="w-full h-auto mt-4 rounded-md shadow-md"
                        />
                    </section>

                    {/* Sección derecha: Comandos y Soluciones Comunes */}
                    <section className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Comandos Útiles y Soluciones Rápidas</h2>
                        <div className="space-y-3 text-lg">
                            <p><span className="font-bold">Solución a internet lento:</span> Abre el Símbolo del sistema y escribe <span className="bg-gray-200 p-1 rounded">ipconfig /flushdns</span> para limpiar el DNS y acelerar la conexión.</p>
                            <p><span className="font-bold">Reparar Microsoft Word:</span> Si Word se congela, presiona <span className="font-bold">Ctrl + S</span> para guardar tu trabajo antes de forzar el cierre.</p>
                            <p><span className="font-bold">Comando para liberar espacio:</span> Ejecuta <span className="bg-gray-200 p-1 rounded">cleanmgr</span> en la barra de búsqueda de Windows para limpiar archivos temporales.</p>
                            <p><span className="font-bold">Atajo para reiniciar gpu:</span> Usa <span className="font-bold"> Win + Ctrl + Shift + B </span> después de unos segundos en negro y un pitido, sabremos que el comando ha surtido efecto y nuestra tarjeta gráfica se ha reiniciado</p>
                        </div>
                        <img
                            src="https://f057a20f961f56a72089-b74530d2d26278124f446233f95622ef.ssl.cf1.rackcdn.com/site/blog/flush-dns-windows/method-1-command-prompt.png"
                            alt="Flush DNS"
                            className="w-full mt-4 rounded-md shadow-md"
                        />
                    </section>
                </section>


            </section>
            <Footer />

        </main>
    );
};
export default Documentacion