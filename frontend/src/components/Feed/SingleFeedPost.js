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
import ThumbUp from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import LikesUsersList from "./LikesUsersList";

export default function SingleFeedPost(props) {
  const [likesCount, setLikesCount] = useState(props.post.likesCount);
  const [likedByUser, setLikedByUser] = useState(props.post.liked);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

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
    <div className="feedPost" key={props.post.id}>
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
                }}
              />
            </Col>
            <Col xs="4">
              <h5>
                <b> @{props.post.author__username} </b>
              </h5>
            </Col>
            <Col xs="6" style={{ display: "flex", justifyContent: "flex-end" }}>
              {props.post.club != null && (
                <h5>
                  <b> {props.post.club__name} </b>
                </h5>
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
            <h5> {props.post.content} </h5>
          </CardText>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              id={togglerID}
              style={{
                height: "4rem",
                background: isCommentOpen ? "#653FFD" : "#ffffff",
                color: isCommentOpen ? "#ffffff" : "#653FFD",
                borderColor: "#653FFD",
              }}
              onClick={toggleCommentOpen}
            >
              <CommentIcon />
            </Button>
            &nbsp;
            <Button
              name="like-button"
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
          </div>
        </CardBody>

        <UncontrolledCollapse toggler={HashtagTogglerId}>
          <div style={{ maxHeight: "25rem", marginBottom: "2rem" }}>
            <PostCommentList post={props.post} />
          </div>
        </UncontrolledCollapse>
      </Card>

      <Modal
        isOpen={isModalVisible}
        toggle={() => changeModalVisibility()}
        style={{
          left: 0,
          top: 100,
        }}
      >
        <ModalBody style={{ overflowY: "scroll" }}>
          <LikesUsersList post={props.post}></LikesUsersList>
        </ModalBody>
      </Modal>
    </div>
  );
}
