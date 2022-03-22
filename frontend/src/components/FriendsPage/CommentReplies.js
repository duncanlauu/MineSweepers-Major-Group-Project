// import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react"
// import axiosInstance from '../../axios'
// import { Row, Col, Button } from "reactstrap"
// import { Navigate } from "react-router"
// import { useNavigate } from "react-router" 
// import useGetUser from "../../helpers"

// const CommentReplies = (props) => {

//     const [repliesUnderComment, setRepliesUnderComment] = useState([]);
//     const navigate = useNavigate();
//     const currentUser = useGetUser();

//     useEffect(() => {
//         getRepliesUnderComments()
//     }, []);

//     const getRepliesUnderComments = () => {
//         console.log("PostID!: " , props.postID)
//         console.log("CommentID!: " , props.commentID)
//         axiosInstance
//             .get(`posts/${props.postID}/comments/${props.commentID}/replies/`)
//             .then((res) => {
//                 // navigate("/log_in/")
//                 console.log(res.data)
//                 const allRepliesUnderComment = res.data;
//                 setRepliesUnderComment(allRepliesUnderComment);
//             })
//     }

//     const displayRepliesUnderComment = (e) => {
//         if (repliesUnderComment.length > 0) {
//             console.log(repliesUnderComment);
//             return (
//                 repliesUnderComment.map((singleReply, index) => {
//                     console.log(singleReply);
//                     return (
//                         <div className="singleComment" key={singleReply.id}>
//                             <Row>
//                                 <Col>
//                                 <Row>
//                                     <Col xs="3">
//                                         <h4> ReplyAuthor </h4>
//                                     </Col>
//                                     <Col xs="9">
//                                         <h4> ReplayMessage </h4>
//                                     </Col>
//                                 </Row>
                                   
//                                 </Col>
//                                 {/* {singleComment.author_id == currentUser.id  &&
//                                      <Col>
//                                         <Button name={singleComment.id} onClick={(e) => deleteComment(singleComment.id, e)}>
//                                             <p> x </p>
//                                         </Button>
//                                     </Col>
//                                 }
//                                  */}
//                             </Row>
//                         </div>
//                     )
//                 })
//             )
//         } 
//     }

//     return (
//         <>
//             {displayRepliesUnderComment()}
//         </>
//     )

// }

// export default CommentReplies

