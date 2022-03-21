import React from 'react'
import {Link} from 'react-router-dom'
import {Container, Row, Col} from 'reactstrap'
import {LogoText, RoundedButton, WelcomeText} from './LandingPageElements'

const LandingPage = () => {
    return (
        <div>
            <Container fluid>
                <Row style={{marginTop: "10rem"}}>
                    <Col/>
                    <Col>
                        <WelcomeText>Welcome to</WelcomeText><br/>
                        <LogoText>bookgle</LogoText><br/>
                        <Link to="/log_in">
                            <RoundedButton>LOG IN</RoundedButton><br/>
                        </Link>
                        <Link to="/sign_up">
                            <RoundedButton>SIGN UP</RoundedButton>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LandingPage
