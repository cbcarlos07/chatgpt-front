import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'
import { api, setAuthToken } from "../../services/http";
import "../../style/bootstrap.min.css";
import './login.css'

const LoginForm = () =>{
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: '', password: ''})
  const [isError, setIsError] = useState(null)
  
  const handleData = event => {
    const { name, value } = event.target
    setFormData({...formData, [name]: value})
  }
  const handleLogin = (event) => {
    event.preventDefault();
    api.patch('/auth', formData)
       .then(response => {
          const {resp: data, token} = response.data
          localStorage.setItem('token', token)
          setAuthToken()
          localStorage.setItem('name', data.name)
          localStorage.setItem('email', data.email)
          localStorage.setItem('id', data._id)
          navigate("/chat");

       }).catch(e => {
        
          setIsError(e.response.data)
       })
    
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "350px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {
            isError ?
              <Form.Text className='text-muted justify-content-center mb-3' >
                  { `* ${isError.msg}`}
              </Form.Text>
            : <></>
          }
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleData}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleData}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
            
            <Row style={{marginTop: '16px'}}>
                <Col sm={6}>
                    <Link to='/register' className="link">Registre-se</Link>
                </Col>
                <Col sm={6}></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;