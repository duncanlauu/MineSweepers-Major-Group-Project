import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios";
import SingleFriend from "./SingleFriend";

export default function FriendsList(props) {
    const [myFriends, setFriends] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (props.requestedUser_id === undefined) {
            getAllFriends();
        } else {
            getAllFriendsOfOtherUser();
        }
    }, []);

    const getAllFriends = () => {
        axiosInstance
            .get(`friends/`)
            .then((res) => {
                const allFriends = res.data.friends;
                setFriends(allFriends);
            })
            .catch((error) => console.error(error));
    };

    const getAllFriendsOfOtherUser = () => {
        axiosInstance
            .get(`friends/user/${props.requestedUser_id}`)
            .then((res) => {
                const allFriends = res.data.friends;
                setFriends(allFriends);
            })
            .catch((error) => console.error(error));
    };

    function updatePageAfterDeletion() {
        getAllFriends();
    }

    const displayFriends = (e) => {
        if (myFriends.length > 0) {
            return myFriends.map((friend, index) => {
                return (
                    <div className="friend" key={friend.id}>
                        <div key={friend.id}>
                            <SingleFriend
                                friend={friend}
                                updatePageAfterDeletion={updatePageAfterDeletion}
                                requestedUser_id={props.requestedUser_id}
                            />
                        </div>
                    </div>
                );
            });
        } else {
            if (props.requestedUser_id === undefined) {
                return <h5> You don't have any friend connections yet. </h5>;
            } else {
                return <h5> This user has no friend connections yet. </h5>;
            }
        }
    };

    return <>{displayFriends(props)}</>;
}
