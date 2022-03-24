import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";
import { FriendLine } from "./UserProfileElements";

export default function SingleFriend(props) {

    const [currentFriend, setCurrentFriend] = useState("")

    useEffect(() => {
        setCurrentFriend(props.friend)
    }, []);


    const deleteFriend = (id, e) => {
        axiosInstance
            .delete(`friends/${id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterDeletion()
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="friend" key={currentFriend.id} style={{marginBottom: "1rem"}}>
            <FriendLine>
                <Row>
                    <Col xs="2">
                        <Gravatar email='user@example.com' size={50} style={{ 
                                borderRadius: "50px",
                                marginBottom: "1rem"
                            }} 
                        />
                    </Col>
                    <Col xs="8" style={{display: "flex", justifyContent: "center"}}>
                        <div style={{height: "5rem"}}>
                            <h3 className="friend_username"> {currentFriend.username} </h3>
                        </div>
                    </Col>
                    <Col xs="2" style={{display: 'flex', justifyContent: "flex-end"}}>
                        <Button style={{borderRadius: "20px", height: "5rem"}} name={currentFriend.id} onClick={(e) => deleteFriend(currentFriend.id, e)}>
                            X
                        </Button>
                    </Col>
                </Row>
            </FriendLine>

        </div>
    )
}