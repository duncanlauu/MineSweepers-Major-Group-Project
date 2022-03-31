import React, { useState, useRef, useEffect } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText } from './LoginElements'
import { FaExternalLinkAlt } from 'react-icons/fa'
import useAuth from '../hooks/useAuth'
import useHasRated from '../hooks/useHasRated'
import { Link } from 'react-router-dom'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import axiosInstance from '../../axios'
import { useNavigate, useLocation } from "react-router-dom";
import Nav from '../Nav/Nav'


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    const { setAuth } = useAuth();
    const { setHasRated } = useHasRated();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home"

    const usernameRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    }

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
                localStorage.setItem('user', JSON.stringify(currentUser))
                axiosInstance.defaults.headers['Authorization'] = // updating the axios instance header with the new access token.
                    'JWT ' + localStorage.getItem('access_token')
                console.log("From: ", from)
                setAuth({ user })
                setUser('')
                setPassword('')

                axiosInstance
                    .get(`ratings/`)
                    .then((r) => {
                        const rated = r.data.ratings.length > 0
                        if (rated) {
                            setHasRated({ hasRated: "true" })
                        } else {
                            setHasRated({ hasRated: "false" })
                        }
                        localStorage.setItem('hasRated', rated)
                    })
                setHasRated({ hasRated: "true" }) // additional default call to avoid issues with asynchronous loading.
                navigate(from)
            })
            .catch((e) => {
                setErrMsg("Invalid username/password")
            })
    }

    return (
        <div style={{ overflowX: "hidden" }}>
            <Row>
                <Nav isAuthenticated={false} />
            </Row>
            <Container fluid>
                <h3 ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{textAlign: "center"}}>{errMsg}</h3>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Sign into your account</HeadingText><br />
                        <ParaText>
                            If you haven't created one yet, you can do so <Link to="/sign_up/" style={{ color: "#0057FF", textDecoration: "none" }}>here <FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} />
                            </Link> .
                        </ParaText>

                        <LoginContainer>
                            <form style={{ width: "80%" }}>
                                <FormGroup>
                                    <Label><ParaText>Username</ParaText></Label>
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
                                    <Label><ParaText>Password</ParaText></Label>
                                    <Container fluid style={{ display: "flex", flexDirection: "row", padding: "0px" }}>
                                        <Input
                                            name="password"
                                            type={passwordVisible ? "text" : "password"}
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                            required
                                        />
                                        <Button
                                            onClick={togglePassword}
                                            style={{ backgroundColor: "#653FFD" }}>
                                            {passwordVisible ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                        </Button>
                                    </Container>
                                </FormGroup>

                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 4 }}>
                                        <Button
                                            type="submit"
                                            onClick={handleSubmit}
                                            style={{ backgroundColor: "#653FFD", width: "7rem" }}>
                                            Log In
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </form>
                        </LoginContainer>
                    </Col>
                    <Col />
                </Row>
            </Container>
        </div >
    )
}
