import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, UncontrolledCollapse } from "reactstrap"
import useGetUser from "../../helpers";
import CommentReplyList from "./CommentReplyList";

export default function SinglePostComment(props) {

    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const currentUser = localStorage.username;

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
            <Row>
                <Col>
                    <Row>
                        <Col xs="2" style={{height: "3rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h6> {singleComment.author_id} </h6>
                        </Col>
                        <Col xs="6" style={{height: "3rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h6> {singleComment.content} </h6>
                        </Col>
                        <Col xs="4" style={{display: "flex", justifyContent: "flex-end"}}>
                            {singleComment.author_id == currentUser.id  &&   
                                <Button color="danger" name={singleComment.id} onClick={(e) => deleteComment(singleComment.id, e)} 
                                    style={{height: "3rem", borderTopLeftRadius: "100px", borderBottomLeftRadius: "100px"}}
                                >
                                    <p> x </p>
                                </Button>
                            }
                            <Button id={togglerID} 
                                style={{height: "3rem", borderTopRightRadius: "100px", borderBottomRightRadius: "100px"}}
                            >
                                Reply
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <UncontrolledCollapse toggler={HashtagTogglerId}>
                            <div>
                                {/* <PostComments ref={el => commentsRef.current[0] = el}  personalPost={personalPost} /> */}
                                {/* <PostCommentList post={personalPost}/> */}
                                <hr style={{marginTop: "0rem"}}/>
                                <Row>
                                    <Col xs="2"> </Col>
                                    <Col xs="8">
                                        <CommentReplyList currentPost={currentPost} currentComment={singleComment}/>
                                    </Col>
                                    <Col xs="2"> </Col>
                                </Row>
                            </div>
                        </UncontrolledCollapse>
                    </Row>
                </Col>
            </Row>
        </div>
    )

}