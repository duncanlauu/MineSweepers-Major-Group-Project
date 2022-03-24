import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
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
                myFriendRequests.map((friendRequest, index) => {
                    console.log(friendRequest);
                    return (
                        <div className="friendRequest" key={friendRequest.sender}>
                            <SingleFriendRequest friendRequest={friendRequest} updatePageAfterRequestHandling={updatePageAfterRequestHandling}/>
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