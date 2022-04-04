import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Row, Col, Button, UncontrolledCollapse} from "reactstrap";
import Gravatar from "react-gravatar";
import CommentReplyList from "./CommentReplyList";
import {useNavigate} from "react-router";
import {CommentLineBox} from "../UserProfile/UserProfileElements";
import { CommentContainer, CommentContent } from "./FeedElements";

export default function SinglePostComment(props) {
    const [singleComment, setSingleComment] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    useEffect(() => {
        setSingleComment(props.comment);
        setPosterEmail(props.comment.author__email);
    }, []);

    const deleteComment = (comment_id) => {
        axiosInstance
            .delete(`posts/${props.post.id}/comments/${comment_id}`)
            .then(() => {
                props.updatePageAfterCommentDeletion();
            })
            .catch((error) => console.error(error));
    };

    const navigateToProfile = () => {
        navigate(`/user_profile/${singleComment.author}/`);
    };

    const togglerID = "toggler" + singleComment.id;
    const HashtagTogglerId = "#toggler" + singleComment.id;

    return (
        <div className="singleComment" style={{ overflowX: "hidden" }} key={singleComment.id}>
            <Row>
                <CommentContainer>
                    <Gravatar
                            email={posterEmail}
                            size={30}
                            onClick={navigateToProfile}
                            style={{
                                borderRadius: "50px",
                                marginTop: "0rem",
                                marginBottom: "0rem",
                                marginLeft: "2rem"
                            }}
                        />
                               
                <Col
                    xs="7"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "left"
                    }}
                >
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
                                <CommentReplyList
                                    comment={singleComment}
                                    post={props.post}
                                />
                            </Col>
                            <Col xs="2"> </Col>
                        </Row>
                    </div>
                </UncontrolledCollapse>
            </Row>
        </div>
    );
}
