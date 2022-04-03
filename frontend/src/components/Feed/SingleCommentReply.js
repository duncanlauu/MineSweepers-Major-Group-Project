import React, {useState, useEffect, useRef} from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button, Input, UncontrolledCollapse} from "reactstrap"
import Gravatar from "react-gravatar"
import {ReplyLineBox} from "../UserProfile/UserProfileElements";
import {useNavigate} from "react-router";

export default function SingleCommentReply(props) {

    const [singleReply, setSingleReply] = useState("");
    const [singleComment, setSingleComment] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate()

    useEffect(() => {
        setCurrentPost(props.currentPost)
        setSingleComment(props.currentComment)
        setSingleReply(props.reply)
        setPosterEmail(props.reply.author__email)
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

    const navigateToProfile = () => {
        navigate(`/user_profile/${singleReply.author}/`)
    }

    return (
        <div className="singleComment" key={singleReply.id}>
            <Row>
                <Col>
                    <Row>
                        <Col xs="2" style={{
                            height: "3rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start"
                        }}>
                            <Gravatar email={posterEmail} size={30} onClick={navigateToProfile} style={{
                                borderRadius: "50px",
                                marginTop: "0rem",
                                marginBottom: "0rem"
                            }}
                            />
                        </Col>
                        <Col xs="8"
                             style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <ReplyLineBox>
                                <h6> {singleReply.content} </h6>
                            </ReplyLineBox>
                        </Col>
                        {singleReply.author === currentUser.id  &&
                            <Col xs="2" style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                                {/* <Button color="danger" name={singleReply.id} onClick={(e) => deleteComment(singleReply.id, e)} 
                                    style={{height: "3rem", borderTopRightRadius: "100px", borderBottomRightRadius: "100px"}}
                                >
                                    <p> x </p>
                                </Button> */}
                                <img 
                                    src="../../../static/images/DeleteChatIcon.svg" 
                                    className={singleReply.id}
                                    style={{
                                        height: "1.85rem",
                                        marginRight:"1rem",
                                        cursor: "pointer",
                                        filter: "invert(54%) sepia(45%) saturate(4028%) hue-rotate(328deg) brightness(76%) contrast(90%)"
                                    }}
                                    onClick={(e) => deleteComment(singleReply.id, e)}
                                    alt="Delete" />
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
        </div>
    )


}
