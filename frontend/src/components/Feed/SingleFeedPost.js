import React, { useState } from "react";
import axiosInstance from "../../axios";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardText,
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    UncontrolledCollapse,
} from "reactstrap";
import PostCommentList from "./PostCommentList";
import Gravatar from "react-gravatar";
import { PostHeadingText } from "../UserProfile/UserProfileElements";
import { useNavigate } from "react-router";
import {HeadingText} from "../Login/LoginElements"
import LikesUsersList from "./LikesUsersList";
import { ClubPill, LikesText, PostText, ReactionContainer } from "./FeedElements"

export default function SingleFeedPost(props) {
    const [likesCount, setLikesCount] = useState(props.post.likesCount);
    const [likedByUser, setLikedByUser] = useState(props.post.liked);
    const [isModalVisible, setModalVisibility] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [commentsVisibility, setCommentsVisibility] = useState(false)

    const navigate = useNavigate();

    const updatePostUpvotes = () => {
        axiosInstance
            .get(`posts/${props.post.id}`)
            .then((res) => {
                setLikesCount(res.data.post.upvotes.length);
                setLikedByUser(res.data.post.liked);
            })
            .catch((error) => console.error(error));
    };

    const likePost = () => {
        axiosInstance
            .put(`posts/${props.post.id}`, {
                action: "upvote",
            })
            .then(() => {
                updatePostUpvotes();
            })
            .catch((error) => console.error(error));
    };

    const changeModalVisibility = () => {
        setModalVisibility(!isModalVisible);
    };

    const toggleCommentOpen = () => {
        setIsCommentOpen(!isCommentOpen);
    };

    const navigateToProfile = () => {
        navigate(`/user_profile/${props.post.author}/`);
    };

    const togglerID = "toggler" + props.post.id;
    const HashtagTogglerId = "#toggler" + props.post.id;

    return (
        <div className="feedPost" key={props.post.id} data-testId="singleFeedPost">
            <Card
                style={{
                    marginBottom: "1rem",
                    marginRight: "1rem",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "3px solid rgba(0,0,0,.125)",
                }}
            >
                <CardHeader>
                    <Row>
                        <Col xs="1">
                            <Gravatar
                                email={props.post.author__email}
                                size={30}
                                onClick={navigateToProfile}
                                style={{
                                    borderRadius: "50px",
                                    marginTop: "0rem",
                                    marginBottom: "0rem",
                                    cursor: "pointer"
                                }}
                            />
                        </Col>
                        <Col xs="4" style={{ paddingRight:"0px" }}>
                            <h5 style={{ fontFamily:"Source Sans Pro", fontWeight:"600", marginTop:"0.65rem" }}>{props.post.author__username}</h5>
                        </Col>
                        <Col xs="6" style={{ display: "flex", justifyContent: "flex-end", padding:"0px" }}>
                            {props.post.club != null && (
                                <ClubPill>
                                    {props.post.club__name}
                                </ClubPill>
                            )}
                        </Col>
                    </Row>
                </CardHeader>

                <CardBody>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <CardTitle>
                            <PostHeadingText>{props.post.title}</PostHeadingText>
                        </CardTitle>
                    </div>

                    <CardText>
                        <PostText>{props.post.content}</PostText>
                    </CardText>
                </CardBody>
                {/* <div
                    style={{ textAlign: "right" }}>
                        <Button
                            id={togglerID}
                            style={{
                                height: "4rem",
                                background: isCommentOpen ? "#653FFD" : "#ffffff",
                                color: isCommentOpen ? "#ffffff" : "#653FFD",
                                borderColor: "#653FFD",
                            }}
                            onClick={() => {
                                setCommentsVisibility(!commentsVisibility)
                            }}
                        >
                            <CommentIcon />
                        </Button>
                        &nbsp;
                        <Button
                            style={{
                                height: "4rem",
                                background: likedByUser ? "#653FFD" : "#ffffff",
                                color: likedByUser ? "#ffffff" : "#653FFD",
                                borderColor: "#653FFD",
                            }}
                            onClick={likePost}
                        >
                            <ThumbUp />
                        </Button>
                        &nbsp;
                        <Button
                            style={{
                                height: "4rem",
                                background: "#653FFD",
                                color: "#ffffff",
                                borderColor: "#653FFD",
                            }}
                            onClick={changeModalVisibility}
                        >
                            Likes: {likesCount}
                        </Button>
                    </div> */}
                <div>
                    <Row style={{ display:"flex", float:"right", marginRight:"1rem", marginBottom:"0.5rem" }}>
                        <ReactionContainer>
                            <img 
                                src="../../../static/images/CommentIcon.svg" 
                                style={{ height:"2rem", opacity:"80%", marginRight:"1rem", cursor:"pointer" }}
                                onClick={() => {
                                    setCommentsVisibility(!commentsVisibility)
                                }}
                                id={togglerID} />
                            {likedByUser
                                ?
                                <img 
                                src="../../../static/images/LikedStateButton.svg" 
                                alt="Like Button" 
                                style={{ height:"2rem", cursor:"pointer" }}
                                onClick={likePost} />
                                :
                                <img 
                                src="../../../static/images/UnlikedStateButton.svg" 
                                alt="Like Button" 
                                style={{ height:"2rem", opacity:"80%", cursor:"pointer" }}
                                onClick={likePost} />
                            }
                            <LikesText 
                                style={{ cursor: "pointer" }}
                                onClick={changeModalVisibility}>
                                    {likesCount}
                            </LikesText>
                        </ReactionContainer>
                    </Row>
                    <br/>
                </div>

                <UncontrolledCollapse toggler={HashtagTogglerId} data-testid="all-comments-button">
                    {commentsVisibility === true &&
                        <div style={{ maxHeight: "25rem", marginBottom: "2rem" }}>
                            <PostCommentList post={props.post} />
                        </div>
                    }
                </UncontrolledCollapse>
            </Card>

            <Modal
                isOpen={isModalVisible}
                toggle={() => changeModalVisibility()}
                style={{
                    left: 0,
                    top: 180,
                }}
            >
                <ModalBody style={{ overflowY: "scroll" }}>
                    <HeadingText>Liked by</HeadingText>
                    <LikesUsersList post={props.post} />
                </ModalBody>
            </Modal>
        </div>
    );
}
