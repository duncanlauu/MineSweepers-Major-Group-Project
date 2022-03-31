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
        getSuggestedUserName(props.suggestedUser.id)
        getSuggestedUserEmail(props.suggestedUser.id)
    }, []);


    const getSuggestedUserName = (suggestedUser_id) => {
        axiosInstance.get(`user/get_update/${suggestedUser_id}/`)
        .then((res) => {
            setSuggestedUserName(res.data.username)
        })
        .catch(error => console.error(error));
    }

    const getSuggestedUserEmail = (suggestedUser_id) => {
        axiosInstance.get(`user/get_update/${suggestedUser_id}/`)
        .then((res) => {
            setSuggestedUserEmail(res.data.email)
        })
        .catch(error => console.error(error));
    }

    const postFriendRequest = (receiver, e) => {
        axiosInstance
            .post("friend_requests/", {
                other_user_id: receiver
            })
    }

    // not used at this point.
    const cancelFriendRequest = (receiver, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: {
                    other_user_id: receiver,
                    action: "cancel"
                }
            })
    }

    const navigateToProfile = () => {
        navigate(`/friends_page/${currentSuggestedUser.id}/`)
        window.location.reload()
    }

    return (
        <div className="friend" key={currentSuggestedUser.id} style={{marginBottom: "1rem", marginTop: "1rem"}}>
            {/* <h1> {currentSuggestedUser.id} </h1> */}
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
                            
                            {/* <h5 className="friend_username"> {suggestedUserName} </h5> */}
                        </Col>
                        {/* <Col xs="4" style={{display: 'flex', justifyContent: "flex-end"}}>
                            <Button color="primary" onClick={(e) => postFriendRequest(currentSuggestedUser.id)}
                                style={{height: "4rem", width: "6rem"}}
                            >
                                <p> Follow </p>
                            </Button>
                            <Button onClick={(e) => cancelFriendRequest(currentSuggestedUser.id)}
                                style={{height: "4rem", width: "1rem", borderTopRightRadius: "20px", borderBottomRightRadius: "20px"}} 
                            >
                                <p> X </p>
                            </Button>
                        </Col> */}
                    </Row>
                </SuggestedUserLine>
        </div>
    )
}