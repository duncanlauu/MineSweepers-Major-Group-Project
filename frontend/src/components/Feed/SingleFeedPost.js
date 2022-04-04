import React, {useState} from "react";
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
import {PostHeadingText} from "../UserProfile/UserProfileElements";
import {useNavigate} from "react-router";
import LikesUsersList from "./LikesUsersList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUp from "@mui/icons-material/ThumbUp";
import {ClubPill, PostText, ReactionContainer} from "./FeedElements";

export default function SingleFeedPost(props) {
    const [likesCount, setLikesCount] = useState(props.post.likesCount);
    const [likedByUser, setLikedByUser] = useState(props.post.liked);
    const [isModalVisible, setModalVisibility] = useState(false);
    const [commentsVisibility, setCommentsVisibility] = useState(false);

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

    const changeCommentsVisibility = () => {
        setCommentsVisibility(!commentsVisibility);
    };

    const navigateToProfile = () => {
        navigate(`/user_profile/${props.post.author}/`);
    };

    const getLikesUsersListPost = (setLikesUsersList) => {
        axiosInstance
            .get(`posts/${props.post.id}`)
            .then((res) => {
                setLikesUsersList(res.data.post.upvotes);
            })
            .catch((error) => console.error(error));
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
                                    cursor: "pointer",
                                }}
                            />
                        </Col>
                        <Col xs="4" style={{paddingRight: "0px"}}>
                            <h5
                                style={{
                                    fontFamily: "Source Sans Pro",
                                    fontWeight: "600",
                                    marginTop: "0.65rem",
                                }}
                            >
                                <a
                                    href={`#`}
                                    onClick={navigateToProfile}
                                    style={{color: "#000000"}}
                                >
                                    <b> @{props.post.author__username} </b>
                                </a>
                            </h5>
                        </Col>
                        <Col
                            xs="6"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                padding: "0px",
                            }}
                        >
                            {props.post.club != null && (
                                <ClubPill>{props.post.club__name}</ClubPill>
                            )}
                        </Col>
                    </Row>
                </CardHeader>

                <CardBody>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <CardTitle>
                            <PostHeadingText>{props.post.title}</PostHeadingText>
                        </CardTitle>
                    </div>

                    <CardText>
                        <PostText>{props.post.content}</PostText>
                    </CardText>
                </CardBody>

                <div>
                    <Row
                        style={{
                            display: "flex",
                            float: "right",
                            marginRight: "1rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <ReactionContainer>
                            <Button
                                id={togglerID}
                                style={{
                                    background: commentsVisibility ? "#653FFD" : "#ffffff",
                                    color: commentsVisibility ? "#ffffff" : "#653FFD",
                                    borderColor: "#653FFD",
                                }}
                                onClick={changeCommentsVisibility}
                            >
                                <CommentIcon/>
                            </Button>
                            &nbsp;
                            <Button
                                style={{
                                    background: likedByUser ? "#653FFD" : "#ffffff",
                                    color: likedByUser ? "#ffffff" : "#653FFD",
                                    borderColor: "#653FFD",
                                }}
                                onClick={likePost}
                            >
                                {" "}
                                <ThumbUp/>
                            </Button>
                            &nbsp;
                            <Button
                                style={{
                                    background: "#653FFD",
                                    color: "#ffffff",
                                    borderColor: "#653FFD",
                                }}
                                onClick={changeModalVisibility}
                            >
                                {likesCount}
                                <FavoriteIcon/>
                            </Button>
                        </ReactionContainer>
                    </Row>
                    <br/>
                </div>

                <UncontrolledCollapse
                    toggler={HashtagTogglerId}
                    data-testid="all-comments-button"
                >
                    {commentsVisibility === true && <PostCommentList post={props.post}/>}
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
                <ModalBody style={{overflowY: "scroll"}}>
                    <h4>Users who liked {props.post.author__username}'s post</h4>
                    <hr/>
                    <LikesUsersList
                        type="post"
                        getLikesUsersList={getLikesUsersListPost}
                    />
                </ModalBody>
            </Modal>
        </div>
    );
}
