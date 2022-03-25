import React, {useState, useRef} from "react";
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'
import {SignUpContainer, FormLayout} from "./SignUpStyle";
import {HeadingText, ParaText} from "../Login/LoginElements";
import {Link} from "react-router-dom";
import {FaExternalLinkAlt} from 'react-icons/fa'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'

import axiosInstance from '../../axios'
import {useNavigate} from "react-router";
import useAuth from '../hooks/useAuth';
import Nav from "../Nav/Nav";


export default function SignUp() {

    const [firstNameErr, setFirstNameErr] = useState("")
    const [lastNameErr, setLastNameErr] = useState("")
    const [usernameErr, setUsernameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passwordErr, setPasswordErr] = useState("")
    const [bioErr, setBioErr] = useState("")
    const [locationErr, setLocationErr] = useState("")
    const [birthdayErr, setBirthdayErr] = useState("")

    const navigate = useNavigate();

    const {setAuth} = useAuth();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    const initialFormData = Object.freeze({ // After the user has typed in their data, it can no longer be changed. (.freeze)
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        bio: '',
        location: '',
        birthday: '',
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", formData)

        axiosInstance
            .post(`user/sign_up/`, { // the url is expanded to api/user/sign_up/. Creating key-value pairs in JSON format that the API then can work with.
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                bio: formData.bio,
                location: formData.location,
                birthday: formData.birthday,
            })
            .then((res) => {
                axiosInstance
                    .post(`token/`, {
                        username: formData.username,
                        password: formData.password,
                    })
                    .then((response) => {
                        const access_token = response.data.access
                        const refresh_token = response.data.refresh
                        const username = formData.username
                        localStorage.setItem('access_token', access_token) // receiving the tokens from the api
                        localStorage.setItem('refresh_token', refresh_token)
                        localStorage.setItem('username', username) // might not be necessary
                        axiosInstance.defaults.headers['Authorization'] = // updating the axios instance header with the new access token.
                            'JWT ' + localStorage.getItem('access_token')
                        // console.log("logging in after sign up ")
                        setAuth({"user": username})
                        navigate("/sign_up/rating/")
                    })
            })
            .catch((e) => {
                setFirstNameErr(e.response.data.first_name)
                setLastNameErr(e.response.data.last_name)
                setUsernameErr(e.response.data.username)
                setEmailErr(e.response.data.email)
                setPasswordErr(e.response.data.password)
                setBioErr(e.response.data.bio)
                setLocationErr(e.response.data.location)
                setBirthdayErr(e.response.data.birthday)
            })
    }

    // Todo: move styles to a CSS file?
    return (
        <div id="ParentDiv" style={{overflowX: "hidden"}}>
            <Row>
                <Nav isAuthenticated={false}/>
            </Row>
            <Container fluid style={{overflowX: "hidden", overflowY: "hidden"}}>
                <Row style={{marginTop: "3rem"}}>
                    <Col/>
                    <Col>
                        <HeadingText>Create an account</HeadingText><br/>
                        <ParaText>If you already have one, you can log in <Link to="/log_in/" style={{
                            color: "#0057FF",
                            textDecoration: "none"
                        }}>here <FaExternalLinkAlt style={{height: "15px", color: "#0057FF"}}/>
                        </Link> .
                        </ParaText>
                        <SignUpContainer style={{overflowY: "scroll", overflowX: "hidden"}}>
                            <FormLayout> {/*  might have to add more info here */}
                                <Row>
                                    <Col xs="6">
                                        <FormGroup>
                                            <Label for="first_name"><ParaText>First Name</ParaText></Label>
                                            <Input
                                                data-testid="first_name"
                                                id="first_name"
                                                name="first_name" // name to target from JS
                                                onChange={handleChange}
                                                style={{border: "0", backgroundColor: "#F3F3F3"}}
                                            />
                                        </FormGroup>
                                        <div>{firstNameErr}</div>
                                    </Col>
                                    <Col xs="6">
                                        <FormGroup>
                                            <Label for="last_name"><ParaText>Last Name</ParaText></Label>
                                            <Input
                                                data-testid="last_name"
                                                id="last_name"
                                                name="last_name"
                                                onChange={handleChange}
                                                style={{border: "0", backgroundColor: "#F3F3F3"}}
                                            />
                                        </FormGroup>
                                        <div>{lastNameErr}</div>
                                    </Col>
                                </Row>

                                <FormGroup>
                                    <Label for="username"><ParaText>Username</ParaText></Label>
                                    <Input
                                        data-testid="username"
                                        id="username"
                                        name="username"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>
                                <div>{usernameErr}</div>

                                <FormGroup>
                                    <Label for="email"><ParaText>Email</ParaText></Label>
                                    <Input
                                        data-testid="email"
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>
                                <div>{emailErr}</div>

                                <FormGroup>
                                    <Label for="password"><ParaText>Password</ParaText></Label>
                                    <Container fluid style={{display: "flex", flexDirection: "row", padding: "0px"}}>
                                        <Input
                                            type={passwordVisible ? "text" : "password"}
                                            id="password"
                                            data-testid="password"
                                            name="password"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                        <Button
                                            onClick={togglePassword}
                                            style={{backgroundColor: "#653FFD"}}>
                                            {passwordVisible ? <BsFillEyeSlashFill/> : <BsFillEyeFill/>}
                                        </Button>
                                    </Container>
                                </FormGroup>
                                <div>{passwordErr}</div>

                                <FormGroup>
                                    <Label for="bio"><ParaText>Bio</ParaText></Label>
                                    <Input
                                        data-testid="bio"
                                        id="bio"
                                        name="bio"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3"}}
                                    />
                                </FormGroup>
                                <div>{bioErr}</div>

                                <Row>
                                    <Col xs="8">
                                        <FormGroup>
                                            <Label for="location"><ParaText>Location</ParaText></Label>
                                            <Input
                                                data-testid="location"
                                                id="location"
                                                name="location"
                                                onChange={handleChange}
                                                style={{border: "0", backgroundColor: "#F3F3F3"}}
                                            />
                                        </FormGroup>
                                        <div>{locationErr}</div>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label for="birthday"><ParaText>Birthday</ParaText></Label>
                                            <Input
                                                data-testid="birthday"
                                                id="birthday"
                                                type="date"
                                                name="birthday"
                                                onChange={handleChange}
                                                style={{border: "0", backgroundColor: "#F3F3F3"}}
                                            />
                                        </FormGroup>
                                        <div>{birthdayErr}</div>
                                    </Col>
                                </Row>

                                <FormGroup>
                                    <Col sm={{size: 10, offset: 4}}>
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handleSubmit}
                                            style={{backgroundColor: "#653FFD", width: "7rem", marginBottom: "1rem"}}
                                        >
                                            Sign Up
                                        </Button>
                                    </Col>
                                </FormGroup>

                            </FormLayout>
                        </SignUpContainer>

                    </Col>
                    <Col/>
                </Row>
            </Container>
        </div>
    );
}