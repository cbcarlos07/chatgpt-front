import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from '../../services/http';
import "../../style/bootstrap.min.css";
import './register.css'

const RegisterPage = () =>{
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: ''
	})
    const [pwdIsvalid, setPwsIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isError, setIsError] = useState([])

    const handleInputChange = event =>{
        const { name, value } = event.target
        const form = event.currentTarget;
        setFormData({...formData, [name]: value})

        if (!form.checkValidity()) {
            setValidated(true);
        }else{
            setValidated(false);
        }
        if( name === 'confirmPassword' ){
            if (value != formData.password){
                setPwsIsValid(false)
            }else setPwsIsValid(true)
        }
	}

    const fnShowPassowrd = () => {
        setShowPassword(!showPassword)
    }

    const submit = e => {
        e.preventDefault()
        const data = formData
        delete data.confirmPassword
        data.message = []
        api.post('/user/create', data)
           .then( response => {
                const {data, token} = response.data.response
                localStorage.setItem('token', token)
                setAuthToken()
                localStorage.setItem('name', data.name)
                localStorage.setItem('email', data.email)
                localStorage.setItem('id', data._id)
                navigate("/chat");
           }).catch(e => {
                console.log('catch',e.response.data.errors);
                setIsError(e.response.data.errors)
           })
    }

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5">
            <Card style={{ width: "850px", background: '#353541',color: 'white' }}>
                <Card.Body>

                    <Row >
                        <Col md={12}>
                        <h1 className="text-center my-4 ">Create an Account</h1>
                        {
                            isError.length > 0 ?
                                isError.map(i => (
                                    <Form.Text className='text-muted justify-content-center mb-3' >
                                       { `* ${i}`}
                                    </Form.Text>
                                ))

                            : <></>

                        }
                        <Form noValidate validated={validated} onSubmit={submit}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    name="name"
                                    value={formData.name}
                                    required
                                    onChange={handleInputChange}/>
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email} 
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type={showPassword ? 'text' :'password'}
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password} 
                                    required
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formConfirmPassword" >
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                    type={showPassword ? 'text' :'password'}
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword} 
                                    required
                                    onChange={handleInputChange}
                                />
                                {
                                    formData.password !== '' && !pwdIsvalid ?
                                    <Form.Text className='text-muted' >
                                        Senhas não conferem
                                    </Form.Text>

                                    : <></>

                                }
                            </Form.Group>
                            <Form.Check 
                                type="checkbox"
                                label="Show password"
                                onChange={fnShowPassowrd}
                                style={{marginTop: '10px'}}
                            />
                            <Button variant="primary" type="submit" block className='mt-3' disabled={!validated && !pwdIsvalid}>
                                Register
                            </Button>&nbsp;
                            <Button variant="warning" block className='mt-3' onClick={() => navigate(-1)} >
                                Go back
                            </Button>
                        </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>    
        </Container>
    );
}

export default RegisterPage;