import React, {useEffect, useState} from "react"
import {Row, Col, Button} from "reactstrap"
import axiosInstance from '../../axios'
import Gravatar from "react-gravatar";
import {useNavigate} from "react-router";

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

    const displayNonFriends = (e) => {
        if (myNonFriends.length > 0) {
            return (
                myNonFriends.map((nonFriend, index) => {
                    console.log(nonFriend);
                    return (
                        <div className="friend" key={nonFriend.id}>
                            <Row>
                                <Col xs="2">
                                    <Gravatar email={nonFriend.email} size={20} style={{ 
                                                borderRadius: "50px",
                                                marginTop: "1rem",
                                                marginBottom: "1rem"
                                            }} 
                                        />
                                </Col>
                                <Col xs="6">
                                    <h5 className="friend_username"> {nonFriend.username} </h5>
                                </Col>
                                <Col xs="4">
                                    <Button style={{width: "3rem"}} onClick={(e) => postFriendRequest(nonFriend.id)}>
                                        <p> ::</p>
                                    </Button>
                                    <Button style={{width: "2rem"}} onClick={(e) => cancelFriendRequest(nonFriend.id)}>
                                        <p> X </p>
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