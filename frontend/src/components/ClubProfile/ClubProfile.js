import React from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import {BookProfile, ProfileContainer, ProfileHeader} from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';
import Gravatar from 'react-gravatar';

function ProfileBody() {
    return (
        <Container fluid style={{margin: "1rem"}}>
            <Row>
                <Col/>
                <Col>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Col>
                <Col>
                    <Gravatar email='blah@blah.com' size={170} style={{borderRadius: "100px", marginLeft: "1rem"}}/>
                </Col>
            </Row>
            <Row>
                <Button style={{
                    width: "7rem",
                    margin: "1rem",
                    fontFamily: "Source Sans Pro",
                    borderRadius: "100px",
                    backgroundColor: "#653FFD",
                    border: "0px"
                }}>Apply</Button>
                <hr style={{width: "34rem", opacity: "0.2"}}/>
            </Row>
            <Row>
                <h3 style={{fontFamily: "Source Sans Pro", marginTop: "2rem", fontWeight: "600"}}>Reading History</h3>
            </Row>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin: "1rem"}}/>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{
                            fontFamily: "Source Sans Pro",
                            marginTop: "1rem",
                            lineHeight: "10px",
                            fontWeight: "600"
                        }}>To Kill a Mockingbird</h4>
                        <span
                            style={{fontFamily: "Source Sans Pro", fontWeight: "600", opacity: "0.7"}}>Harper Lee</span><br/>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
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
                <Row style={{marginBottom: "3rem"}}>
                    <Nav/>
                </Row>
                <Row>
                    <Col/>
                    <Col xs={6}>
                        <ProfileContainer>
                            <ProfileHeader>
                                Lorem Ipsum
                                <ClubProfileTabs/>
                            </ProfileHeader>
                        </ProfileContainer>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        </div>
    )
}

export default ClubProfile