import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, ModalBody } from "reactstrap";
import Gravatar from "react-gravatar";
import {
  ProfileInfoCard,
  ProfileInfoContainer,
  ProfileInfoDetails,
} from "./UserProfileElements";
import UserProfileEditor from "./UserProfileEditor";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router";
import LocationCity from "@mui/icons-material/LocationCity";
import AssignmentInd from "@mui/icons-material/AssignmentInd";

export default function ProfileInfo(props) {
  const retrievedCurrentUser = JSON.parse(localStorage.getItem('user'));
  const [currentUser, setCurrentUser] = useState("");
  const [isModalVisible, setModalVisibility] = useState();
  const [isLoggedInUser, setIsLoggedInUser] = useState();
  const [rerenderToggle, setRerenderToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(props)
    console.log(retrievedCurrentUser.id)
    if (typeof retrievedCurrentUser.id != "undefined") {
      if (props.otherUserID !== undefined) {
        // edge case when user clicks on oneself.
        if (props.otherUserID == retrievedCurrentUser.id) {
          navigate("/user_profile");
        } else {
          getCurrentUser(props.otherUserID);
          setIsLoggedInUser(false);
        }
      } else {
        setCurrentUser(retrievedCurrentUser);
        setIsLoggedInUser(true);
      }
    }
  }, []);

  const getCurrentUser = (id) => {
    axiosInstance
      .get(`user/get_update/${id}`)
      .then((res) => {
        if (res.data.id == null) {
          navigate("/error/");
        }
        setCurrentUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error/");
      });
  };

  const changeModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

  const postFriendRequest = (receiver, e) => {
    axiosInstance.post("friend_requests/", {
      other_user_id: receiver,
    });
  };

  const cancelFriendRequest = (receiver, e) => {
    axiosInstance.delete("friend_requests/", {
      data: {
        other_user_id: receiver,
        action: "cancel",
      },
    });
  };

  const deleteFriend = (id, e) => {
    axiosInstance
      .delete(`friends/${id}`)
      .then((res) => {
        console.log(res);
        props.updatePageAfterDeletion();
      })
      .catch((error) => console.error(error));
  };

  const displayFriends = (e) => {
    return (
      <div>
        <ProfileInfoContainer>
          <ProfileInfoCard>
            <Row style={{ justifyContent: "center" }}>
              <Col xs="6">
                <Gravatar
                  email={currentUser.email}
                  size={150}
                  style={{
                    borderRadius: "50px",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                />
              </Col>
            </Row>

            <Row style={{ justifyContent: "center", marginTop: "1rem" }}>
              <ProfileInfoDetails>
                <Row style={{ justifyContent: "center", marginTop: "1rem" }}>
                  <div
                    style={{ textAlign: "center", borderBottomStyle: "dotted" }}
                  >
                    <h3>
                      <b>
                        {currentUser.first_name} {currentUser.last_name}{" "}
                      </b>
                    </h3>
                    <h4>
                      <b>
                        {" "}
                        <i> @{currentUser.username} </i>
                      </b>
                    </h4>
                  </div>
                </Row>

                {isLoggedInUser === false && (
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {currentUser.user_is_friends === true &&
                      currentUser.user_sent_request === false && (
                        <Button
                          onClick={(e) => {
                            deleteFriend(currentUser.id);
                            window.location.reload();
                          }}
                          style={{
                            backgroundColor: "#ECECEC",
                            color: "#653FFD",
                            fontFamily: "Source Sans Pro",
                            fontWeight: "500",
                            fontSize: "15px",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "80%",
                          }}
                        >
                          Following
                        </Button>
                      )}

                    {currentUser.user_is_friends === false &&
                      currentUser.user_sent_request === true && (
                        <Button
                          onClick={(e) => {
                            cancelFriendRequest(currentUser.id);
                            window.location.reload();
                          }}
                          style={{
                            backgroundColor: "#ECECEC",
                            color: "#653FFD",
                            fontFamily: "Source Sans Pro",
                            fontWeight: "500",
                            fontSize: "15px",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "80%",
                          }}
                        >
                          Requested
                        </Button>
                      )}

                    {currentUser.user_is_friends === false &&
                      currentUser.user_sent_request === false && (
                        <Button
                          onClick={(e) => {
                            postFriendRequest(currentUser.id);
                            window.location.reload();
                          }}
                          style={{
                            backgroundColor: "#653FFD",
                            fontFamily: "Source Sans Pro",
                            fontWeight: "500",
                            fontSize: "15px",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "80%",
                          }}
                        >
                          Follow
                        </Button>
                      )}
                  </Row>
                )}

                {isLoggedInUser === true && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={() => changeModalVisibility()}
                      style={{
                        backgroundColor: "#653FFD",
                        fontFamily: "Source Sans Pro",
                        fontWeight: "500",
                        fontSize: "15px",
                        alignItems: "center",
                        justifyContent: "space-around",
                        width: "80%",
                        marginBottom: "1rem",
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}

                <Row>
                  <div style={{ textAlign: "center" }}>
                    {currentUser.location != "" && (
                      <h5>
                        <LocationCity /> {currentUser.location}
                      </h5>
                    )}
                    {currentUser.bio != "" && (
                      <h5>
                        {" "}
                        <AssignmentInd /> {currentUser.bio}{" "}
                      </h5>
                    )}
                  </div>
                </Row>
              </ProfileInfoDetails>
            </Row>
          </ProfileInfoCard>
        </ProfileInfoContainer>
        <Modal
          isOpen={isModalVisible}
          toggle={() => changeModalVisibility()}
          style={{
            left: 0,
            top: 100,
          }}
        >
          <ModalBody style={{ overflowY: "scroll" }}>
            <UserProfileEditor currentUser={currentUser} />
          </ModalBody>
        </Modal>
      </div>
    );
  };

  return <>{displayFriends(props)}</>;
}
