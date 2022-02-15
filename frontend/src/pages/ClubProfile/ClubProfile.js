import React from 'react'
import { Container, Row, Col, Button, Badge } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Gravatar from 'react-gravatar';

function ProfileBody() {
    return (
        <Container fluid style={{ margin: "1rem" }}>
            <Row>
                <Col>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Col>
                <Col>
                    <Gravatar email='blah@blah.com' size={170} style={{borderRadius:"100px", marginLeft: "1rem"}} />
                </Col>
            </Row>
            <Row>
                <Button style={{ width: "7rem", 
                                 margin: "1rem", 
                                 fontFamily: "Source Sans Pro", 
                                 borderRadius: "100px", 
                                 backgroundColor: "#653FFD", 
                                 border: "0px"  }}>Apply</Button>
                <hr style={{width:"34rem", opacity:"0.2"}}></hr>
            </Row>
            <Row>
                <h3 style={{ fontFamily:"Source Sans Pro", marginTop:"2rem", fontWeight:"600" }}>Reading History</h3>
            </Row>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin:"1rem"}}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{fontFamily:"Source Sans Pro",marginTop:"1rem", lineHeight: "10px", fontWeight:"600"}}>To Kill a Mockingbird</h4>
                        <span style={{fontFamily:"Source Sans Pro",fontWeight:"600",opacity:"0.7"}}>Harper Lee</span><br />
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
                    </Col>
                </BookProfile>
            </Row>
        </Container>
    );
}

function ClubMembers() {
    return (
        <>
        <Container fluid style={{ margin: "1rem" }}>
            <Row>
                <h3 style={{ fontFamily:"Source Sans Pro", marginTop:"2rem", fontWeight:"600" }}>Members</h3>
            </Row>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin:"1rem"}}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{fontFamily:"Source Sans Pro",marginTop:"1rem", lineHeight: "10px", fontWeight:"600"}}>Jimothy Halpert</h4>
                        <Badge style={{ backgroundColor: "#653FFD" }} pill>Owner</Badge><br />
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
                    </Col> 
                </BookProfile>
            </Row>
        </Container>
        <Container fluid style={{ margin: "1rem" }}>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin:"1rem"}}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{fontFamily:"Source Sans Pro",marginTop:"1rem", lineHeight: "10px", fontWeight:"600"}}>Pamela Beesly</h4>
                        <Badge style={{ backgroundColor: "#653FFD" }} pill>Admin</Badge><br />
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
                    </Col> 
                </BookProfile>
            </Row>
        </Container>
        <Container fluid style={{ margin: "1rem" }}>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin:"1rem"}}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{fontFamily:"Source Sans Pro",marginTop:"1rem", lineHeight: "10px", fontWeight:"600"}}>Kevin Malone</h4>
                        <Badge style={{ backgroundColor: "#653FFD" }} pill>Member</Badge><br />
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
                    </Col> 
                </BookProfile>
            </Row>
        </Container>
        <hr />
        <Container fluid style={{ margin: "1rem" }}>
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={80} style={{margin:"1rem"}}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        <h4 style={{fontFamily:"Source Sans Pro",marginTop:"1rem", lineHeight: "10px", fontWeight:"600"}}>Dwight Schrute</h4>
                        <Badge style={{ backgroundColor: "#653FFD" }} pill>Reading List</Badge>
                        <Badge style={{ backgroundColor: "#653FFD", marginLeft:"1rem" }} pill>Accept</Badge>
                        <br />
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...</span>
                    </Col> 
                </BookProfile>
            </Row>
        </Container>
        </>
    );
}

const ClubProfile = () => {
  return (
    <div>
        <Container fluid>
            <Row style={{ marginTop: "2rem"}}>
                <Col />
                <Col xs={6}>
                    <ProfileContainer>
                        <ProfileHeader>
                            Lorem Ipsum
                        </ProfileHeader>
                        <ProfileBody />
                    </ProfileContainer>
                </Col>
                <Col />
            </Row>
        </Container>
    </div>
  )
}

export default ClubProfile