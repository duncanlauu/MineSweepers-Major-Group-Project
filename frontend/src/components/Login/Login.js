import React, {useState, useRef, useEffect} from 'react'
import {Col, Container, FormGroup, Input, Label, Row, Button} from 'reactstrap'
import {HeadingText, LoginContainer, ParaText} from './LoginElements'
import {FaExternalLinkAlt} from 'react-icons/fa'
import useAuth from '../hooks/useAuth'
import useHasRated from '../hooks/useHasRated'
import {Link} from 'react-router-dom'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'
import axiosInstance from '../../axios'
import {useNavigate, useLocation} from "react-router-dom";
import MainNav from '../Nav/MainNav'


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js

export default function SignIn() {

    const {setAuth} = useAuth();
    const {setHasRated} = useHasRated();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home"

    const usernameRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
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
    }, [username, password])

    const handleSubmit = (e) => {
        e.preventDefault()

        axiosInstance
            .post(`token/`, {
                username: username,
                password: password,
            })
            .then((response) => {
                const access_token = response.data.access
                const refresh_token = response.data.refresh
                localStorage.setItem('access_token', access_token) // receiving the tokens from the api
                localStorage.setItem('refresh_token', refresh_token)
                axiosInstance.defaults.headers['Authorization'] = // updating the axios instance header with the new access token.
                    'JWT ' + localStorage.getItem('access_token')

                axiosInstance.get('/get_current_user/')
                    .then(response => {
                        const user = response.data;
                        localStorage.setItem('user', JSON.stringify(user));
                        setAuth({user})

                        setUsername('')
                        setPassword('')

                        axiosInstance
                            .get(`ratings/`)
                            .then((r) => {
                                const rated = r.data.ratings.length > 0
                                if (rated) {
                                    setHasRated({hasRated: "true"})
                                } else {
                                    setHasRated({hasRated: "false"})
                                }
                                localStorage.setItem('hasRated', rated)
                            })
                        setHasRated({hasRated: "true"}) // additional default call to avoid issues with asynchronous loading.
                        navigate(from)

                    }).catch(error => {
                    console.error(e)
                })
            })
            .catch((e) => {
                console.error(e)
                setErrMsg("Invalid username/password")
            })
    }

    return (
        <div style={{overflowX: "hidden"}}>
            <Row>
                <MainNav isAuthenticated={false}/>
            </Row>
            <Container fluid>
                <Row style={{marginTop: "6rem"}}>
                    <Col/>
                    <Col>
                        <HeadingText>Sign into your account</HeadingText><br/><br/>
                        <ParaText>
                            If you haven't created one yet, you can do so <Link to="/sign_up/" style={{
                            color: "#0057FF",
                            textDecoration: "none"
                        }}>here <FaExternalLinkAlt style={{height: "15px", color: "#0057FF"}}/>
                        </Link> .
                        </ParaText><br/>
                        <ParaText ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"
                                  style={{color: "#FF0000", textDecoration: "none"}}><b>{errMsg}</b></ParaText>

                        <LoginContainer>
                            <form style={{width: "80%"}}>
                                <FormGroup>
                                    <Label><ParaText>Username</ParaText></Label>
                                    <Input
                                        name="username"
                                        data-testid="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        ref={usernameRef}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label><ParaText>Password</ParaText></Label>
                                    <Container fluid style={{display: "flex", flexDirection: "row", padding: "0px"}}>
                                        <Input
                                            name="password"
                                            data-testid="password"
                                            type={passwordVisible ? "text" : "password"}
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                            required
                                        />
                                        <Button
                                            onClick={togglePassword}
                                            style={{backgroundColor: "#653FFD"}}>
                                            {passwordVisible ? <BsFillEyeSlashFill/> : <BsFillEyeFill/>}
                                        </Button>
                                    </Container>
                                </FormGroup>

                                <FormGroup>
                                    <Col sm={{size: 10, offset: 1}}
                                         style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                        <Button
                                            type="submit"
                                            onClick={handleSubmit}
                                            style={{backgroundColor: "#653FFD", width: "7rem", marginBottom: "2rem"}}>
                                            Log In
                                        </Button>
                                        <ParaText style={{marginBottom: "1rem"}}>
                                            <Link to="/password_reset/"
                                                  style={{color: "#0057FF", textDecoration: "none"}}>
                                                Forgot Password?
                                            </Link>
                                        </ParaText>
                                    </Col>
                                </FormGroup>
                            </form>
                        </LoginContainer>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        </div>
    )
}
