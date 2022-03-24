import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";

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
        <div className="friend" key={currentFriend.id}>
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
                    <h3 className="friend_username"> {currentFriend.username} </h3>
                    <p className="friend_email"> {currentFriend.email} </p>
                </Col>
                <Col>
                    <Button name={currentFriend.id} onClick={(e) => deleteFriend(currentFriend.id, e)}>
                        {currentFriend.id}
                    </Button>
                </Col>
            </Row>
        </div>
    )
}