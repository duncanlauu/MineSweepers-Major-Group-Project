import React, {Component} from "react";
import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap'
import { SignUpContainer, FormLayout } from "./SignUpStyle";

export default class SignUpPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="ParentDiv">
        <Container fluid> 
        <Row>
        <Col />
        <Col>
          <h1> Sign into your account </h1>
          <p> If you haven't created one yet, you can do so "here" </p>   
    
          <SignUpContainer>
          <FormLayout>

            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label for="firstNameSU"> First Name </Label>
                  <Input type="textarea" name="" id="firstNameSU" />
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="lastNameSU"> Last Name </Label>
                  <Input type="textarea" name="" id="lastNameSU" />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="usernameSU"> User Name </Label>
              <Input type="textarea" name="" id="usernameSU" />
            </FormGroup>

            <FormGroup>
              <Label for="emailSU"> Email </Label>
              <Input type="email" name="" id="emailSU" />
            </FormGroup>

            <FormGroup>
              <Label for="passwordSU"> Password </Label>
              <Input type="password" name="" id="passwordSU" />
            </FormGroup>

            <FormGroup>
              <Label for="bioSU"> Bio </Label>
              <Input type="textarea" name="" id="bioSU" />
            </FormGroup>

            <Row>
              <Col xs="8">
                <FormGroup>
                  <Label for="locationSU"> Location </Label>
                  <Input type="textarea" name="" id="locationSU" />
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label for="ageSU"> Age </Label>
                  <Input type="textarea" name="" id="ageSU" />
                </FormGroup>
              </Col>
            </Row>

            <Button> Sign Up </Button>
                                   
          </FormLayout>
          </SignUpContainer>

          </Col>
          <Col />
        </Row>
        </Container>
      </div>
    );
  }
}
