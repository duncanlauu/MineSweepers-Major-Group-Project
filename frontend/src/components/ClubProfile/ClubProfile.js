import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import { BookProfile, ProfileContainer, ProfileHeader } from './ClubProfileElements';
import Nav from '../Nav/Nav';
import ClubProfileTabs from './ClubProfileTabs.js';
import Gravatar from 'react-gravatar';
import axiosInstance from '../../axios';

export default class ClubProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            club_id: this.props.club_id,
            name: this.props.name,
            description: this.props.description
        }
    }

    getClubDetails = (club_id) => {
        console.log(club_id)
        axiosInstance.get(`singleclub/`+club_id, {
            headers: {
                "content-type": "application/json"
            }
        }).then(res => {
            console.log(res);
            this.setState({
                name: res.data.results[0].name,
                description: res.data.results[0].description
            })
        })
    }

    componentDidMount() {
        this.getClubDetails(this.state.club_id);
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
                                    {this.state.name}
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