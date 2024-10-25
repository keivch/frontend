import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-green-950 to-black hover:bg-green-950 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/Home" className="flex-shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Escudo_Deportivo_Cali.png/600px-Escudo_Deportivo_Cali.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Centered Links */}
          <div className="hidden md:flex md:space-x-8">
            <a href="/Backup" className="text-white hover:bg-green-700 hover:text-gray-200 px-4 py-2 rounded-md text-3xl font-bebas">Backup</a>
            <a href="#" className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md text-3xl font-bebas">Correo</a>
            <a href="/Documentacion" className="text-white hover:bg-green-700 hover:text-gray-200 px-3 py-2 rounded-md font-bebas text-3xl">Utilidades</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

