import React, { useState, useRef, useEffect } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './LoginElements'
import { FaExternalLinkAlt } from 'react-icons/fa'
import useAuth from '../hooks/useAuth'

import axiosInstance from '../../axios'
import { useNavigate, Link, useLocation } from "react-router-dom";


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home"

    const usernameRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        usernameRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, password])

    const handleSubmit = (e) => {
        e.preventDefault()

        axiosInstance
            .post(`token/`, {
                username: user,
                password: password,
            })
            .then((response) => {
                const access_token = response.data.access
                const refresh_token = response.data.refresh
                localStorage.setItem('access_token', access_token) // receiving the tokens from the api
                localStorage.setItem('refresh_token', refresh_token)
                localStorage.setItem('username', user) // might not be necessary
                axiosInstance.defaults.headers['Authorization'] = // updating the axios instance header with the new access token.
                    'JWT ' + localStorage.getItem('access_token')
                console.log("From: ", from)
                setAuth({ user })
                setUser('')
                setPassword('')
                navigate(from)
                console.log(response);
                console.log(response.data);
            })
    }

    return (
        <div>
            <Row>
                <Navbar color="light" expand="md" light>
                    <NavbarBrand href="/">
                        <h1> bookgle </h1>
                    </NavbarBrand>
                </Navbar>
            </Row>
            <Container fluid>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Sign into your account</HeadingText><br />
                        <ParaText>If you haven't created one yet, you can do so here <FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} /> .</ParaText>

                        <LoginContainer>
                            <form>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input
                                        name="username"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        ref={usernameRef}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input
                                        name="password"
                                        type="text"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 4 }}>
                                        <Button type="submit" onClick={handleSubmit} style={{ backgroundColor: "#653FFD", width: "7rem" }}>Sign In</Button>
                                    </Col>
                                </FormGroup>
                            </form>
                        </LoginContainer>
                    </Col>
                    <Col />
                </Row>
            </Container>
        </div>
    )
}
