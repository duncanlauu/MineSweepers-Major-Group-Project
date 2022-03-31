import React, {useState} from 'react'
import {Col, Container, FormGroup, Input, Label, Row, Button, Navbar, NavbarBrand} from 'reactstrap'
import {HeadingText, LoginContainer, ParaText} from './PasswordResetConfirmElements'
import {FaExternalLinkAlt} from 'react-icons/fa'

import axiosInstance from '../../axios'
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import Nav from '../Nav/Nav'

// https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
export default function SignIn() {
    let params = useParams()

    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        new_password: '',
        re_new_password: ''
    });

    const [newPasswordErr, setNewPasswordErr] = useState('')
    const [ReNewPasswordErr, setReNewPasswordErr] = useState('')

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
            .catch((e) => {
                console.log(e.response.data)
                setNewPasswordErr(e.response.data.new_password)
                setReNewPasswordErr(e.response.data.re_new_password)
                if (e.response.data.non_field_errors) setReNewPasswordErr(e.response.data.non_field_errors)
            })
    }

    return (
        <div style={{ overflow:"hidden" }}>
            <Row>
                <Nav isAuthenticated={false} />
            </Row>
            <Container fluid>
                <Row style={{marginTop: "6rem"}}>
                    <Col/>
                    <Col>
                        <HeadingText>Password Reset</HeadingText><br/>
                        <LoginContainer>
                            <form style={{ width:"80%" }}>
                                <FormGroup>
                                    <Label><ParaText>New Password</ParaText></Label>
                                    <Input
                                        name="new_password"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3", fontFamily:"Source Sans Pro"}}
                                    />
                                </FormGroup>
                                <div>{newPasswordErr}</div>
                                <FormGroup>
                                    <Label><ParaText>Confirm New Password</ParaText></Label>
                                    <Input
                                        name="re_new_password"
                                        onChange={handleChange}
                                        style={{border: "0", backgroundColor: "#F3F3F3", fontFamily:"Source Sans Pro"}}
                                    />
                                </FormGroup>
                                <div>{ReNewPasswordErr}</div>
                                <FormGroup>
                                    <Col sm={{size: 10, offset: 4}}>
                                        <Button 
                                            type="submit" 
                                            onClick={handleSubmit}
                                            style={{backgroundColor: "#653FFD", marginTop:"1rem"}}>
                                                Reset
                                        </Button>
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
