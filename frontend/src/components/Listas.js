import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, ToastContainer, Toast, Form } from 'react-bootstrap';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import translations from '../translations';

const Listas = () => {
  const [rubros, setRubros] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState('rubros');
  const [formData, setFormData] = useState({
    nombre: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar datos del backend al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rubrosRes, unidadesRes, areasRes] = await Promise.all([
          api.get('/listas/rubros'),
          api.get('/listas/unidades'),
          api.get('/listas/areas')
        ]);

        setRubros(rubrosRes.data.data);
        setUnidades(unidadesRes.data.data);
        setAreas(areasRes.data.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
        showToastMessage('Error al cargar los datos', 'danger');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      showToastMessage('El nombre no puede estar vacío', 'danger');
      return;
    }

    try {
      setLoading(true);
      let endpoint = '';
      
      if (selectedList === 'rubros') {
        endpoint = '/listas/rubros';
      } else if (selectedList === 'unidades') {
        endpoint = '/listas/unidades';
      } else if (selectedList === 'areas') {
        endpoint = '/listas/areas';
      }

      const response = await api.post(endpoint, { nombre: formData.nombre });
      
      // Actualizar el estado correspondiente
      if (selectedList === 'rubros') {
        setRubros([...rubros, response.data]);
      } else if (selectedList === 'unidades') {
        setUnidades([...unidades, response.data]);
      } else if (selectedList === 'areas') {
        setAreas([...areas, response.data]);
      }

      handleClose();
      showToastMessage('Registro guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el registro';
      showToastMessage(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, listType) => {
    if (!window.confirm('¿Está seguro que desea eliminar este registro?')) {
      return;
    }

    try {
      setLoading(true);
      let endpoint = '';
      
      if (listType === 'rubros') {
        endpoint = `/listas/rubros/${id}`;
      } else if (listType === 'unidades') {
        endpoint = `/listas/unidades/${id}`;
      } else if (listType === 'areas') {
        endpoint = `/listas/areas/${id}`;
      }

      await api.delete(endpoint);
      
      // Actualizar el estado correspondiente
      if (listType === 'rubros') {
        setRubros(rubros.filter(item => item._id !== id));
      } else if (listType === 'unidades') {
        setUnidades(unidades.filter(item => item._id !== id));
      } else if (listType === 'areas') {
        setAreas(areas.filter(item => item._id !== id));
      }
      
      showToastMessage('Registro eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el registro';
      showToastMessage(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ nombre: '' });
  };

  const renderTable = (items, listType) => {
    if (loading && items.length === 0) {
      return <div className="text-center my-4">Cargando...</div>;
    }

    return (
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.nombre}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(item._id, listType)}
                    disabled={loading}
                  >
                    {loading ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                {loading ? 'Cargando...' : 'No hay registros'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const getListTitle = () => {
    switch(selectedList) {
      case 'rubros':
        return 'Rubros';
      case 'unidades':
        return 'Unidades';
      case 'areas':
        return 'Áreas';
      default:
        return 'Listas';
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">{getListTitle()}</h2>
      
      <Row className="mb-4">
        <Col>
          <Button 
            variant="primary" 
            onClick={() => {
              setSelectedList('rubros');
              setShowModal(true);
            }}
            className="me-2"
          >
            {translations.listas.buttons.newRubro}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setSelectedList('unidades');
              setShowModal(true);
            }}
            className="me-2"
          >
            {translations.listas.buttons.newUnidad}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setSelectedList('areas');
              setShowModal(true);
            }}
          >
            {translations.listas.buttons.nuevaArea}
          </Button>
        </Col>
      </Row>

      {/* Sección de Rubros */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Rubros</h3>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => {
              setSelectedList('rubros');
              setShowModal(true);
            }}
          >
            + Agregar Rubro
          </Button>
        </div>
        {renderTable(rubros, 'rubros')}
      </div>

      {/* Sección de Unidades */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Unidades</h3>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => {
              setSelectedList('unidades');
              setShowModal(true);
            }}
          >
            + Agregar Unidad
          </Button>
        </div>
        {renderTable(unidades, 'unidades')}
      </div>

      {/* Sección de Áreas */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Áreas</h3>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => {
              setSelectedList('areas');
              setShowModal(true);
            }}
          >
            + Agregar Área
          </Button>
        </div>
        {renderTable(areas, 'areas')}
      </div>

      {/* Modal para agregar/editar */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedList === 'rubros' ? 'Nuevo Rubro' : 
             selectedList === 'unidades' ? 'Nueva Unidad' : 'Nueva Área'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ nombre: e.target.value })}
                required
                autoFocus
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

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

export default Listas;
