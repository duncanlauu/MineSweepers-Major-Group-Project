import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";
import {Link} from 'react-router-dom'
import { SuggestedUserLine, SuggestedUserText, SuggestedUserNameContainer } from "../UserProfileElements";
import { useNavigate } from "react-router";

export default function SingleSuggestedUser(props) {

    const [currentSuggestedUser, setCurrentSuggestedUser] = useState("")
    const [suggestedUserName, setSuggestedUserName] = useState("");
    const [suggestedUserEmail, setSuggestedUserEmail] = useState("");

    const navigate = useNavigate()


    useEffect(() => {
        setCurrentSuggestedUser(props.suggestedUser)
        setSuggestedUserName(props.suggestedUser.username)
        setSuggestedUserEmail(props.suggestedUser.email)
    }, []);

    const navigateToProfile = () => {
        navigate(`/user_profile/${currentSuggestedUser.id}/`)
        window.location.reload()
    }

    return (
        <div className="friend" key={currentSuggestedUser.id} style={{marginBottom: "1rem", marginTop: "1rem"}}>
                <SuggestedUserLine>
                    <Row style={{height: "4rem"}}>
                        <Col xs="2">
                            <Gravatar email={suggestedUserEmail} size={40} onClick={navigateToProfile} style={{ 
                                borderRadius: "50px",
                                marginBottom: "1rem"}} 
                            />
                        </Col>
                        <Col xs="9" style={{height: "4rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <SuggestedUserNameContainer onClick={navigateToProfile}>
                                <SuggestedUserText>
                                    {suggestedUserName} 
                                </SuggestedUserText>
                            </SuggestedUserNameContainer>
                        </Col>
                    </Row>
                </SuggestedUserLine>
        </div>
    )
}