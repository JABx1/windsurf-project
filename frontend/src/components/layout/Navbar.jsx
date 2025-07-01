import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated()) return null;

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Gestión de Insumos
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/listas">Listas</Nav.Link>
            <Nav.Link as={Link} to="/proveedores">Proveedores</Nav.Link>
            <Nav.Link as={Link} to="/insumos">Insumos</Nav.Link>
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">
                Administración
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">
              Hola, {user?.username || 'Usuario'}
            </Navbar.Text>
            <Button variant="outline-light" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
