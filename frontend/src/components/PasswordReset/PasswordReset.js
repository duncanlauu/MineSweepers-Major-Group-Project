import React, { useState } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './PasswordResetElements'
import { FaExternalLinkAlt } from 'react-icons/fa'

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        email: '',
    });

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault()
        console.log(formData)
        // axiosInstance.defaults.baseURL = '/auth/';
        axiosInstance
            .post(`/auth/users/reset_password/`, {
                email: formData.email,
            })
            .then((response) => {
              console.log(response)
                navigate("/home") // should go to a webiste that says password reset email sent
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
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Password Reset</HeadingText><br />
                        <ParaText>Enter you email address:<FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} /> .</ParaText>

                        <LoginContainer>
                            <form>
                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input
                                        name="email"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 4 }}>
                                        <Button type="submit" onClick={handleSubmit} style={{ backgroundColor: "#653FFD", width: "7rem" }}>Send Reset Email</Button>
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
