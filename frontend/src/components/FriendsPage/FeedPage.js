// import React, { useState, useEffect } from "react"
// import axiosInstance from '../../axios'
// import { Row, Col, Button, Input, FormGroup, Label } from "reactstrap"

// import { useNavigate } from "react-router";
// import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";

// export default function PersonalPosts(props) {
//     console.log(props)
    
//     const [myFeedPosts, setFeedPosts] = useState("");
//     const [commentsUnderPost, setCommentsUnderPost] = useState("")

//     const [writtenComment, updateWrittenComment] = useState("dummy")
//     const navigate = useNavigate();

//     useEffect(() => {
//         getFeedPosts()
//     }, []);

//     const handleCommentChange = (e) => {
//         updateWrittenComment({
//           writtenComment, 
//           [e.target.name]: e.target.value, 
//         })
//       }

//     const getFeedPosts = () => {
//         axiosInstance
//             .get("feed/")
//             .then((res) => {
//                 const allFeedPosts = res.data;
//                 setFeedPosts(allFeedPosts)
//                 navigate("/log_in/")
//             })
//             .catch(error => console.error(error));
//     }

//     const getPost = (post_id, e) => {
//         axiosInstance
//             .get(`posts/${post_id}`)
//             .then((res) => {
//                 //navigate("/log_in/")
//                 console.log(res.data.post)
//                 //console.log(writtenComment)
//             })
//             .catch(error => console.error(error));
//     }

//     const deletePost = (post_id, e) => {
//         axiosInstance
//             .delete(`posts/${post_id}`)
//             .then((res) => {
//                 //navigate("/log_in/")
//                 console.log(res)
//                 //console.log(writtenComment)
//             })
//             .catch(error => console.error(error));
//     }

//     const getCommentsUnderPost = (post_id) => {
//         axiosInstance
//             .get(`posts/${post_id}/comments/`)
//             .then((res) => {
//                 console.log(res.data.comments)
//                 const allCommentsUnderPost = res.data.comments;
//                 setCommentsUnderPost(allCommentsUnderPost)
//             })
//     }

//     const uploadComment = (post_id, e) => {
//         console.log(writtenComment.myComment)
//         axiosInstance
//             .post(`posts/${post_id}/comments/`, {
//                 content: writtenComment.myComment,
//             })
//             .then((res) => {
//                 console.log(res.data)
//                 // navigate("/home/")
//                 // navigate("/friends_page/")
//             })
//     } 

    
//     const displayFeedPosts = (e) => {
//         if (myFeedPosts.length > 0) {
//             console.log(myFeedPosts);
//             return (
//                 myFeedPosts.map((feedPost, index) => {
//                     console.log(feedPost);
//                     return (
//                         <div className="personalPost" key={feedPost.id}> 
//                             <SinglePostContainer>
//                                 <Row>
//                                     <Col>
//                                         <PostTitle>
//                                             <h2> {feedPost.title} </h2>
//                                         </PostTitle>
//                                     </Col>
//                                 </Row>
                                        
//                                 <PostContent>
//                                     <h4> {feedPost.content} </h4>
//                                 </PostContent>

//                                 <div>                                       
//                                     <h5> Comment section </h5>
//                                     <p> ... </p>
//                                     {/* <PostComments personalPost={personalPost}/> */}
//                                 </div>
                        
//                                 <Row>
                                     
//                                         <Input type="textarea" rows="1"
//                                             id="myComment"
//                                             name="myComment"
//                                             onChange={handleCommentChange}
//                                             style={{ border: "0", backgroundColor: "#F3F3F3" }}
//                                         />
                                    
//                                 </Row>
//                                 <Row>
//                                     <Col xs="6">
//                                         <Row>
//                                             <Button onClick={(e) => uploadComment(personalPost.id, e)}>
//                                                 <p> Send </p>
//                                             </Button>
//                                         </Row>
                                        
//                                     </Col>
//                                     <Col xs="3">
//                                         <Button onClick={(e) => getCommentsUnderPost(personalPost.id, e)}>
//                                             <p> Show </p>
//                                         </Button>
//                                     </Col>

//                                 </Row>
                                      
//                                 <Row>
//                                     <Button onClick={(e) => getPost(personalPost.id)}>
//                                         <p> Get Info </p>
//                                     </Button>
//                                 </Row>
//                             </SinglePostContainer>
//                         </div>
//                     )
//                 })
//             )
//         } else {
//             return (<h5> You don't have any posts yet. </h5>)

//         }
//     }
//     return (
//         <>
//             {displayFeedPosts(props)}
//         </>
//     )

// }


import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, FormGroup, Label } from "reactstrap"

import { useNavigate } from "react-router";
import { PostContent, PostTitle, SinglePostContainer } from "./FriendsPageElements";
import PostComments from "./PostComments";

