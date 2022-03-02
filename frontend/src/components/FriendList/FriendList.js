import React, { useEffect, useState } from "react"
import { Row, Col, Button } from "reactstrap"

import axiosInstance from '../../axios'

export default function FriendList(props) {

    const [myFriends, setFriends] = useState("")

    useEffect(() => {
        getAllFriends();
    }, []);

    const getAllFriends = () => {
        axiosInstance
            .get(`friends/`)
            .then((res) => {
                const allFriends = res.data.friends;
                setFriends(allFriends)
            })
            .catch(error => console.error(error));
    }

    const deleteFriend = (id, e) => {
        axiosInstance
            .delete(`friend/${id}`)
            .then((res) => {
                console.log(res)
                removeFromPage(e) // remove friend with id from myFriends state
            })
            .catch(error => console.error(error));
    }

    const removeFromPage = (e) => {
        const id = parseInt(e.target.getAttribute("name"))
        setFriends(myFriends.filter(item => item.id !== id));
    }

    const displayFriends = (e) => {
        if (myFriends.length > 0) {
            return (
                myFriends.map((friend, index) => {
                    console.log(friend);
                    return (
                        <div className="friend" key={friend.id} >
                            <Row>
                                <Col>
                                    <h3 className="friend_username"> {friend.username} </h3>
                                    <p className="friend_email"> {friend.email} </p>
                                </Col>
                                <Col>
                                    <Button name={friend.id} onClick={(e) => deleteFriend(friend.id, e)}>
                                        {friend.id}
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
            {displayFriends(props)}
        </>
    )

}