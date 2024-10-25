import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const Backup = () => {
  return (
    <main>
      <Navbar />
      <section className="bg-slate-50 p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Guía para Hacer un Backup con Robocopy</h1>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">1. Abrir el Símbolo del Sistema (CMD) como Administrador</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Accede al menú de inicio.</li>
              <li>Busca el Símbolo del sistema.</li>
              <li>Ejecuta como administrador.</li>
            </ol>   
            <img 
              src="https://wiki.interactive-asia.com/images/f/f9/Cmd.png" 
              alt="Ejecutar como Administrador" 
              className="w-full rounded-md shadow-md"
            />

            <h2 className="text-2xl font-semibold">2. Usar el Comando Robocopy</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Escribe el comando básico robocopy [origen] [destino] [opciones] .</li>
              <li>Ejemplo de comando robocopy C:\Documentos D:\Backup\Documentos /R:3 /W:10
              .</li>
            </ol>
            <img 
              src="https://media.geeksforgeeks.org/wp-content/uploads/20200701224414/Screenshot-5223.png" 
              alt="Ejemplo de Comando" 
              className="w-full rounded-md shadow-md"
            />

            <h2 className="text-2xl font-semibold">4. Verificar la Copia de Seguridad</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Revisa el reporte.</li>
              <li>Verifica los archivos copiados.</li>
            </ol>
            <img 
              src="https://miro.medium.com/v2/resize:fit:1400/1*Y5jL2K0-Hx3c81pIqd9DbQ.png" 
              alt="Reporte de Robocopy" 
              className="w-full rounded-md shadow-md"
            />
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
};

export default Backup;
