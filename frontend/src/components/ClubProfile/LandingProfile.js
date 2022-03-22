import React, {useState} from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import Gravatar from 'react-gravatar';
import {BookProfile} from './ClubProfileElements';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import useGetUser from '../../helpers';
import {useNavigate} from "react-router";

const LandingProfile = () => {

    const navigate = useNavigate()

    const { club_id } = useParams();
    console.log("Club ID: " + club_id);

    const currentUser = useGetUser();
    const user_id = currentUser.id
    console.log("User ID: " + user_id);

    const [applied, setApplied] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    const applyStyle = {
        width: "17rem",
        margin: "1rem",
        fontFamily: "Source Sans Pro",
        borderRadius: "5px",
        backgroundColor: "#653FFD",
        border: "2px solid #653DDF",
    }

    const appliedStyle = {
        width: "17rem",
        margin: "1rem",
        fontFamily: "Source Sans Pro",
        borderRadius: "5px",
        backgroundColor: "#fff",
        border: "2px solid #653DDF",
        color: "#653FFD"
    }

    let buttonState = applied ? "Applied" : "Apply"

    function applyToClub(id, user_id, e) {
        const action = 'apply'
        axiosInstance
            .put(`singleclub/${id}/${action}/${user_id}`, {})
            .then(res => {
                console.log(res);
                setApplied(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <Container fluid>
            <Row style={{display: "flex"}}>
                <Col xs={8}>
                <span style={{fontFamily: "Source Sans Pro", fontSize: "15px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                </Col>
                <Col>
                    <Gravatar email='blah@blah.com' size={100}/>
                </Col>
            </Row>
            <Row>
                <Button
                    onClick={(e) => applyToClub(club_id, user_id)}
                    style={applied ? appliedStyle : applyStyle}>
                        {buttonState}
                    </Button>
            </Row>
            <Row>
                <h3 style={{fontFamily: "Source Sans Pro", marginTop: "2rem", fontWeight: "600"}}>Reading History</h3>
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

export default LandingProfile