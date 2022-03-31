import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, UncontrolledCollapse } from "reactstrap"
import useGetUser from "../../helpers";

export default function SingleCommentReply(props) {

    const [singleReply, setSingleReply] = useState("");
    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const currentUser = localStorage.username;

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setSingleComment(props.currentComment)
        setSingleReply(props.reply)
    }, []);

    const deleteComment = (comment_id, e) => {
        axiosInstance
            .delete(`posts/${currentPost.id}/comments/${singleComment.id}/replies/${singleReply.id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterReplyDeletion()
            })
            .catch(error => console.error(error));
    }

    return(
        <div className="singleComment" key={singleReply.id}>
            <Row style={{marginBottom: "1rem"}}>
                <Col>
                    <Row>
                        <Col xs="2">
                            <h6> {singleReply.id} </h6>
                        </Col>
                        <Col xs="8">
                            <h6> {singleReply.content} </h6>
                        </Col>
                        {singleComment.author_id == currentUser.id  &&
                            <Col xs="2" style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button color="danger" name={singleReply.id} onClick={(e) => deleteComment(singleReply.id, e)} 
                                    style={{height: "3rem", borderTopRightRadius: "100px", borderBottomRightRadius: "100px"}}
                                >
                                    <p> x </p>
                                </Button>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
        </div>
    )



}
