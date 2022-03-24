// import React, { useEffect, useState } from "react"
// import { Row, Col, Button } from "reactstrap"
// import axiosInstance from '../../axios'
// import { useNavigate } from "react-router";
// import useGetUser from "../../helpers";

// export default function RecommendedFriendList(props) {

//     const [myRecommendedFriends, setRecommendedFriends] = useState("")

//     const navigate = useNavigate();

//     useEffect(() => {
//         getRecommendedFriends(props);
//     }, []);

//     const getRecommendedFriends = (props) => {
//         console.log("Buenos");
//         console.log(props.currentUser);
//         axiosInstance
//             .get(`recommender/10/${props.currentUser.id}/top_n_users_random_books/`)
//             .then((res) => {
//                 console.log("Buenos")
//                 // const allNonFriends = res.data.non_friends;
//                 // setNonFriends(allNonFriends)
//             })
//             .catch(error => console.error(error));
//     }

//     const postFriendRequest = (receiver, e) => {
//         axiosInstance
//             .post("friend_requests/", {
//                 other_user_id : receiver  
//             })
//     }

//     // not used at this point.
//     const cancelFriendRequest = (receiver, e) => {
//         axiosInstance
//             .delete("friend_requests/", {
//                 data: { 
//                     other_user_id : receiver,  
//                     action : "cancel"
//                 }
//             })
//     }

//     const displayRecommendedFriends = (e) => {
//         if (myRecommendedFriends.length > 0) {
//             return (
//                 myRecommendedFriends.map((nonFriend, index) => {
//                     console.log(recommendedFriend);
//                     return (
//                         <div className="friend" key={recommendedFriend.id} >
//                             <Row>
//                                 <Col>
//                                     <h3 className="friend_username"> {recommendedFriend.username} </h3>
//                                 </Col>
//                             </Row>
//                         </div>
//                     )
//                 })
//             )
//         } else {
//             return (<h3> No suggested users. </h3>)
//         }
//     }

//     return (
//         <>
//             {displayRecommendedFriends(props)}
//         </>
//     )

// }