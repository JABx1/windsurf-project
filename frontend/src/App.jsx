import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';

// Carga perezosa de componentes para code-splitting
const Login = lazy(() => import('./components/auth/Login.jsx'));
const Register = lazy(() => import('./components/auth/Register.jsx'));
const Listas = lazy(() => import('./components/Listas.jsx'));
const Proveedores = lazy(() => import('./components/Proveedores.jsx'));
const Insumos = lazy(() => import('./components/Insumos.jsx'));
const ListasPrecios = lazy(() => import('./components/ListasPrecios.jsx'));

// Importar estilos
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente de carga
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </Spinner>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Container className="mt-4">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Rutas públicas */}
                <Route 
                  path="/login" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Login />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Register />
                    </React.Suspense>
                  } 
                />

                {/* Rutas protegidas */}
                <Route element={
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <PrivateRoute />
                  </React.Suspense>
                }>
                  <Route path="/" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Listas />
                    </React.Suspense>
                  } />
                  <Route path="/listas" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Listas />
                    </React.Suspense>
                  } />
                  <Route path="/proveedores" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Proveedores />
                    </React.Suspense>
                  } />
                  <Route path="/insumos" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Insumos />
                    </React.Suspense>
                  } />
                  <Route path="/listas-precios" element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <ListasPrecios />
                    </React.Suspense>
                  } />
                </Route>

                {/* Ruta por defecto (redirige a /listas) */}
                <Route path="*" element={
                  <main className="text-center py-5">
                    <h2>¡Ups! Página no encontrada</h2>
                    <p>La página que estás buscando no existe o ha sido movida.</p>
                  </main>
                } />
              </Routes>
            </Suspense>
          </Container>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
