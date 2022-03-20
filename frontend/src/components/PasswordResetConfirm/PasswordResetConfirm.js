import React, { useState } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './PasswordResetConfirmElements'
import { FaExternalLinkAlt } from 'react-icons/fa'

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    let params = useParams()
    // console.log(params)
  // console.log(useParams());
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
      new_password: '',
      re_new_password: ''
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
        console.log(params)
        // uid = useParams()["uid"]
        // console.log(params["uid"]);
        // users/reset_password_confirm/"
        // axiosInstance.defaults.baseURL = '/auth/';
        axiosInstance
            .post(`/auth/users/reset_password_confirm/`, {
               uid: params["uid"],
               token: params["token"],
               new_password: formData.new_password,
               re_new_password: formData.re_new_password,

            })
            .then((response) => {
              console.log(response)
                navigate("/log_in/") // should go to a webiste that says password reset succesful and ask you to log in
                //or maybe even log you out if you are logged in
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
                                    <Label>New Password:</Label>
                                    <Input
                                        name="new_password"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirm New Password:</Label>
                                    <Input
                                        name="re_new_password"
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