export default function FeedPage(props) {
    console.log(props)

    //const [myPersonalPosts, setPersonalPosts] = useState("");
    const [myFeedPosts, setFeedPosts] = useState("");
    const [commentsUnderPost, setCommentsUnderPost] = useState("")

    const [writtenComment, updateWrittenComment] = useState("dummy")
    const navigate = useNavigate();

    useEffect(() => {
        getFeedPosts()
    }, []);

    // should be moved to feed
    const getFeedPosts = () => {
        axiosInstance
            .get("feed/")
            .then((res) => {
                console.log("feed:")
                console.log(res.data)
                const allFeedPosts = res.data.posts;
                setFeedPosts(allFeedPosts)
                // const allFeedPosts = res.data;
                // setFeedPosts(allFeedPosts)
                //navigate("/log_in/")
            })
            .catch(error => console.error(error));
    }

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        })
    }

    const getPost = (post_id, e) => {
        axiosInstance
            .get(`posts/${post_id}`)
            .then((res) => {
                //navigate("/log_in/")
                console.log(res.data.post)
                //console.log(writtenComment)
            })
            .catch(error => console.error(error));
    }

    // const deletePost = (post_id, e) => {
    //     axiosInstance
    //         .delete(`posts/${post_id}`)
    //         .then((res) => {
    //             //navigate("/log_in/")
    //             console.log(res)
    //             removeFromPage(e)
    //             //console.log(writtenComment)
    //         })
    //         .catch(error => console.error(error));
    // }

    // const removeFromPage = (e) => {
    //     const id = parseInt(e.target.getAttribute("name"))
    //     setFeedPosts(myFeedPosts.filter(item => item.id !== id));
    // }

    const getCommentsUnderPost = (post_id) => {
        axiosInstance
            .get(`posts/${post_id}/comments/`)
            .then((res) => {
                console.log(res.data)
                const allCommentsUnderPost = res.data.comments;
                setCommentsUnderPost(allCommentsUnderPost)
            })
    }

    const commentsRef = useRef([]);

    const uploadComment = (post_id, e, index) => {
        console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${post_id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                console.log(res.data)
                const comment = { author: localStorage.username, content: writtenComment.myComment }
                console.log(commentsRef.current[index])
                commentsRef.current[index].addComment(comment)
                console.log("adding post in parent: ", comment)
                // navigate("/home/")
                // navigate("/friends_page/")
                // call setCommentsUnderPost in PostComments
            })
    }

    
    const displayFeedPosts = (e) => {
        if (myFeedPosts.length > 0) {
            console.log(myFeedPosts);
            return (
                myFeedPosts.map((feedPost, index) => {
                    console.log(feedPost);
                    return (
                        <div className="feedPost" key={feedPost.id}>
                            <SinglePostContainer>
                                <Row>
                                    <Col>
                                        <PostTitle>
                                            <h2> {feedPost.title} </h2>
                                        </PostTitle>
                                    </Col>
                                    {/* <Col>
                                        <Button name={feedPost.id} onClick={(e) => deletePost(feedPost.id, e)}>
                                            X
                                        </Button>
                                    </Col> */}
                                </Row>

                                <PostContent>
                                    <h4> {feedPost.content} </h4>
                                </PostContent>

                                <div>
                                    <h5> Comment section </h5>
                                    {/* <PostComments ref={commentsRef} personalPost={feedPost} /> */}
                                    <PostComments ref={el => commentsRef.current[index] = el}  personalPost={feedPost} />
                                </div>

                                <Row>

                                    <Input type="textarea" rows="1"
                                        id="myComment"
                                        name="myComment"
                                        onChange={handleCommentChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />

                                </Row>
                                <Row>
                                    <Col xs="6">
                                        <Row>
                                            <Button onClick={(e) => uploadComment(feedPost.id, e, index)}>
                                                <p> Send </p>
                                            </Button>
                                        </Row>

                                    </Col>
                                    <Col xs="3">
                                        <Button onClick={(e) => getCommentsUnderPost(feedPost.id, e)}>
                                            <p> Show </p>
                                        </Button>
                                    </Col>

                                    {/* Feed test */}
                                    {/* <Col xs="3">
                                        <Button onClick={(e) => getFeedPosts(feedPost.id, e)}>
                                            <p> Feed </p>
                                        </Button>
                                    </Col> */}

                                </Row>

                                <Row>
                                    <Button onClick={(e) => getPost(feedPost.id)}>
                                        <p> Get Info </p>
                                    </Button>
                                </Row>
                            </SinglePostContainer>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any posts yet. </h5>)

        }
    }
    return (
        <>
            {displayFeedPosts(props)}
        </>
    )

}


