import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, UncontrolledCollapse } from "reactstrap"
import useGetUser from "../../helpers";

export default function SingleCommentReply(props) {

    const [singleReply, setSingleReply] = useState("");
    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const currentUser = useGetUser();

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setSingleComment(props.currentComment)
        setSingleReply(props.reply)
    }, []);

    const deleteComment = (comment_id, e) => {
        axiosInstance
            .delete(`posts/${currentPost.id}/comments/${comment_id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterReplyDeletion()
            })
            .catch(error => console.error(error));
    }

    return(
        <div className="singleComment" key={singleReply.id}>
            <Row>
                <Col>
                    <Row>
                        <Col xs="2">
                            <h4> {singleReply.id} </h4>
                        </Col>
                        <Col xs="6">
                            <h4> {singleReply.content} </h4>
                        </Col>
                        {singleComment.author_id == currentUser.id  &&
                            <Col xs="2">
                                <Button name={singleReply.id} onClick={(e) => deleteComment(singleReply.id, e)} >
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
