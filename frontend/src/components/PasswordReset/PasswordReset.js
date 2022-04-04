import React, { useState } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText } from './PasswordResetElements'

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";
import MainNav from '../Nav/MainNav'


// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        email: '',
    });

    const [emailErr, setEmailErr] = useState('')

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance
            .post(`/auth/users/reset_password/`, {
                email: formData.email,
            })
            .then((res) => {
                navigate("instructions_sent")
            })
            .catch((err) => {
                setEmailErr(err.response.data.email)
            })
    }

    return (
        <div style={{ overflow: "hidden" }}>
            <Row>
                <MainNav isAuthenticated={false} />
            </Row>
            <Container fluid>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Forgot your Password?</HeadingText><br />
                        <ParaText>Don't worry, it happens to the best of us.</ParaText>
                        <LoginContainer>
                            <form style={{ width: "80%" }}>
                                <FormGroup>
                                    <Label><ParaText>Email</ParaText></Label>
                                    <Input
                                        name="email"
                                        data-testid="email"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 3 }}>
                                        <Button
                                            type="submit"
                                            onClick={handleSubmit}
                                            style={{ backgroundColor: "#653FFD" }}>
                                            Send Reset Email
                                        </Button>
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
