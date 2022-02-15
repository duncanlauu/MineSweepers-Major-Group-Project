import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { LogoText, RoundedButton, WelcomeText } from './LandingPageElements'

const LandingPage = () => {
  return (
    <div>
        <Container fluid>
                <Row style={{ marginTop: "10rem" }}>
                    <Col />
                    <Col>
                        <WelcomeText>Welcome to</WelcomeText><br />
                        <LogoText>bookgle</LogoText><br />
                        <RoundedButton>LOG IN</RoundedButton><br />
                        <RoundedButton>SIGN UP</RoundedButton>
                    </Col>
                </Row>
        </Container>
    </div>
  )
}

export default LandingPage