import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input } from "reactstrap"
import SinglePostComment from "./SinglePostComment";
import { CommentLine, CommentSectionContainer } from "../UserProfile/UserProfileElements";

export default function PostCommentList(props){

    const [currentPost, setCurrentPost] = useState([]);
    const [commentsUnderPost, setCommentsUnderPost] = useState([]);
    const [writtenComment, updateWrittenComment] = useState("dummy")


    useEffect(() => {
        setCurrentPost(props.post)
        getCommentsUnderPost()
    }, []);

    const getCommentsUnderPost = () => {
        axiosInstance
            .get(`posts/${props.post.id}/comments/`)
            .then((res) => {
                const allCommentsUnderPost = res.data.comments;
                setCommentsUnderPost(allCommentsUnderPost);
            })
    }

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        })
        console.log(writtenComment)
    }

    const uploadComment = (e, index) => {
        // console.log(writtenComment.myComment)
        axiosInstance
            .post(`posts/${currentPost.id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then((res) => {
                // console.log(res.data)
                getCommentsUnderPost()

            })
    }

    const updatePageAfterCommentDeletion = (e) => {
        getCommentsUnderPost()
    }

    const inputAreaID = "myComment" + currentPost.id;

    const clearInputField = () => {
        document.getElementById(inputAreaID).value = ''
    }

    const displayCommentsUnderPost = (e) => {
        if (commentsUnderPost.length > 0) {
            // console.log(commentsUnderPost);
            return (
                <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <CommentSectionContainer>
                            {commentsUnderPost.map((comment, index) => {
                                // console.log(comment);
                                return (
                                    <div key={comment.id} style={{marginBottom: "1rem", overflowX:"hidden"}}>
                                        <CommentLine>
                                            <SinglePostComment currentPost={currentPost} comment={comment} 
                                                updatePageAfterCommentDeletion={updatePageAfterCommentDeletion}
                                            />
                                        </CommentLine> 
                                    </div>
                                )
                            })}
                        </CommentSectionContainer>
                    </div>
                
                    <div>
                        <Row style={{marginTop: "1rem", marginLeft:"4rem", display:"flex", alignSelf:"center", alignItems:"center", justifyContent:"center"}}>
                            <Col xs="9">
                                <Input 
                                    type="textarea" 
                                    rows="1"
                                    id={inputAreaID}
                                    name="myComment"
                                    placeholder="Leave a comment here..."
                                    onChange={handleCommentChange}
                                    style={{ border: "0", backgroundColor: "#F2F2F2", fontFamily:"Source Sans Pro" }}
                                />     
                            </Col>
                            <Col xs="3" style={{ padding:"0px" }}>
                                <img
                                    src="../../../static/images/SendMessageIcon.svg"
                                    alt="Post Comment"
                                    style={{ cursor:"pointer", filter:"invert(38%) sepia(0%) saturate(2835%) hue-rotate(346deg) brightness(93%) contrast(93%)" }}
                                    onClick={(e) => { uploadComment(e, 0) ; clearInputField() }} />
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Row style={{marginTop: "1rem", marginLeft:"4rem", display:"flex", alignSelf:"center", alignItems:"center", justifyContent:"center"}}>
                        <Col xs="9">
                            <Input 
                                type="textarea" 
                                rows="1"
                                id={inputAreaID}
                                name="myComment"
                                placeholder="Leave a comment here..."
                                onChange={handleCommentChange}
                                style={{ border: "0", backgroundColor: "#F2F2F2", fontFamily:"Source Sans Pro" }}
                            />     
                        </Col>
                        <Col xs="3" style={{ padding:"0px" }}>
                            <img
                                src="../../../static/images/SendMessageIcon.svg"
                                alt="Post Comment"
                                style={{ cursor:"pointer", filter:"invert(38%) sepia(0%) saturate(2835%) hue-rotate(346deg) brightness(93%) contrast(93%)" }}
                                onClick={(e) => { uploadComment(e, 0) ; clearInputField() }} />
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
