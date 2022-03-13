import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap';
import Gravatar from 'react-gravatar';
import { BookProfile } from './ClubProfileElements';
import axiosInstance from '../../axios';
// import useGetUser from '../../helpers';
import { useParams } from 'react-router-dom';

export default class LandingProfile extends React.Component {
    constructor(props) {
        super(props);
        this.toggleClass = this.toggleClass.bind(this);
        this.state = {
            applied: false
        };
    }

    ApplyToClub = (id, e) => {
        // currentUser = useGetUser(); --> Returns not defined
        // console.log("Current user: " + currentUser)
        const action = 'apply'
        const user_id = 1
        axiosInstance.put(
            `singleclub/${id}/${action}/${user_id}`, {
                data: {
                    action: 'apply',
                    id: 1,
                    user_id: 1
                }
            }
        )
        
    }

    toggleClass() {
        const currentState = this.state.applied
        this.setState({
            applied: !currentState
        });
    }
    
    render() {
        const applyStyle = {
            width: "7rem",
            margin: "1rem",
            fontFamily: "Source Sans Pro",
            borderRadius: "100px",
            backgroundColor: "#653FFD",
            border: "0px"
        }

        const appliedStyle = {
            width: "7rem",
            margin: "1rem",
            fontFamily: "Source Sans Pro",
            borderRadius: "100px",
            backgroundColor: "#fff",
            border: "2px solid #653DDF",
            color: "#653FFD"
        }

        let buttonState = this.state.applied ? "Applied" : "Apply"

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
                    <Button onClick={this.ApplyToClub} style={applyStyle}>{buttonState}</Button>
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
}
