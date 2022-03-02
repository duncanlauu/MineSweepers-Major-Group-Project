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

    const displayFriendRequests = (props) => {
        if (myFriendRequests.length > 0) {
            return (
                myFriendRequests.map((friendRequest, index) => {
                    console.log(friendRequest);
                    return (
                        <div className="friendRequest" key={friendRequest.id}>
                            <Row>
                                <Col>
                                    <p> test </p>
                                </Col>
                                <Col>
                                    <Button>
                                        <p> test </p>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend requests yet. </h3>)

        }
    }
    return (
        <>
            {displayFriendRequests(props)}
        </>
    )

}