import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Listas from './components/Listas';
import Proveedores from './components/Proveedores';
import Insumos from './components/Insumos';
import ListasPrecios from './components/ListasPrecios';
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
