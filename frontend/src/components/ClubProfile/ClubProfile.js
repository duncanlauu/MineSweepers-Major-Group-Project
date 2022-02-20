import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Gravatar from 'react-gravatar';
import Nav from '../Navbar/Nav';

function ProfileBody() {
    return (
        <Container fluid style={{ margin: "2rem" }}>
            <Row style={{ display:"flex" }}>
                <Col>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
                        <Gravatar email='blah@blah.com' size={80} style={{ marginTop:"1rem" }}></Gravatar>
                    </Col>
                    <Col xs={8}>
                    </Col>
                </BookProfile>
            </Row>
        </Container>
    );
}

const ClubProfile = () => {
  return (
    <div>
        <Container fluid>
            <Row style={{ marginBottom:"3rem" }}>
                <Nav />
            </Row>
            <Row>
                <Col />
                <Col xs={6}>
                    <ProfileContainer>
                        <ProfileHeader>
                            Lorem Ipsum
                        </ProfileHeader>
                        <ProfileBody></ProfileBody>
                    </ProfileContainer>
                </Col>
                <Col />
            </Row>
        </Container>
    </div>
  )
}

export default ClubProfile