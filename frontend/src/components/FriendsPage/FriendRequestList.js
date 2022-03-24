import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
import { Button, UncontrolledCollapse } from "reactstrap";
import SingleFriendRequest from "./SingleFriendRequest";
import { FriendLine } from "./UserProfileElements";

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
                        <Button color="danger" id="friendRequestToggler" style={{marginBottom: "1rem", borderRadius: "50px"}}>
                            You have new friend requests: <b>{myFriendRequests.length}</b>
                        </Button>
                    </div>
                    <UncontrolledCollapse toggler="#friendRequestToggler">
                        {myFriendRequests.map((friendRequest, index) => {
                            console.log(friendRequest);
                            return (
                                <FriendLine>
                                    <div className="friendRequest" key={friendRequest.sender} style={{height: "5rem"}}>
                                        <SingleFriendRequest friendRequest={friendRequest} updatePageAfterRequestHandling={updatePageAfterRequestHandling}/>
                                    </div>
                                </FriendLine>
                            )
                        })}
                        <hr style={{height: "3px"}}/>
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