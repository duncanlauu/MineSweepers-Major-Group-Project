import React, {useEffect, useState} from "react";
import axiosInstance from "../../axios";
import {Col} from "reactstrap";
import Gravatar from "react-gravatar";
import {ClubProfile} from "./RecommenderPageElements";

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
            <Col xs={3}>
                <Gravatar email={ownerEmail} data-testid="gravatar"/>
            </Col>
            <Col xs={9}>
                <a href={`/club_profile/${props.club.id}`}>
                    {props.club.name}
                </a>
            </Col>
        </ClubProfile>
    )
}