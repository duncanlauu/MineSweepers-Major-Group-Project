import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Row, Col, Button, Input} from "reactstrap";
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
            .get(
                `posts/${props.post.id}/comments/${props.comment.id}/replies/`
            )
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

    const displayCommentsUnderPost = (e) => {
        return (
            <div>

                <div style={{display: "flex", justifyContent: "center"}}>
                    <Row style={{marginBottom: "1rem"}}>
                        <Col xs="9">
                            <Input type="textarea" rows="1"
                                   data-testid={"reply-input"}
                                   id={inputAreaID}
                                   name="myReply"
                                   placeholder="Leave a reply here..."
                                   onChange={handleReplyChange}
                                   style={{
                                       border: "0",
                                       backgroundColor: "#fff",
                                       height: "3rem"
                                   }}
                            />
                        </Col>
                        <Col xs="3">
                            <Button onClick={(e) => {
                                uploadReply(e, 0);
                                clearInputField()
                            }}
                                    style={{
                                        borderRadius: "100px",
                                        height: "3rem"
                                    }}
                            >
                                <p> Send </p>
                            </Button>
                        </Col>
                    </Row>
                </div>

                {repliesUnderComment.length > 0 &&
                repliesUnderComment.map((reply, index) => {
                    return (
                        <div key={reply.id} style={{height: "3rem", marginBottom: "1rem"}}>
                            <ReplyLine>
                                <SingleCommentReply post={props.post} comment={currentComment}
                                                    reply={reply}
                                                    updatePageAfterReplyDeletion={updatePageAfterReplyDeletion}
                                />
                            </ReplyLine>
                        </div>
                    )
                })
                }
            </div>
        )
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )


}