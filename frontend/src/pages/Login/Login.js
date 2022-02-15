import React from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button } from 'reactstrap'
import { HeadingText, LoginContainer, ParaText, Form, VisibilityToggle } from './LoginElements'
import { FaExternalLinkAlt } from 'react-icons/fa'

const Login = () => {
  return (
    <div>
        <Container fluid>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Sign into your account</HeadingText><br />
                        <ParaText>If you haven't created one yet, you can do so here <FaExternalLinkAlt style={{ height: "15px", color: "#0057FF" }} /> .</ParaText>
                        <LoginContainer>
                            <Form>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input style={{ border: "0", backgroundColor: "#F3F3F3" }} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input style={{ border: "0", backgroundColor: "#F3F3F3" }}>
                                        {/* Add visibility toggle function */}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={{size: 10, offset: 4}}>
                                        <Button style={{ backgroundColor: "#653FFD", width: "7rem" }}>Sign In</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </LoginContainer>
                    </Col>
                    <Col />
                </Row>
        </Container>
    </div>
  )
}

export default Login
