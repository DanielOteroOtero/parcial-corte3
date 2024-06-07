import React, { useState } from 'react';
import { useAuth } from './authContext';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const LoginForm = ({ onRegisterSuccess, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLogin) {
      await login(email, password, onLoginSuccess);
    } else {
      const response = await register(email, password, onRegisterSuccess)
      if (response && response.token) {
        onRegisterSuccess();
      }
    }
  }
  return (
    <div style={{background: 'linear-gradient(90deg, rgb(77, 76, 76), rgb(122, 0, 0))'}}>
      <Container align="center" className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Row>
          <Col>
            <h1 style={{color: 'white'}}>GESTION DE HOTELERIA</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  className='anchoInput'
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  className='anchoInput'
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-2 mb-4">
                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
              </Button>
            </Form>
            <Button variant="success" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginForm;
