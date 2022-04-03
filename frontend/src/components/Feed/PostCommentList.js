import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle} from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button, Input} from "reactstrap"
import SinglePostComment from "./SinglePostComment";
import {CommentLine, CommentSectionContainer} from "../UserProfile/UserProfileElements";

export default function PostCommentList(props) {

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
        return (
            <div>
                {commentsUnderPost.length > 0 &&
                <div style={{display: "flex", justifyContent: "center"}}>
                    <CommentSectionContainer>
                        {commentsUnderPost.map((comment, index) => {
                            // console.log(comment);
                            return (
                                <div key={comment.id} style={{marginBottom: "1rem"}}>
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
                }

                <div style={{display: "flex", justifyContent: "center"}}>
                    <Row style={{marginTop: "1rem"}}>
                        <Col xs="9">
                            <Input type="textarea" rows="1"
                                   data-testid="comment-input"
                                   id={inputAreaID}
                                   name="myComment"
                                   placeholder="Leave a comment here..."
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
