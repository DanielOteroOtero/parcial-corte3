import React, { useState, useEffect } from 'react';
import LoginRegister from './LoginRegister';
import GestionHabitaciones from './GestionHabitaciones';
import GestionReservas from './GestionReservas';
import { useAuth } from './authContext';
import { Row, Container, Alert, Button, Card } from 'react-bootstrap'

const PagPrincipal = () => {
    const { currentUser, logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [showRegisterAlert, setShowRegisterAlert] = useState(false)

    useEffect(() => {
        if (showLoginAlert) {
            const timer = setTimeout(() => {
                setShowLoginAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showLoginAlert])

    useEffect(() => {
        if (showRegisterAlert) {
            const timer = setTimeout(() => {
                setShowRegisterAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showRegisterAlert])


    const onRegisterSuccess = () => {
        setIsLoggedIn(true)
        setShowRegisterAlert(true)
    };

    const onLoginSuccess = () => {
        setIsLoggedIn(true)
        setShowLoginAlert(true)
    };

    const handleLogout = () => {
        logout()
        setIsLoggedIn(false)
    };

    return (
        <>
            {showRegisterAlert && (
                <Alert variant="success" onClose={() => setShowRegisterAlert(false)}>
                    <b>Registrado exitosamente!</b>
                </Alert>
            )}

            {showLoginAlert && (
                <Alert variant="success" onClose={() => setShowLoginAlert(false)}>
                    <b>Inicio de sesión exitoso!</b>
                </Alert>
            )}

            {!isLoggedIn && !currentUser && (
                <LoginRegister onRegisterSuccess={onRegisterSuccess} onLoginSuccess={onLoginSuccess} />
            )}

            {isLoggedIn && currentUser && (
                <div>
                    <Container fluid className='d-flex'>
                        <Row>
                            <GestionHabitaciones />
                            <GestionReservas />
                        </Row>
                    </Container>
                    <div >
                        <Container fluid>
                            <Button className='mt-5 mb-5' style={{background: 'linear-gradient(black, blue)'}} onClick={handleLogout}><b>Cerrar sesión</b></Button>
                        </Container>
                    </div>
                </div>
            )}
        </>
    );
};

export default PagPrincipal
