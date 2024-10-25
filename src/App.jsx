// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './templates/login';
import Equipo from './templates/Equipo';
import AddUsers from './templates/AddUsers';  // Importa el nuevo componente
import Passwords from './templates/Passwords';
import Components from './templates/Components';
import Licencias from './templates/Licencias';
import Documentacion from './templates/Documentacion';
import Backup from './templates/Backup';
import HomeUser from './templates/HomeUser';
import Tickets from './templates/Tickets';
import Home from './templates/Home';
import Htickets from './templates/HTickets';
import TicketsUser from './templates/TicketsUser';
import RestorePassword from './templates/RestorePassword';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />  {/* Ruta para la ventana de login */}
      <Route path="/Equipo" element={<Equipo />} />  {/* Ruta para la nueva ventana */}
      <Route path="/AddUsers" element={<AddUsers />} />
      <Route path="/Passwords" element={<Passwords />} />
      <Route path="/Components" element={<Components />} />
      <Route path="/Licencias" element={<Licencias />} />
      <Route path="/Documentacion" element={<Documentacion />} />
      <Route path="/Backup" element={<Backup />} />
      <Route path="/HomeUser/:nombre" element={<HomeUser />} />
      <Route path="/Tickets" element={<Tickets />} />
      <Route path="/Home" element={<Home />} />
      <Route path='/HTickets' element={<Htickets />} />
      <Route path='/TicketsUser' element={<TicketsUser />} />
      <Route path='/RestorePassword' element={<RestorePassword />} />
    </Routes>
  );
}

export default App;

