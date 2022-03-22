import React, { useEffect, useState } from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import {BookProfile, ProfileContainer, ProfileHeader} from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';
import Gravatar from 'react-gravatar';
import { useParams } from 'react-router';
import axiosInstance from '../../axios';

const ClubProfile = () => {

    const { club_id } = useParams();
    console.log("Club ID: " + club_id);
    const [club, setClub] = useState(null);

    useEffect(() => {
        axiosInstance
            .get(`singleclub/${club_id}`)
            .then(res => {
                console.log(res);
                setClub(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    if (!club) return null;

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
                                {club.name}
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