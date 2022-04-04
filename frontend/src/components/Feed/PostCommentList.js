import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Row, Col, Button, Input} from "reactstrap";
import SinglePostComment from "./SinglePostComment";
import {
    CommentLine,
    CommentSectionContainer,
} from "../UserProfile/UserProfileElements";

export default function PostCommentList(props) {
    const [commentsUnderPost, setCommentsUnderPost] = useState([]);
    const [writtenComment, updateWrittenComment] = useState("");

    useEffect(() => {
        getCommentsUnderPost();
    }, []);

    const getCommentsUnderPost = () => {
        axiosInstance.get(`posts/${props.post.id}/comments/`).then((res) => {
            setCommentsUnderPost(res.data.comments);
        });
    };

    const handleCommentChange = (e) => {
        updateWrittenComment({
            writtenComment,
            [e.target.name]: e.target.value,
        });
    };

    const uploadComment = () => {
        axiosInstance
            .post(`posts/${props.post.id}/comments/`, {
                content: writtenComment.myComment,
            })
            .then(() => {
                getCommentsUnderPost();
            });
    };

    const updatePageAfterCommentDeletion = () => {
        getCommentsUnderPost();
    };

    const inputAreaID = "myComment" + props.post.id;

    const clearInputField = () => {
        document.getElementById(inputAreaID).value = "";
    };

    const displayCommentsUnderPost = (e) => {
        return (
            <div>
                {commentsUnderPost.length > 0 &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <CommentSectionContainer>
                        {commentsUnderPost.map((comment, index) => {
                            return (
                                <div key={comment.id} style={{marginBottom: "1rem"}}>
                                    <CommentLine>
                                        <SinglePostComment post={props.post} comment={comment}
                                                           updatePageAfterCommentDeletion={updatePageAfterCommentDeletion}
                                        />
                                    </CommentLine>
                                </div>
                            )
                        })}
                    </CommentSectionContainer>
                </div>
                }

                <div>
                    <Row style={{marginTop: "1rem", marginLeft:"4rem"}}>
                        <Col xs="9">
                            <Input
                                type="textarea"
                                rows="1"
                                id={inputAreaID}
                                name="myComment"
                                placeholder="Leave a comment here..."
                                data-testid={"comment-input"}
                                onChange={handleCommentChange}
                                style={{
                                    border: "0",
                                    backgroundColor: "#F3F3F3",
                                    fontFamily:"Source Sans Pro"
                                }}
                            />
                        </Col>
                        <Col xs="3" style={{ padding:"0px", display:"flex", alignItems:"center", justifyContent:"flex-start" }}>
                            <img
                                src="../../../static/images/SendMessageIcon.svg"
                                alt="Post Comment"
                                style={{ cursor:"pointer", alignSelf:"center", filter:"invert(38%) sepia(0%) saturate(2835%) hue-rotate(346deg) brightness(93%) contrast(93%)" }}
                                onClick={(e) => { uploadComment(e, 0) ; clearInputField() }} />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )

}
