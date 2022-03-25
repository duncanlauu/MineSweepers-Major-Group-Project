import React, {useEffect, useState} from "react"
import axiosInstance from '../../axios'
import SingleFriend from "./SingleFriend";


export default function FriendsList(props){

    const [myFriends, setFriends] = useState("")

    useEffect(() => {
        getAllFriends()
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

    function updatePageAfterDeletion() {
        getAllFriends()
    }

    const displayFriends = (e) => {
        if (myFriends.length > 0) {
            console.log(myFriends)
            return (
                myFriends.map((friend, index) => {
                    return (
                        <div className="friend" key={friend.id}>

                            <div key={friend.id}>
                                <SingleFriend friend={friend} updatePageAfterDeletion={updatePageAfterDeletion}/>
                            </div>

                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any friend connections yet. </h5>)
        }
    }

    return (
        <>
            {displayFriends(props)}
        </>
    )

}