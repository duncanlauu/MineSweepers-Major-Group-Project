import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Row, Col, Input} from "reactstrap";
import SingleCommentReply from "./SingleCommentReply";
import {ReplyLine} from "../UserProfile/UserProfileElements";

export default function CommentReplyList(props) {
    const [currentComment, setCurrentComment] = useState([]);
    const [repliesUnderComment, setRepliesUnderComment] = useState([]);
    const [writtenReply, updateWrittenReply] = useState("");

    useEffect(() => {
        setCurrentComment(props.comment);
        getRepliesUnderComments();
    }, []);

    const getRepliesUnderComments = () => {
        axiosInstance
            .get(`posts/${props.post.id}/comments/${props.comment.id}/replies/`)
            .then((res) => {
                const allRepliesUnderComment = res.data.replies;
                setRepliesUnderComment(allRepliesUnderComment);
            });
    };

    const handleReplyChange = (e) => {
        updateWrittenReply({
            writtenReply,
            [e.target.name]: e.target.value,
        });
    };

    const uploadReply = () => {
        axiosInstance
            .post(`posts/${props.post.id}/comments/${currentComment.id}/replies/`, {
                content: writtenReply.myReply,
            })
            .then((res) => {
                getRepliesUnderComments();
            });
    };

    const updatePageAfterReplyDeletion = () => {
        getRepliesUnderComments();
    };

    const inputAreaID = "myReply" + currentComment.id;

    const clearInputField = () => {
        document.getElementById(inputAreaID).value = "";
    };

    return (
        <div>
            <Row style={{marginBottom: "3rem"}}>
                <Col xs="9" style={{padding: "0px", marginLeft: "5rem"}}>
                    <Input
                        type="textarea"
                        rows="1"
                        data-testid={"reply-input"}
                        id={inputAreaID}
                        name="myReply"
                        placeholder="Leave a reply here..."
                        onChange={handleReplyChange}
                        style={{
                            border: "0",
                            backgroundColor: "#fff",
                            fontFamily: "Source Sans Pro",
                        }}
                    />
                </Col>
                <Col
                    xs="1"
                    style={{
                        padding: "0px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginLeft: "1rem",
                    }}
                >
                    <img
                        src="../../../static/images/SendMessageIcon.svg"
                        alt="Post Reply"
                        style={{
                            marginLeft: "0px",
                            cursor: "pointer",
                            filter:
                                "invert(38%) sepia(0%) saturate(2835%) hue-rotate(346deg) brightness(93%) contrast(93%)",
                        }}
                        onClick={(e) => {
                            uploadReply(e, 0);
                            clearInputField();
                        }}
                        data-testid={"reply-button"}
                    />
                </Col>
            </Row>

            {repliesUnderComment.length > 0 &&
            repliesUnderComment.map((reply, index) => {
                return (
                    <div
                        key={reply.id}
                        style={{
                            marginBottom: "1rem",
                            overflow: "hidden",
                            marginLeft: "5rem",
                        }}
                    >
                        <ReplyLine>
                            <SingleCommentReply
                                post={props.post}
                                comment={currentComment}
                                reply={reply}
                                updatePageAfterReplyDeletion={updatePageAfterReplyDeletion}
                            />
                        </ReplyLine>
                    </div>
                );
            })}
        </div>
    );
}
