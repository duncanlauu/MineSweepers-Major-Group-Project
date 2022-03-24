import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input } from "reactstrap"
import SinglePostComment from "./SinglePostComment";

export default function PostCommentList(props){

    const [currentPost, setCurrentPost] = useState([]);
    const [commentsUnderPost, setCommentsUnderPost] = useState([]);
    const [writtenComment, updateWrittenComment] = useState("dummy")
    
    
    useEffect(() => {
        setCurrentPost(props.post)
        getCommentsUnderPost()
    }, []);

    const getCommentsUnderPost = () => {
        console.log(props.post.id)
        axiosInstance
            .get(`posts/${props.post.id}/comments/`)
            .then((res) => {
                console.log(res.data.comments)
                const allCommentsUnderPost = res.data.comments;
                setCommentsUnderPost(allCommentsUnderPost);
            })
    }

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        })
    }

    const uploadComment = (e, index) => {
        console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${currentPost.id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                console.log(res.data)
                getCommentsUnderPost()

            })
    }

    const updatePageAfterCommentDeletion = (e) => {
        getCommentsUnderPost()
    }

    const displayCommentsUnderPost = (e) => {
        if (commentsUnderPost.length > 0) {
            console.log(commentsUnderPost);
            return (
                <div>
                    {commentsUnderPost.map((comment, index) => {
                        console.log(comment);
                        return (
                            <div key={comment.id}> 
                                <SinglePostComment currentPost={currentPost} comment={comment} 
                                    updatePageAfterCommentDeletion={updatePageAfterCommentDeletion}
                                />
                            </div>
                        )
                    })}
                    <Row>
                        <Col xs="9">
                            <Input type="textarea" rows="1"
                                id="myComment"
                                name="myComment"
                                onChange={handleCommentChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            /> 
                        </Col>
                        <Col xs="3">
                            <Button  onClick={(e) => uploadComment(e, 0)}>
                                <p> Send </p>
                            </Button> 
                        </Col>
                    </Row>
                </div>
            )
        } else {
            return (
                <div>
                    <h5> You don't have any comments yet. </h5>
                    <Row>
                        <Col xs="9">
                            <Input type="textarea" rows="1"
                                id="myComment"
                                name="myComment"
                                onChange={handleCommentChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            /> 
                        </Col>
                        <Col xs="3">
                            <Button onClick={(e) => uploadComment(e, 0)}>
                                <p> Send </p>
                            </Button> 
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )

}
