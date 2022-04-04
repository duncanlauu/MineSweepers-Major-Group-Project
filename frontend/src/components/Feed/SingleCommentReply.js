import React, {useState, useEffect} from "react"
import axiosInstance from '../../axios'
import {Row, Col, Button} from "reactstrap"
import Gravatar from "react-gravatar"
import {ReplyLineBox} from "../UserProfile/UserProfileElements";
import {useNavigate} from "react-router";

export default function SingleCommentReply(props) {

    const [singleReply, setSingleReply] = useState("");
    const [singleComment, setSingleComment] = useState("");
    const [posterEmail, setPosterEmail] = useState("");
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate()

    useEffect(() => {
        setSingleComment(props.comment)
        setSingleReply(props.reply)
        setPosterEmail(props.reply.author__email)
    }, []);

    const deleteComment = () => {
        axiosInstance
            .delete(`posts/${props.post.id}/comments/${props.comment.id}/replies/${props.reply.id}`)
            .then(() => {
                props.updatePageAfterReplyDeletion()
            })
            .catch(error => console.error(error));
    }

    const navigateToProfile = () => {
        navigate(`/user_profile/${singleReply.author}/`)
    }

    return (
        <div className="singleComment" style={{ overflow:"hidden" }} key={singleReply.id}>
            <Row>
                <Col>
                    <Row>
                        <Col xs="2" 
                            style={{
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
                        <Col xs="8">
                            <ReplyLineBox>
                                <h6 style={{ fontFamily:"Source Sans Pro" }}> {singleReply.content} </h6>
                            </ReplyLineBox>
                        </Col>
                        {singleReply.author === currentUser.id  &&
                            <Col 
                                xs="2" 
                                style={{
                                    display: "flex", 
                                    justifyContent: "center",
                                    paddingLeft:"0",
                                    alignItems:"center"}}>
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
