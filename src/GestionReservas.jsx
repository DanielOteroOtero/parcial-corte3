import React, { useState, useEffect } from 'react';
import { Container, Col, Card, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

function gestionReservas() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        axios.get('http://localhost:3000/bookings')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error('Error al cargar las reservas:', error);
            });
    };

    return (
        <>
            <style>
                {`hr {
                    height: 5px;
                    background-color: black;
                    border: none;
                }

                .alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }

                .cardReservas {
                    background: linear-gradient(rgb(231, 215, 0), 80%, rgb(255, 117, 200));
                }

                body {
                    background: linear-gradient(black, 30%, rgb(0, 156, 138));
                }`}
            </style>

            <Col lg={6} className='mt-4'>
                <Card className="cardReservas">
                    <Container className='mt-5 mb-5'>
                        <h1>RESERVAS</h1>
                        <div id='reservas' className="table-responsive col-12">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Código de habitacion</th>
                                        <th>Telefono del cliente</th>
                                        <th>Nombre del cliente</th>
                                        <th>Fecha de reservacion</th>
                                        <th>Fecha de entrada</th>
                                        <th>Fecha de salida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => (
                                        <tr key={index}>
                                            <td>{booking.código}</td>
                                            <td>{booking.código_habitación}</td>
                                            <td>{booking.telefono_cliente}</td>
                                            <td>{booking.Nombre_cliente}</td>
                                            <td>{booking.fecha_reservación}</td>
                                            <td>{booking.fecha_entrada}</td>
                                            <td>{booking.fecha_salida}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </Card>
            </Col>
        </>
    )
}

export default gestionReservas