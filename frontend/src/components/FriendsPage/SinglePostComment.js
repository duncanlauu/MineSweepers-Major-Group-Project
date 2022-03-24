import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, UncontrolledCollapse } from "reactstrap"
import useGetUser from "../../helpers";
import CommentReplyList from "./CommentReplyList";

export default function SinglePostComment(props) {

    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const currentUser = useGetUser();

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setSingleComment(props.comment)
    }, []);

    const deleteComment = (comment_id, e) => {
        axiosInstance
            .delete(`posts/${currentPost.id}/comments/${comment_id}`)
            .then((res) => {
                console.log(res)
                props.updatePageAfterCommentDeletion()
            })
            .catch(error => console.error(error));
    }

    const commentsRef = useRef([]);
    // used to have unique togglers
    const togglerID = "toggler" + singleComment.id
    const HashtagTogglerId = "#toggler" + singleComment.id

    return(
        <div className="singleComment" key={singleComment.id}>
            <Row style={{height: "5rem"}}>
                <Col>
                    <Row>
                        <Col xs="2" style={{height: "5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h4> {singleComment.author_id} </h4>
                        </Col>
                        <Col xs="6" style={{height: "5rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h4> {singleComment.content} </h4>
                        </Col>
                        <Col xs="4" style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button color="primary" id={togglerID} 
                                style={{height: "5rem", borderRadius: "20px"}}
                            >
                                Reply
                            </Button>
                            {singleComment.author_id == currentUser.id  &&     
                                <Button name={singleComment.id} onClick={(e) => deleteComment(singleComment.id, e)} 
                                    style={{height: "5rem", borderRadius: "50px"}}
                                >
                                    <p> x </p>
                                </Button>
                            }
                         </Col>
                    </Row>
                    <Row>
                        <UncontrolledCollapse toggler={HashtagTogglerId}>
                            <div>
                                {/* <PostComments ref={el => commentsRef.current[0] = el}  personalPost={personalPost} /> */}
                                {/* <PostCommentList post={personalPost}/> */}
                                <Row>
                                    <Col xs="4"> </Col>
                                    <Col xs="8">
                                        <CommentReplyList currentPost={currentPost} currentComment={singleComment}/>
                                    </Col>
                                </Row>
                            </div>
                        </UncontrolledCollapse>
                    </Row>
                </Col>
            </Row>
        </div>
    )

}