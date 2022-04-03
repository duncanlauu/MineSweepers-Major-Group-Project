import React, { useState, useEffect, useRef } from "react"
import axiosInstance from '../../axios'
import { Row, Col, Button, Input, UncontrolledCollapse } from "reactstrap"
import Gravatar from "react-gravatar"
import CommentReplyList from "./CommentReplyList";
import { useNavigate } from "react-router";
import { CommentLineBox } from "../UserProfile/UserProfileElements";
import { CommentContainer, CommentContent } from "./FeedElements";

export default function SinglePostComment(props) {

    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate()

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setSingleComment(props.comment)
        setPosterEmail(props.comment.author__email)
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

    const navigateToProfile = () => {
        navigate(`/user_profile/${singleComment.author}/`)
    }

    const commentsRef = useRef([]);
    const togglerID = "toggler" + singleComment.id
    const HashtagTogglerId = "#toggler" + singleComment.id

    return(
        <div className="singleComment" key={singleComment.id}>
            <Row>
                <CommentContainer>
                    {/* <Col xs="2" style={{height: "3rem", display: "flex", justifyContent: "center", alignItems: "flex-start"}}>
                        <Gravatar email={posterEmail} size={30} onClick={navigateToProfile} style={{ 
                                borderRadius: "50px",
                                marginTop: "0rem",
                                marginBottom: "0rem"
                            }} 
                        />
                    </Col> */}
                    <Gravatar 
                        email={posterEmail} 
                        size={30} 
                        onClick={navigateToProfile} 
                        style={{ 
                            borderRadius: "50px",
                            marginLeft: "2rem",
                            marginTop: "0rem",
                            marginBottom: "0rem"}} />
                    <Col xs="7" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                        <CommentContent>
                            {singleComment.content}
                        </CommentContent>
                    </Col>
                    <Col xs="3" style={{display: "flex", justifyContent: "flex-end"}}>
                        <div style={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                            {singleComment.author == currentUser.id  &&
                                <img 
                                    src="../../../static/images/DeleteChatIcon.svg" 
                                    className={singleComment.id}
                                    style={{
                                        height: "1.85rem",
                                        marginRight:"1rem",
                                        cursor: "pointer",
                                        filter: "invert(54%) sepia(45%) saturate(4028%) hue-rotate(328deg) brightness(76%) contrast(90%)"
                                    }}
                                    onClick={(e) => deleteComment(singleComment.id)}
                                    alt="Delete" />
                            }
                            <img 
                                src="../../../static/images/CommentsReplyIcon.svg" 
                                alt="Reply"
                                id={togglerID}
                                style={{ 
                                    height: "1.75rem",
                                    cursor: "pointer",
                                    alignSelf: "center"
                                }} />
                        </div>
                    </Col>
                    </CommentContainer>
                </Row>
                <Row>
                    <UncontrolledCollapse toggler={HashtagTogglerId}>
                        <div>
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
        </div>
    )

}