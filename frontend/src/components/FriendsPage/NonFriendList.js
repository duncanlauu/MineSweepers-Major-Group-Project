import React, { useEffect, useState } from "react"
import { Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";

export default function NonFriendList(props) {

    const [myNonFriends, setNonFriends] = useState("")

    const navigate = useNavigate();
    
    useEffect(() => {
        getAllNonFriends();
    }, []);

    const getAllNonFriends = () => {
        axiosInstance
            .get(`friends/`)
            .then((res) => {
                const allNonFriends = res.data.non_friends;
                setNonFriends(allNonFriends)
            })
            .catch(error => console.error(error));
    }

    const postFriendRequest = (receiver, e) => {
        axiosInstance
            .post("friend_requests/", {
                data: { 
                    other_user_id : receiver  
                }
            })
            .then((res) => {
                navigate("/log_in/") // Test purpose
            })
    }

    // not used at this point.
    const cancelFriendRequest = (receiver, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: { 
                    other_user_id : receiver,  
                    action : "cancel"
                }
            })
    }

    const displayNonFriends = (e) => {
        if (myNonFriends.length > 0) {
            return (
                myNonFriends.map((nonFriend, index) => {
                    console.log(nonFriend);
                    return (
                        <div className="friend" key={nonFriend.id} >
                            <Row>
                                <Col>
                                    <h3 className="friend_username"> {nonFriend.username} </h3>
                                    <p className="friend_email"> {nonFriend.email} </p>
                                </Col>
                                <Col>
                                    <Button onClick={(e) => postFriendRequest(nonFriend.id)}>
                                        <p> Follow: {nonFriend.id} </p> 
                                    </Button>                                       
                                </Col>
                                <Col>
                                    <Button onClick={(e) => cancelFriendRequest(nonFriend.id)}>
                                        <p> Cancel request: {nonFriend.id} </p> 
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend connections yet. </h3>)

        }
    }

    return (
        <>
            {displayNonFriends(props)}
        </>
    )

}