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

                <div style={{display: "flex", justifyContent: "center"}}>
                    <Row style={{marginTop: "1rem", marginBottom: "1rem"}}>
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
                                    height: "3rem"
                                }}
                            />
                        </Col>
                        <Col xs="3">
                            <Button onClick={(e) => {
                                uploadComment(e, 0);
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
            </div>
        )
    }

    return (
        <>
            {displayCommentsUnderPost()}
        </>
    )

}
