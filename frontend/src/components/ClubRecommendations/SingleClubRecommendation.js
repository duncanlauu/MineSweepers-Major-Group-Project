import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Col, Row } from "reactstrap";
import Gravatar from "react-gravatar";
import { ClubAttributeContainer, ClubProfile, ParaText } from "./RecommenderPageElements";

export default function SingleClubRecommendation(props) {
    const [ownerEmail, setOwnerEmail] = useState("")

    useEffect(() => {
        console.log("here")
        console.log(props.club)
        getUserEmail(props.club.owner)
    }, [])

    const getUserEmail = (user_id) => {
        axiosInstance
            .get(`user/get_update/${user_id}/`)
            .then((res) => {
                setOwnerEmail(res.data.email)
            })
            .catch(error => console.error(error))
    }

    return (
        <ClubProfile>
            <Row>
                <Col xs="2">
                    <Gravatar email={ownerEmail} data-testid="gravatar" />
                </Col>
                <Col xs="7" style={{ height: "5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ClubAttributeContainer>
                        <a href={`/club_profile/${props.club.id}`} style={{color: "#653FFD"}}>
                            {props.club.name}
                        </a>
                    </ClubAttributeContainer>
                </Col>
                <Col xs="3" style={{ height: "5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ClubAttributeContainer>
                        <ParaText>
                            Members: {props.club.members.length}
                        </ParaText>
                    </ClubAttributeContainer>
                </Col>
            </Row>
        </ClubProfile>
    )
}