import React, { useState, useEffect } from 'react'
import { Container, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function gestionHabitaciones() {
    const [rooms, setRooms] = useState([]);
    const [roomForm, setRoomForm] = useState({ código: '', número: '', tipo: '', valor: '' });
    const [deleteCode, setDeleteCode] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert])

    const fetchRooms = () => {
        axios.get('http://localhost:3000/rooms')
            .then(response => {
                setRooms(response.data);
            })
            .catch(error => {
                console.error('Error al cargar las habitaciones:', error);
            });
    };

    const handleInputChange = (event) => {
        setRoomForm({ ...roomForm, [event.target.name]: event.target.value });
    };

    const handleDeleteInputChange = (event) => {
        setDeleteCode(event.target.value);
    };

    const handleCreate = (event) => {
        event.preventDefault();
        if (!roomForm.código || !roomForm.número || !roomForm.tipo || !roomForm.valor) {
            console.error('Todos los campos deben estar definidos');
            return;
        }
        axios.post('http://localhost:3000/rooms', roomForm)
            .then(response => {
                fetchRooms();
                setShowAlert(true);
                setRoomForm({ código: '', número: '', tipo: '', valor: '' });
            })
            .catch(error => {
                console.error('Error al crear la habitación:', error);
            });
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        if (!roomForm.código || !roomForm.número || !roomForm.tipo || !roomForm.valor) {
            console.error('Todos los campos deben estar definidos');
            return;
        }
        axios.patch(`http://localhost:3000/rooms/${roomForm.código}`, roomForm)
            .then(response => {
                fetchRooms();
                setShowAlert(true);
                setRoomForm({ código: '', número: '', tipo: '', valor: '' });
            })
            .catch(error => {
                console.error('Error al actualizar la habitación', error);
            });
    };

    const handleDelete = (event) => {
        event.preventDefault();
        if (!deleteCode) {
            console.error('El campo debe estar definido');
            return;
        }
        axios.delete(`http://localhost:3000/rooms/${deleteCode}`)
            .then(response => {
                fetchRooms();
                setShowAlert(true);
                setDeleteCode('');
            })
            .catch(error => {
                console.error('Error al eliminar la habitación:', error);
            });
    };

    return (
        <>
            <style>
                {`
                .alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }

                .cardHabitaciones {
                    background: linear-gradient(rgb(231, 215, 0), 80%, rgb(255, 117, 200));
                }

                .cardCrearHabitacion {
                    background: rgb(130, 0, 0);
                    color: white;
                }

                body {
                    background: linear-gradient(black, 30%, rgb(0, 156, 138));
                }`}
            </style>


            <Col lg={6} className='mt-4'>
                <Card className="cardHabitaciones">
                    <Container className='mt-5 mb-5'>
                        <h1>HABITACIONES</h1>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Número</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.código}>
                                        <td>{room.código}</td>
                                        <td>{room.número}</td>
                                        <td>{room.tipo}</td>
                                        <td>{room.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {showAlert && (
                            <Alert variant="success">
                                Operacion exitosa!
                            </Alert>
                        )}

                        <Card className="cardCrearHabitacion mb-5">
                            <Form>
                                <Form.Group controlId="formCódigo">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type="text" name="código" value={roomForm.código} onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group controlId="formNúmero">
                                    <Form.Label>Número</Form.Label>
                                    <Form.Control type="text" name="número" value={roomForm.número} onChange={handleInputChange} />
                                </Form.Group>



                                <Form.Group controlId="formTipo">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Control type="text" name="tipo" value={roomForm.tipo} onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group controlId="formValor">
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control type="text" name="valor" value={roomForm.valor} onChange={handleInputChange} />
                                </Form.Group>

                                <Button className="mt-3" variant="success" onClick={handleCreate}>Crear Habitación</Button>
                                <Button className="mt-3 ml-4" variant="warning" onClick={handleUpdate}>Actualizar Habitación</Button>
                            </Form>
                        </Card>

                        <Card>
                            <Form>
                                <Form.Group controlId="formCódigoDelete">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type="text" name="código" value={deleteCode} onChange={handleDeleteInputChange} />
                                </Form.Group>
                                <Button className="mt-3 ml-4" variant="danger" onClick={handleDelete}>Eliminar Habitación</Button>
                            </Form>
                        </Card>
                    </Container>
                </Card>
            </Col>
        </>
    )
}

export default gestionHabitaciones