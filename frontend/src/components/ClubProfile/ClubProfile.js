import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';
import Gravatar from 'react-gravatar';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';

export default function ClubProfile() {
        
    const { club_id } = useParams(); // Gets the id provided in the URL
    console.log("Club ID: " + club_id);
    const [club, setClub] = React.useState(null);

    React.useEffect(() => {
        axiosInstance.get(`clubs/${club_id}`).then(
            res => {
                console.log(res);
                setClub(res.data);
            }
        );
    }, []);

    if (!club) return null;
    
        return(
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
                                    {club.name}
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
