import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';

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
                            <ClubProfileTabs />
                        </ProfileHeader>
                    </ProfileContainer>
                </Col>
                <Col />
            </Row>
        </Container>
    </div>
  )
}

export default ClubProfile