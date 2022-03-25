import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar";

export default function SingleSuggestedUser(props) {

    const [currentSuggestedUser, setCurrentSuggestedUser] = useState("")
    const [suggestedUserName, setSuggestedUserName] = useState("");
    const [suggestedUserEmail, setSuggestedUserEmail] = useState("");


    useEffect(() => {
        setCurrentSuggestedUser(props.suggestedUser)
        getSuggestedUserName(props.suggestedUser.id)
        getSuggestedUserEmail(props.suggestedUser.id)
    }, []);


    const getSuggestedUserName = (suggestedUser_id) => {
        axiosInstance.get(`user/get_update/${suggestedUser_id}/`)
        .then((res) => {
            console.log("The post creator is: " + res.data.username)
            setSuggestedUserName(res.data.username)
        })
        .catch(error => console.error(error));
    }

    const getSuggestedUserEmail = (suggestedUser_id) => {
        axiosInstance.get(`user/get_update/${suggestedUser_id}/`)
        .then((res) => {
            console.log("The post creator is: " + res.data.email)
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

    return (
        <div className="friend" key={currentSuggestedUser.id}>
            <Row>
                <Col xs="2">
                    <Gravatar email={suggestedUserEmail} size={20} style={{ 
                        borderRadius: "50px",
                        marginTop: "1rem",
                        marginBottom: "1rem"}} 
                    />
                 </Col>
                <Col xs="6">
                    <h5 className="friend_username"> {suggestedUserName} </h5>
                </Col>
                <Col xs="4">
                    <Button style={{width: "3rem"}} onClick={(e) => postFriendRequest(currentSuggestedUser.id)}>
                        <p> ::</p>
                    </Button>
                    <Button style={{width: "2rem"}} onClick={(e) => cancelFriendRequest(currentSuggestedUser.id)}>
                        <p> X </p>
                    </Button>
                </Col>
            </Row>
        </div>
    )
}