import axios from "axios";
import React, { useState, useEffect } from "react"
import { Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

export default function FriendRequests(props) {
    console.log(props)
    const [myFriendRequests, setFriendRequests] = useState("");

    useEffect(() => {
        getAllFriendRequests()
    }, []);

    const getAllFriendRequests = () => {
        axiosInstance
            .get(`friend_requests/`)
            .then((res) => {
                const allFriendRequests = res.data.incoming;
                setFriendRequests(allFriendRequests)
            })
            .catch(error => console.error(error));
    }

    const rejectFriendRequest = (sender, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: { 
                    other_user_id : sender, 
                    action : "reject"
                }
            })
    }

    const acceptFriendRequest = (sender, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: { 
                    other_user_id : sender, 
                    action : "accept"
                }
            })
    }
    
    const displayFriendRequests = (e) => {
        if (myFriendRequests.length > 0) {
            return (
                myFriendRequests.map((friendRequest, index) => {
                    console.log(friendRequest);
                    return (
                        <div className="friendRequest" key={friendRequest.sender}>
                            <Row>
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
                })
            )
        } else {
            return (<h5> You don't have any friend requests yet. </h5>)

        }
    }
    return (
        <>
            {displayFriendRequests(props)}
        </>
    )

}