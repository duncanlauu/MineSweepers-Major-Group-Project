import React, {useState, useEffect} from "react"
import axiosInstance from '../../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";
import { UserNameContainer, UserNameText } from "../UserProfileElements";
import { useNavigate } from "react-router";

export default function SingleFriendRequest(props) {

    const [friendRequest, setSingleFriendRequest] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        setSingleFriendRequest(props.friendRequest)
    }, []);

    const rejectFriendRequest = (sender, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: {
                    other_user_id: sender,
                    action: "reject"
                }
            })
            .then(() => {
                props.updatePageAfterRequestHandling()
            })
    }

    const acceptFriendRequest = (sender, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: {
                    other_user_id: sender,
                    action: "accept"
                }
            })
            .then(() => {
                props.updatePageAfterRequestHandling()
            })
    }

    const navigateToProfile = () => {
        navigate(`/friends_page/${friendRequest.sender}/`)
        window.location.reload()
    }

    return (
        <div className="friendRequest" key={friendRequest.sender} style={{marginBottom: "1rem", marginTop: "1rem"}}>
            <Row style={{height: "5rem"}}>
                <Col xs="2">
                    <Gravatar email={friendRequest.sender__email} size={50} onClick={navigateToProfile} style={{ 
                            borderRadius: "50px",
                            marginBottom: "1rem"
                        }} 
                    />
                </Col>
                <Col xs="5" style={{height: "5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <UserNameContainer onClick={navigateToProfile}>
                        <UserNameText>
                            {friendRequest.sender__username} 
                        </UserNameText>
                    </UserNameContainer>
                </Col>
                <Col xs="5" style={{display: "flex", justifyContent: "flex-end"}}>
                    <Row>
                        <Col>
                            <Button onClick={(e) => acceptFriendRequest(friendRequest.sender)}
                                style={{borderRadius: "20px", height: "3rem", marginRight: "1rem", backgroundColor: "green", marginTop: "1rem"}} 
                            >
                                <p> Accept </p>
                            </Button>
                            <Button onClick={(e) => rejectFriendRequest(friendRequest.sender)}
                                style={{borderRadius: "20px", height: "3rem", backgroundColor: "red", marginTop: "1rem"}} 
                            >
                                <p> Reject </p>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}