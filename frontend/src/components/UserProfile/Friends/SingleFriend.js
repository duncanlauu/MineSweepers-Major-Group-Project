import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import { Row, Col, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import {
  FriendLine,
  UserNameContainer,
  UserNameText,
} from "../UserProfileElements";
import { useNavigate } from "react-router";

export default function SingleFriend(props) {
  const [currentFriend, setCurrentFriend] = useState("");

  useEffect(() => {
    setCurrentFriend(props.friend);
  }, []);

  const navigate = useNavigate();

  const deleteFriend = (id, e) => {
    axiosInstance
      .delete(`friends/${id}`)
      .then((res) => {
        console.log(res);
        props.updatePageAfterDeletion();
      })
      .catch((error) => console.error(error));
  };

  const navigateToProfile = () => {
    navigate(`/user_profile/${currentFriend.id}/`);
    window.location.reload();
  };

  return (
    <div
      className="friend"
      key={currentFriend.id}
      style={{ marginBottom: "1rem", marginTop: "1rem" }}
    >
      <FriendLine>
        <Row style={{ height: "5rem" }}>
          <Col xs="2">
            <Gravatar
              email={currentFriend.email}
              size={50}
              onClick={navigateToProfile}
              style={{
                borderRadius: "50px",
                marginBottom: "1rem",
              }}
            />
          </Col>
          <Col
            xs="8"
            style={{
              height: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserNameContainer onClick={navigateToProfile}>
              <UserNameText>{currentFriend.username}</UserNameText>
            </UserNameContainer>
          </Col>
          {props.requestedUser_id == undefined && (
            <Col xs="2" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ borderRadius: "20px", height: "5rem" }}
                name={currentFriend.id}
                onClick={(e) => deleteFriend(currentFriend.id, e)}
              >
                X
              </Button>
            </Col>
          )}
        </Row>
      </FriendLine>
    </div>
  );
}
