import React, { useEffect, useState } from "react"
import { Row, Col, Button } from "reactstrap"
import axiosInstance from '../../axios'

import { useNavigate } from "react-router";
import useGetUser from "../../helpers";

export default function NonFriendList(props) {

    const [myNonFriends, setNonFriends] = useState("")

    const navigate = useNavigate();
    const user = useGetUser();
    
    useEffect(() => {
        //getRecommendedFriends();
        getAllNonFriends();
    }, [user]);

    const getAllNonFriends = () => {
        console.log(user.id)
        axiosInstance
            .get(`recommender/10/9/top_n_users_random_books/`)
            .then((res) => {
                console.log("Buenos dias")
                console.log(res.data)
                const allNonFriends = res.data;
                setNonFriends(allNonFriends)
            })
            .catch(error => console.error(error));
    }

    // const getRecommendedFriends = () => {
    //     axiosInstance
    //         .get(`recommender/10/${user.id}/top_n_users_random_books/`)
    //         .then((res) => {
    //             console.log("Buenos")
    //             // const allNonFriends = res.data.non_friends;
    //             // setNonFriends(allNonFriends)
    //         })
    //         .catch(error => console.error(error));
    // }

    const postFriendRequest = (receiver, e) => {
        axiosInstance
            .post("friend_requests/", {
                other_user_id : receiver  
            })
    }

    // not used at this point.
    const cancelFriendRequest = (receiver, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: { 
                    other_user_id : receiver,  
                    action : "cancel"
                }
            })
    }

    // display recommended friends
    const displayNonFriends = (e) => {
        if (myNonFriends.length > 0) {
            return (
                myNonFriends.map((nonFriend, index) => {
                    console.log(nonFriend);
                    return (
                        <div className="friend" key={nonFriend.id} >
                            <Row>
                                <Col>
                                    <h3 className="friend_username"> {nonFriend.recommended_user} </h3>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend suggestions yet. </h3>)

        }
    }

    // const displayNonFriends = (e) => {
    //     if (myNonFriends.length > 0) {
    //         return (
    //             myNonFriends.map((nonFriend, index) => {
    //                 console.log(nonFriend);
    //                 return (
    //                     <div className="friend" key={nonFriend.id} >
    //                         <Row>
    //                             <Col>
    //                                 <h3 className="friend_username"> {nonFriend.username} </h3>
    //                             </Col>
    //                             <Col>
    //                                 <Button onClick={(e) => postFriendRequest(nonFriend.id)}>
    //                                     <p> Follow </p>
    //                                 </Button>
    //                                 <Button onClick={(e) => cancelFriendRequest(nonFriend.id)}>
    //                                     <p> X </p>
    //                                 </Button>
    //                             </Col>
    //                         </Row>
    //                     </div>
    //                 )
    //             })
    //         )
    //     } else {
    //         return (<h3> You don't have any friend connections yet. </h3>)
    //
    //     }
    // }

    return (
        <>
            {displayNonFriends(props)}
        </>
    )

}