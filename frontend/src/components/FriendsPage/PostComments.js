import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button } from "reactstrap"
import { Navigate } from "react-router"
import { useNavigate } from "react-router" 

// export default function PostComments(props) {

//     const navigate = useNavigate();
//     const [commentsUnderPost, setCommentsUnderPost] = useState([]);

//     useEffect(() => {
//         getCommentsUnderPost()
//     }, []);

//     useEffect(() => {
//         displayCommentsUnderPost()
//     }, [commentsUnderPost])

//     const getCommentsUnderPost = () => {
//         console.log(props.personalPost.id)
//         axiosInstance
//             .get(`posts/${props.personalPost.id}/comments/`)
//             .then((res) => {
//                 console.log(res.data)
//                 const allCommentsUnderPost = res.data;
//                 setCommentsUnderPost(allCommentsUnderPost.comments);
//             })
//     }

//     const displayCommentsUnderPost = (e) => {
//         if (commentsUnderPost.length > 0) {
//             console.log(commentsUnderPost);
//             return (
//                 commentsUnderPost.map((singleComment, index) => {
//                     console.log(singleComment);
//                     return (
//                         <div className="singleComment" key={singleComment.id}>
//                             <Row>
//                                 <Col>
//                                     <h2> {singleComment.author} </h2>

//                                     <h4> {singleComment.content} </h4>
//                                 </Col>
//                             </Row>
//                         </div>
//                     )
//                 })
//             )
//         } else {
//             return (<h5> You don't have any comments yet. </h5>)
//         }
//     }

//     return (
//         <>
//             {displayCommentsUnderPost()}
//         </>
//     )

// }

const PostComments = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        addComment(comment) {
            setCommentsUnderPost([...commentsUnderPost, comment])
            console.log("after: ", commentsUnderPost.length)
            // console.log("adding post in child: ", post)
        }
    }))

    const [commentsUnderPost, setCommentsUnderPost] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCommentsUnderPost()
    }, []);

    // useEffect(() => {
    //     displayCommentsUnderPost()
    // }, [commentsUnderPost])

    const getCommentsUnderPost = () => {
        console.log(props.personalPost.id)
        axiosInstance
            .get(`posts/${props.personalPost.id}/comments/`)
            .then((res) => {
                console.log(res.data)
                const allCommentsUnderPost = res.data;
                setCommentsUnderPost(allCommentsUnderPost.comments);
            })
    }

    const deleteComment = (comment_id, e) => {
        axiosInstance
            .delete(`posts/${props.personalPost.id}/comments/${comment_id}`)
            .then((res) => {
                console.log(res)
                removeCommentFromPage(e) // remove friend with id from myFriends state
            })
            .catch(error => console.error(error));
    }

    const removeCommentFromPage = (e) => {
        const id = parseInt(e.target.getAttribute("name"))
        setCommentsUnderPost(commentsUnderPost.filter(item => item.id !== id));
    }

    const displayCommentsUnderPost = (e) => {
        if (commentsUnderPost.length > 0) {
            console.log(commentsUnderPost);
            return (
                commentsUnderPost.map((singleComment, index) => {
                    console.log(singleComment);
                    console.log("hheheheh: ", singleComment.author_id)
                    return (
                        <div className="singleComment" key={singleComment.id}>
                            <Row>
                                <Col>
                                <Row>
                                    <Col xs="3">
                                        <h4> {singleComment.author_id} </h4>
                                    </Col>
                                    <Col xs="9">
                                        <h4> {singleComment.content} </h4>
                                    </Col>
                                </Row>
                                   
                                </Col>
                                <Col>
                                    <Button name={singleComment.id} onClick={(e) => deleteComment(singleComment.id, e)}>
                                        X {singleComment.id}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h5> You don't have any comments yet. </h5>)
        }
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )

}
)

export default PostComments

