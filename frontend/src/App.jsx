import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Listas from './components/Listas.jsx';
import Proveedores from './components/Proveedores.jsx';
import Insumos from './components/Insumos.jsx';
import ListasPrecios from './components/ListasPrecios.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Container className="mt-4">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Listas />} />
                <Route path="/listas" element={<Listas />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/insumos" element={<Insumos />} />
                <Route path="/listas-precios" element={<ListasPrecios />} />
              </Route>

              {/* Ruta por defecto (redirige a /listas) */}
              <Route path="*" element={
                <main style={{ padding: "1rem" }}>
                  <p>¡Ups! No hay nada aquí.</p>
                </main>
              } />
            </Routes>
          </Container>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
