import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
import { Button, UncontrolledCollapse } from "reactstrap";
import SingleFriendRequest from "./SingleFriendRequest";

export default function FriendRequestList(props) {

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

    function updatePageAfterRequestHandling() {
        getAllFriendRequests()
    }

    const displayFriendRequests = (e) => {
        if (myFriendRequests.length > 0) {
            return (
                <div> 
                    <div style={{display: 'flex', justifyContent: "flex-end"}}>
                        <Button color="primary" id="friendRequestToggler" style={{marginBottom: "1rem"}}>
                            You have new friend requests: {myFriendRequests.length}
                        </Button>
                    </div>
                    <UncontrolledCollapse toggler="#friendRequestToggler">
                        {myFriendRequests.map((friendRequest, index) => {
                            console.log(friendRequest);
                            return (
                                <div className="friendRequest" key={friendRequest.sender}>
                                    <SingleFriendRequest friendRequest={friendRequest} updatePageAfterRequestHandling={updatePageAfterRequestHandling}/>
                                </div>
                            )
                        })}
                    </UncontrolledCollapse>
                </div>
            )
        } else {
            return (<></>)
        }
    }
    return (
        <>
            {displayFriendRequests(props)}
        </>
    )
}