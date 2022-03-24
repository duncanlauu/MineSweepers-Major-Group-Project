import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input } from "reactstrap"
import SingleCommentReply from "./SingleCommentReply";

export default function CommentReplyList(props){

    const [currentPost, setCurrentPost] = useState([]);
    const [currentComment, setCurrentComment] = useState([]);
    const [repliesUnderComment, setRepliesUnderComment] = useState([]);
    const [writtenReply, updateWrittenReply] = useState("dummy")

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setCurrentComment(props.currentComment)
        getRepliesUnderComments()
    }, []);

    const getRepliesUnderComments = () => {
        axiosInstance
            .get(`posts/${props.currentPost.id}/comments/${props.currentComment.id}/replies/`)
            .then((res) => {
                console.log("Sick replies:::")
                console.log(res.data.replies)
                const allRepliesUnderComment = res.data.replies;
                setRepliesUnderComment(allRepliesUnderComment);
            })
    }

    const handleReplyChange = (e) => {
        updateWrittenReply({
            writtenReply,
            [e.target.name]: e.target.value,
        })
        console.log(writtenReply)
    }

    const uploadReply = (e, index) => {
        console.log(writtenReply.myReply)
        console.log(currentPost.id)
        console.log(currentComment.id)
        axiosInstance
            .post(`posts/${currentPost.id}/comments/${currentComment.id}/replies/`, {
                content: writtenReply.myReply,
            })
            .then((res) => {
                console.log(res.data)
                getRepliesUnderComments()
            })
    }

    const updatePageAfterReplyDeletion = (e) => {
        getRepliesUnderComments()
    }

    const displayCommentsUnderPost = (e) => {
        if (repliesUnderComment.length > 0) {
            console.log(repliesUnderComment);
            return (
                <div>
                    <Row>
                        <Col xs="8">
                            <Input type="textarea" rows="1"
                                id="myReply"
                                name="myReply"
                                onChange={handleReplyChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            /> 
                        </Col>
                        <Col xs="4">
                            <Button onClick={(e) => uploadReply(e, 0)}>
                                <p> Send </p>
                            </Button> 
                        </Col>
                    </Row>

                    {repliesUnderComment.map((reply, index) => {
                        console.log(reply);
                        return (
                            <div key={reply.id}> 
                                <SingleCommentReply currentPost={currentPost} currentComment={currentComment} 
                                    reply={reply} updatePageAfterReplyDeletion={updatePageAfterReplyDeletion}
                                />
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return(
                <div>
                    <Row>
                        <Col xs="8">
                            <Input type="textarea" rows="1"
                                id="myReply"
                                name="myReply"
                                onChange={handleReplyChange}
                                style={{ border: "0", backgroundColor: "#F3F3F3" }}
                            /> 
                        </Col>
                        <Col xs="4">
                            <Button onClick={(e) => uploadReply(e, 0)}>
                                <p> Send </p>
                            </Button> 
                        </Col>
                    </Row>
                    <h5> You don't have any replies yet. </h5>
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