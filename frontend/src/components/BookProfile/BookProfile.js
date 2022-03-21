import React from 'react'
import { useParams } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import Nav from '../Nav/Nav';
import { ProfileContainer } from '../ClubProfile/ClubProfileElements';
import { ProfileHeader } from '../ClubProfile/ClubProfileElements';
import Gravatar from 'react-gravatar';

function BookProfile() {

    const { book_id } = useParams();
    console.log("Book ID: " + book_id);

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
                        <Row>
                        <Col xs={4} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Gravatar email='blah@blah.com' />
                        </Col>
                        <Col xs={8}>
                            <ProfileHeader>
                                Book Name
                            </ProfileHeader>
                        </Col>
                        </Row>
                    </ProfileContainer>
                </Col>
                <Col />
            </Row>
        </Container>
    </div>
  )
}

export default BookProfile