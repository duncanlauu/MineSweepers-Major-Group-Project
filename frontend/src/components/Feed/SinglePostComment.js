import React, {useState, useEffect, useRef} from "react";
import axiosInstance from "../../axios";
import {Row, Col, Button, UncontrolledCollapse} from "reactstrap";
import Gravatar from "react-gravatar";
import CommentReplyList from "./CommentReplyList";
import {useNavigate} from "react-router";
import {CommentLineBox} from "../UserProfile/UserProfileElements";

export default function SinglePostComment(props) {
    const [singleComment, setSingleComment] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    useEffect(() => {
        setSingleComment(props.comment);
        setPosterEmail(props.comment.author__email);
    }, []);

    const deleteComment = (comment_id, e) => {
        axiosInstance
            .delete(`posts/${props.post.id}/comments/${comment_id}`)
            .then((res) => {
                console.log(res);
                props.updatePageAfterCommentDeletion();
            })
            .catch((error) => console.error(error));
    };

    const navigateToProfile = () => {
        navigate(`/user_profile/${singleComment.author}/`);
    };

    const commentsRef = useRef([]);
    const togglerID = "toggler" + singleComment.id;
    const HashtagTogglerId = "#toggler" + singleComment.id;

    return (
        <div className="singleComment" key={singleComment.id}>
            <Row>
                <Col
                    xs="2"
                    style={{
                        height: "3rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <Gravatar
                        email={posterEmail}
                        size={30}
                        onClick={navigateToProfile}
                        style={{
                            borderRadius: "50px",
                            marginTop: "0rem",
                            marginBottom: "0rem",
                        }}
                    />
                </Col>
                <Col
                    xs="7"
                    style={{
                        height: "3rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CommentLineBox>
                        <h6> {singleComment.content} </h6>
                    </CommentLineBox>
                </Col>
                <Col xs="3" style={{display: "flex", justifyContent: "flex-end"}}>
                    {singleComment.author === currentUser.id && (
                        <Button
                            color="danger"
                            name={singleComment.id}
                            data-testid="comment-remove-button"
                            onClick={(e) => deleteComment(singleComment.id, e)}
                            style={{
                                height: "3rem",
                                borderTopLeftRadius: "100px",
                                borderBottomLeftRadius: "100px",
                            }}
                        >
                            <p> x </p>
                        </Button>
                    )}
                    <Button
                        data-testid={"comment-reply-button"}
                        id={togglerID}
                        style={{
                            height: "3rem",
                            borderTopRightRadius: "100px",
                            borderBottomRightRadius: "100px",
                        }}
                    >
                        Reply
                    </Button>
                </Col>
            </Row>
            <Row>
                <UncontrolledCollapse toggler={HashtagTogglerId}>
                    <div>
                        <hr style={{marginTop: "0rem"}}/>
                        <Row>
                            <Col
                                xs="2"
                                style={{
                                    height: "3rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Gravatar
                                    email={posterEmail}
                                    size={30}
                                    onClick={navigateToProfile}
                                    style={{
                                        borderRadius: "50px",
                                        marginTop: "0rem",
                                        marginBottom: "0rem",
                                    }}
                                />
                            </Col>
                            <Col
                                xs="7"
                                style={{
                                    height: "3rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CommentLineBox>
                                    <h6> {singleComment.content} </h6>
                                </CommentLineBox>
                            </Col>
                            <Col
                                xs="3"
                                style={{display: "flex", justifyContent: "flex-end"}}
                            >
                                {singleComment.author === currentUser.id && (
                                    <Button
                                        color="danger"
                                        name={singleComment.id}
                                        onClick={(e) => deleteComment(singleComment.id, e)}
                                        style={{
                                            height: "3rem",
                                            borderTopLeftRadius: "100px",
                                            borderBottomLeftRadius: "100px",
                                        }}
                                    >
                                        <p> x </p>
                                    </Button>
                                )}
                                <Button
                                    id={togglerID}
                                    style={{
                                        height: "3rem",
                                        borderTopRightRadius: "100px",
                                        borderBottomRightRadius: "100px",
                                    }}
                                >
                                    Reply
                                </Button>
                            </Col>
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
                </UncontrolledCollapse>
            </Row>
        </div>
    );
}
