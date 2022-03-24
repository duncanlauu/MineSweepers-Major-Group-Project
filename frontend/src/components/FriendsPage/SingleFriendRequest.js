import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";

export default function SingleFriendRequest(props) {

    const [friendRequest, setSingleFriendRequest] = useState("");

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

    return (
        <div className="friendRequest" key={friendRequest.sender}>
            <Row>
                <Col xs="2">
                    <Gravatar email='user@example.com' size={20} style={{ 
                            borderRadius: "50px",
                            marginTop: "1rem",
                            marginBottom: "1rem"
                        }} 
                    />
                </Col>
                <Col>
                    <h3 className="friend_id"> {friendRequest.sender__username} </h3>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <Button onClick={(e) => acceptFriendRequest(friendRequest.sender)}>
                                <p> Accept </p>
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={(e) => rejectFriendRequest(friendRequest.sender)}>
                                <p> Reject </p>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}