import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button, Input} from "reactstrap"
import SingleCommentReply from "./SingleCommentReply";
import {ReplyLine} from "../UserProfile/UserProfileElements";

export default function CommentReplyList(props) {

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
        axiosInstance
            .post(`posts/${currentPost.id}/comments/${currentComment.id}/replies/`, {
                content: writtenReply.myReply,
            })
            .then((res) => {
                getRepliesUnderComments()
            })
    }

    const updatePageAfterReplyDeletion = (e) => {
        getRepliesUnderComments()
    }


    const inputAreaID = "myReply" + currentComment.id

    const clearInputField = () => {
        document.getElementById(inputAreaID).value = ''
    }

    const displayCommentsUnderPost = (e) => {
        if (repliesUnderComment.length > 0) {
            // console.log(repliesUnderComment);
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
                                           borderBottomLeftRadius: "100px",
                                           borderTopLeftRadius: "100px",
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
                                            borderBottomRightRadius: "100px",
                                            borderTopRightRadius: "100px",
                                            height: "3rem"
                                        }}
                                >
                                    <p> Send </p>
                                </Button>
                            </Col>
                        </Row>
                    </div>


                    {repliesUnderComment.map((reply, index) => {
                        return (
                            <div key={reply.id} style={{height: "3rem", marginBottom: "1rem"}}>
                                <ReplyLine>
                                    <SingleCommentReply currentPost={currentPost} currentComment={currentComment}
                                                        reply={reply}
                                                        updatePageAfterReplyDeletion={updatePageAfterReplyDeletion}
                                    />
                                </ReplyLine>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Row style={{marginBottom: "1rem"}}>
                            <Col xs="9">
                                <Input type="textarea" rows="1"
                                       id={inputAreaID}
                                       name="myReply"
                                       placeholder="Leave a reply here..."
                                       onChange={handleReplyChange}
                                       style={{
                                           border: "0",
                                           backgroundColor: "#fff",
                                           borderBottomLeftRadius: "100px",
                                           borderTopLeftRadius: "100px",
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
                                            borderBottomRightRadius: "100px",
                                            borderTopRightRadius: "100px",
                                            height: "3rem"
                                        }}
                                >
                                    <p> Send </p>
                                </Button>
                            </Col>
                        </Row>
                    </div>
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