import React from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';

const ListasPrecios = () => {
  return (
    <div>
      <h2>Listas de Precios</h2>
      <p>Módulo de gestión de listas de precios</p>
      
      <div className="mb-4">
        <h4>Nueva Lista de Precios</h4>
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="formProveedor">
                <Form.Label>Proveedor</Form.Label>
                <Form.Select>
                  <option>Seleccione un proveedor</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formFecha">
                <Form.Label>Fecha de Vigencia</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary">
                Crear Lista
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Fecha de Creación</th>
            <th>Vigencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" className="text-center">No hay listas de precios registradas</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ListasPrecios;
