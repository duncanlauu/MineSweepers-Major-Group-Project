import React from 'react'
import {Link} from 'react-router-dom'
import {Container, Row, Col, Button} from 'reactstrap'
import {BlueCircle, ButtonContainer, LoginText, LogoText, PurpleCircle, UnderLineText, WelcomeText} from './LandingPageElements'
import Nav from '../Nav/Nav'

const LandingPage = () => {
    return (
        <div 
            style={{ overflow: "hidden" }}>
            <Container fluid style={{ padding:"0px" }}>
                <Row style={{ marginBottom: "8rem" }}>
                    <Nav isAuthenticated={false}/>
                </Row>
                <Row>
                    <Col xs={2}>
                    </Col>
                    <Col xs={8}>
                        <LogoText>
                            Find people who<br />
                            <span style={{ fontWeight: 600 }}>vibe</span> with your<br />
                            bookshelf.
                            <UnderLineText />
                        </LogoText><br /><br />
                        <WelcomeText>
                            Welcome to Bookgle, a social media app<br />
                            where the bookworms of our society converge.
                        </WelcomeText>
                        <ButtonContainer>
                        <Link to="/sign_up/">
                            <Button
                                style={{
                                    backgroundColor: "#653FFD",
                                    borderRadius: "10px",
                                    padding: "0.75rem 2rem 0.75rem 2rem",
                                    fontFamily: "Source Sans Pro",
                                    color: "#fff",
                                    fontSize: "20px",
                                    marginBottom:"1rem"
                                }}>
                                Sign Up Today
                            </Button>
                        </Link>
                        <Link to="/log_in/">
                            <LoginText>Or log into an existing account.</LoginText>
                        </Link>
                        </ButtonContainer>
                    </Col>
                    <Col xs={2}>
                        <BlueCircle />
                        <PurpleCircle />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LandingPage
