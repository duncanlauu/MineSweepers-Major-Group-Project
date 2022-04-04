import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import {
  Row,
  Col,
  Button,
  UncontrolledCollapse,
  Modal,
  ModalBody,
} from "reactstrap";
import Gravatar from "react-gravatar";
import CommentReplyList from "./CommentReplyList";
import { useNavigate } from "react-router";
import { CommentLineBox } from "../UserProfile/UserProfileElements";
import ThumbUp from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import LikesUsersList from "./LikesUsersList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommentLineBox } from "../UserProfile/UserProfileElements";
import { CommentContainer, CommentContent } from "./FeedElements";

export default function SinglePostComment(props) {
  const [singleComment, setSingleComment] = useState("");
  const [posterEmail, setPosterEmail] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [isModalVisible, setModalVisibility] = useState(false);
  const [commentsVisibility, setCommentsVisibility] = useState(false);
  const [likesCount, setLikesCount] = useState(props.comment.likesCount);
  const [likedByUser, setLikedByUser] = useState(props.comment.liked);

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

  const updateCommentUpvotes = () => {
    axiosInstance
      .get(`posts/${props.post.id}/comments/${props.comment.id}`)
      .then((res) => {
        setLikesCount(res.data.comment.upvotes.length);
        setLikedByUser(res.data.comment.liked);
      })
      .catch((error) => console.error(error));
  };

  const likeComment = () => {
    axiosInstance
      .put(`posts/${props.post.id}/comments/${props.comment.id}`, {
        action: "upvote",
      })
      .then(() => {
        updateCommentUpvotes();
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
    navigate(`/user_profile/${singleComment.author}/`);
  };

  const getLikesUsersListComment = (setLikesUsersList) => {
    axiosInstance
      .get(`posts/${props.post.id}/comments/${props.comment.id}`)
      .then((res) => {
        setLikesUsersList(res.data.comment.upvotes);
      })
      .catch((error) => console.error(error));
  };

  const togglerID = "toggler" + singleComment.id;
  const HashtagTogglerId = "#toggler" + singleComment.id;

  // return (
  //   <div className="singleComment" key={singleComment.id}>
  //     <Row>
  //       <Col
  //         xs="2"
  //         style={{
  //           height: "3rem",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "flex-start",
  //         }}
  //       >
  //         <Gravatar
  //           email={posterEmail}
  //           size={30}
  //           onClick={navigateToProfile}
  //           style={{
  //             borderRadius: "50px",
  //             marginTop: "0rem",
  //             marginBottom: "0rem",
  //           }}
  //         />
  //       </Col>
  //       <Col
  //         xs="7"
  //         style={{
  //           height: "3rem",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //       >
  //         <CommentLineBox>
  //           <h6> {singleComment.content} </h6>
  //         </CommentLineBox>
  //       </Col>
  //       <Col xs="3" style={{ display: "flex", justifyContent: "flex-end" }}>
  //         <Button
  //           data-testid={"comment-reply-button"}
  //           id={togglerID}
  //           style={{
  //             background: commentsVisibility ? "#653FFD" : "#ffffff",
  //             color: commentsVisibility ? "#ffffff" : "#653FFD",
  //             borderColor: "#653FFD",
  //           }}
  //           onclick={changeCommentsVisibility}
  //         >
  //           <CommentIcon style={{ fontSize: "small" }} />
  //         </Button>
  //         &nbsp;
  //         <Button
  //           data-testid={"comment-like-button"}
  //           style={{
  //             background: likedByUser ? "#653FFD" : "#ffffff",
  //             color: likedByUser ? "#ffffff" : "#653FFD",
  //             borderColor: "#653FFD",
  //           }}
  //           onClick={likeComment}
  //         >
  //           <ThumbUp style={{ fontSize: "small" }} />
  //         </Button>
  //         &nbsp;
  //         <Button
  //           style={{
  //             background: "#653FFD",
  //             color: "#ffffff",
  //             borderColor: "#653FFD",
  //           }}
  //           onClick={changeModalVisibility}
  //         >
  //           {likesCount}
  //           <FavoriteIcon style={{ fontSize: "small" }}></FavoriteIcon>
  //         </Button>
  //         &nbsp;
  //         {singleComment.author === currentUser.id && (
  //           <Button
  //             color="danger"
  //             name={singleComment.id}
  //             data-testid="comment-remove-button"
  //             onClick={(e) => deleteComment(singleComment.id, e)}
  //           >
  //             <DeleteIcon style={{ fontSize: "small" }}></DeleteIcon>
  //           </Button>
  //         )}
  //       </Col>
  //     </Row>

  return (
    <div
      className="singleComment"
      style={{ overflowX: "hidden" }}
      key={singleComment.id}
    >
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
              marginLeft: "2rem",
            }}
          />

          <Col
            xs="7"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            <CommentContent>{singleComment.content}</CommentContent>
          </Col>
          <Col xs="3" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {singleComment.author === currentUser.id && (
                <Button
                  color="danger"
                  name={singleComment.id}
                  data-testid="comment-remove-button"
                  onClick={(e) => deleteComment(singleComment.id, e)}
                >
                  <DeleteIcon style={{ fontSize: "small" }}></DeleteIcon>
                </Button>
              )}
              <Button
                data-testid={"comment-reply-button"}
                id={togglerID}
                style={{
                  background: commentsVisibility ? "#653FFD" : "#ffffff",
                  color: commentsVisibility ? "#ffffff" : "#653FFD",
                  borderColor: "#653FFD",
                }}
                onclick={changeCommentsVisibility}
              >
                <CommentIcon style={{ fontSize: "small" }} />
              </Button>

              <Button
                style={{
                  background: "#653FFD",
                  color: "#ffffff",
                  borderColor: "#653FFD",
                }}
                onClick={changeModalVisibility}
              >
                {likesCount}
                <FavoriteIcon style={{ fontSize: "small" }}></FavoriteIcon>
              </Button>

              {singleComment.author === currentUser.id && (
                <Button
                  color="danger"
                  name={singleComment.id}
                  data-testid="comment-remove-button"
                  onClick={(e) => deleteComment(singleComment.id, e)}
                >
                  <DeleteIcon style={{ fontSize: "small" }}></DeleteIcon>
                </Button>
              )}
            </div>
          </Col>
        </CommentContainer>
      </Row>
      <Row>
        <UncontrolledCollapse toggler={HashtagTogglerId}>
          <div>
            <hr style={{ marginTop: "0rem" }} />
            <Col xs="2"></Col>
            <Col xs="8">
              <CommentReplyList comment={singleComment} post={props.post} />
            </Col>
          </div>
        </UncontrolledCollapse>
      </Row>

      <Modal
        isOpen={isModalVisible}
        toggle={() => changeModalVisibility()}
        style={{
          left: 0,
          top: 100,
        }}
      >
        <ModalBody style={{ overflowY: "scroll" }}>
          <LikesUsersList
            type="comment"
            getLikesUsersList={getLikesUsersListComment}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
