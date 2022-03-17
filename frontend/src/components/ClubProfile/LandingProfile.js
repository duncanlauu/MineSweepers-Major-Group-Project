import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import Gravatar from 'react-gravatar';
import { BookProfile } from './ClubProfileElements';

const LandingProfile = () => {
    return (
        <Container fluid>
            <Row style={{ display:"flex" }}>
                <Col xs={8}>
                <span style={{ fontFamily:"Source Sans Pro", fontSize:"15px" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                </Col>
                <Col>
                    <Gravatar email='blah@blah.com' size={100} />
                </Col>
            </Row>
            <Row>
                <Button style={{ width: "7rem", 
                                 margin: "1rem", 
                                 fontFamily: "Source Sans Pro", 
                                 borderRadius: "100px", 
                                 backgroundColor: "#653FFD", 
                                 border: "0px"  }}>Apply</Button>
            </Row>
            <Row>
                <h3 style={{ fontFamily:"Source Sans Pro", marginTop:"2rem", fontWeight:"600" }}>Reading History</h3>
            </Row>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={70}></Gravatar>
                    </Col>
                    <Col xs={8}>
                    </Col>
                </BookProfile>
            </Row>
        </Container>
    );
}

export default LandingProfile