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
        return (
            <UsersList usersList={myNonFriends} emptyMessage="You don't have any friend connections yet."></UsersList>
        )
    }

    return (
        <>
            {displayNonFriends(props)}
        </>
    )

}