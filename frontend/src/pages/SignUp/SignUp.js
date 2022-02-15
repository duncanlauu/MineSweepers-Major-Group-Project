import React, {Component} from "react";
import { Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand } from 'reactstrap'
import { SignUpContainer, FormLayout } from "./SignUpStyle";

export default class SignUpPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="ParentDiv">

        <Row>
          <Navbar color="light" expand="md" light>
            <NavbarBrand href="/">
              <h1> bookgle </h1>
            </NavbarBrand>
          </Navbar>
       </Row>


        <Container> 
        <Row style={{ marginTop: "6rem" }}>
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
                  <Input id="firstNameSU" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="lastNameSU"> Last Name </Label>
                  <Input id="lastNameSU" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="usernameSU"> User Name </Label>
              <Input id="usernameSU" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
            </FormGroup>

            <FormGroup>
              <Label for="emailSU"> Email </Label>
              <Input type="email" id="emailSU" style={{ border: "0", backgroundColor: "#F3F3F3" }}/>
            </FormGroup>

            <FormGroup>
              <Label for="passwordSU"> Password </Label>
              <Input type="password" id="passwordSU" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
            </FormGroup>

            <FormGroup>
              <Label for="bioSU"> Bio </Label>
              <Input id="bioSU" style={{ border: "0", backgroundColor: "#F3F3F3" }} />
            </FormGroup>

            <Row>
              <Col xs="8">
                <FormGroup>
                  <Label for="locationSU"> Location </Label>
                  <Input id="locationSU" style={{ border: "0", backgroundColor: "#F3F3F3" }}/>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup>
                  <Label for="ageSU"> Age </Label>
                  <Input id="ageSU" style={{ border: "0", backgroundColor: "#F3F3F3" }}/>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Col sm={{size: 10, offset: 5}}>
                <Button style={{ backgroundColor: "#653FFD", width: "7rem" }}>Sign In</Button>
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
}
