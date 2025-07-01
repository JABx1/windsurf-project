import React from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';

const Insumos = () => {
  return (
    <div>
      <h2>Insumos</h2>
      <p>Módulo de gestión de insumos</p>
      <Button variant="primary" className="mb-3">
        Agregar Insumo
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5" className="text-center">No hay insumos registrados</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Insumos;
