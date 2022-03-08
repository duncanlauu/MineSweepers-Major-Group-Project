import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';
import { useParams } from 'react-router';
import axiosInstance from '../../axios';
import axios from 'axios';

export default class ClubProfile extends React.Component {
    constructor() {
        super();

        this.state = {
            club: []
        }
    }

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users/1`)
        .then(
            response => {
                console.log(response)
                this.setState({
                    club: response.data
                });
            }
        )
    }

    render() {
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
                                    {this.state.club.map(
                                        club => {club.name}
                                    )}
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
}