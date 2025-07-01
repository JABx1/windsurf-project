import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form, ToastContainer, Toast } from 'react-bootstrap';
import { translations } from '../translations';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedProveedores = localStorage.getItem('proveedores');
    if (savedProveedores) setProveedores(JSON.parse(savedProveedores));
  }, []);

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
  }, [proveedores]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const nuevoProveedor = {
        id: Date.now(),
        ...formData
      };
      
      setProveedores([...proveedores, nuevoProveedor]);
      handleClose();
      setToastMessage('Proveedor agregado correctamente');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
      setToastMessage('Error al guardar el proveedor');
      setToastType('danger');
      setShowToast(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este proveedor?')) {
      try {
        setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
        setToastMessage('Proveedor eliminado correctamente');
        setToastType('success');
        setShowToast(true);
      } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        setToastMessage('Error al eliminar el proveedor');
        setToastType('danger');
        setShowToast(true);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ nombre: '', contacto: '', telefono: '', email: '' });
  };

  return (
    <Container>
      <h2>Proveedores</h2>
      <p>Módulo de gestión de proveedores</p>
      
      <Button 
        variant="primary" 
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Agregar Proveedor
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map(proveedor => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.contacto}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.email}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(proveedor.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay proveedores registrados</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para agregar/editar proveedor */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Persona de contacto</Form.Label>
              <Form.Control 
                type="text" 
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast para notificaciones */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 11 }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? 'Éxito' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Proveedores;
