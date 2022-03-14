// import React, { useState, useEffect } from "react"
// import axiosInstance from '../../axios'
// import { Row, Col } from "reactstrap"
// import { useNavigate } from "react-router";

// export default function PostComments(props) {

//     const navigate = useNavigate();
//     const [commentsUnderPost, setCommentsUnderPost] = useState("");

//     useEffect(() => {
//         getCommentsForPost()
//     }, []);
    
//     const getCommentsForPost = (post_id) => {
//         axiosInstance
//             .get("posts/${post_id}/comments")
//             .then((res) => {
//                 navigate("/log_in/")
//                 const allCommentsUnderPost = res.data;
//                 setCommentsUnderPost(allCommentsUnderPost);
//             })
//     }

//     const displayCommentsUnderPost = () => {
//         if (commentsUnderPost.length > 0) {
//             console.log(commentsUnderPost);
//             return (
//                 commentsUnderPost.map((personalPost, index) => {
//                     console.log(personalPost);
//                     return (
//                         <div className="personalPost" key={personalPost.created_at}> 
//                                 <Row>
//                                     <Col>
//                                             <h2> {personalPost.title} </h2>
                                        
//                                             <h4> {personalPost.content} </h4>  
//                                     </Col>
//                                 </Row>
//                         </div>
//                     )
//                 })
//             )
//         }
//     }
    
// }

