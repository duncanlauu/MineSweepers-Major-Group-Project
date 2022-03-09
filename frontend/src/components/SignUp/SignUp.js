import React, { Component, useState } from "react";
import { Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand } from 'reactstrap'
import { SignUpContainer, FormLayout } from "./SignUpStyle";

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";


export default function SignUp() {

  const navigate = useNavigate();

  const initialFormData = Object.freeze({ // After the user has typed in their data, it can no longer be changed. (.freeze)
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    birthday: '',
    // liked_books: [],
    // read_books: [],
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
        // liked_books: [],
        // read_books: [],
      })
      .then((res) => {
        navigate("/log_in/") // pushes the user to the login page. Add some error checking.
        console.log(res)
        console.log(res.data)
      })
  }

  // Todo: move styles to a CSS file?
  return (
    <div id="ParentDiv">

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
            <h1> Sign up for your account </h1>
            <p> If you already have one, log in "here" </p>

            <SignUpContainer>
              <FormLayout> {/*  might have to add more info here */}
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="first_name"> First Name </Label>
                      <Input
                        id="first_name"
                        name="first_name" // name to target from JS
                        onChange={handleChange}
                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="last_name"> Last Name </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        onChange={handleChange}
                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="username"> User Name </Label>
                  <Input
                    id="username"
                    name="username"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email"> Email </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="password"> Password </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="bio"> Bio </Label>
                  <Input
                    id="bio"
                    name="bio"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                <Row>
                  <Col xs="8">
                    <FormGroup>
                      <Label for="location"> Location </Label>
                      <Input
                        id="location"
                        name="location"
                        onChange={handleChange}
                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label for="birthday"> Birthday </Label>
                      <Input
                        id="birthday"
                        type="date"
                        name="birthday"
                        onChange={handleChange}
                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Col sm={{ size: 10, offset: 5 }}>
                    <Button
                      type="submit"
                      className="submit"
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#653FFD", width: "7rem" }}
                    >
                      Sign Up
                    </Button>
                  </Col>
                </FormGroup>

              </FormLayout>
            </SignUpContainer>

          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}