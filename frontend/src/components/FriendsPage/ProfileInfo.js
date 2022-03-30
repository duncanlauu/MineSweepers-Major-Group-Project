import React, { useEffect, useState } from "react"
import {
    Row,
    Col,
    Button,
    Modal,
    ModalBody
} from 'reactstrap'
import Gravatar from 'react-gravatar';
import {
    ProfileInfoCard,
    ProfileInfoContainer,
    ProfileInfoDetails,
} from "./UserProfileElements";
import UserProfileEditor from "./UserProfileEditor";
import useGetUser from "../../helpers";
import axiosInstance from '../../axios';
import { useNavigate } from "react-router";

export default function ProfileInfo(props) {

    const retrievedCurrentUser = useGetUser(); // To do
    const [currentUser, setCurrentUser] = useState("")
    const [isModalVisible, setModalVisibility] = useState()
    const [isLoggedInUser, setIsLoggedInUser] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (typeof (retrievedCurrentUser.id) != "undefined") {
            if (props.otherUserID !== undefined) {
                // edge case when user clicks on oneself.
                if (props.otherUserID == retrievedCurrentUser.id) {
                    navigate("/friends_page")
                    // setCurrentUser(retrievedCurrentUser)
                    // setIsLoggedInUser(true)
                } else {
                    getCurrentUser(props.otherUserID)
                    setIsLoggedInUser(false)
                }
            } else {
                setCurrentUser(retrievedCurrentUser)
                setIsLoggedInUser(true)
            }
        }
    }, [retrievedCurrentUser]);

    const getCurrentUser = (id) => {
        axiosInstance
            .get(`user/get_update/${id}`)
            .then(res => {
                if (res.data.id == null) {
                    navigate('/error/')
                }
                setCurrentUser(res.data)
            })
            .catch(err => {
                console.log(err);
                navigate('/error/')
            })
    }

    const changeModalVisibility = () => {
        setModalVisibility(!isModalVisible);
    }

    const postFriendRequest = (receiver, e) => {
        axiosInstance
            .post("friend_requests/", {
                other_user_id: receiver
            })
    }

    const cancelFriendRequest = (receiver, e) => {
        axiosInstance
            .delete("friend_requests/", {
                data: {
                    other_user_id: receiver,
                    action: "cancel"
                }
            })
    }

    const displayFriends = (e) => {
        return (
            <div>
                <ProfileInfoContainer>
                    <ProfileInfoCard>
                        <Row style={{ justifyContent: "center" }}>
                            <Col xs="8">
                                <Gravatar email={currentUser.email} size={150} style={{
                                    borderRadius: "50px",
                                    marginTop: "1rem",
                                    marginBottom: "1rem"
                                }}
                                />
                            </Col>
                        </Row>

                        <Row style={{ justifyContent: "center", marginTop: "1rem" }}>
                            <ProfileInfoDetails>
                                <Row style={{ justifyContent: "center", marginTop: "1rem" }}>
                                    <div style={{ textAlign: "center", borderBottomStyle: "dotted" }}>
                                        <h3><b>{currentUser.first_name} {currentUser.last_name} </b></h3>
                                        <h4><b> <i> @{currentUser.username} </i></b></h4>
                                    </div>
                                </Row>

                                {isLoggedInUser === false &&
                                    <Row style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                                        <Button color="primary" onClick={(e) => postFriendRequest(currentUser.id)}
                                            style={{ height: "4rem", width: "8rem" }}
                                        >
                                            <p> Follow </p>
                                        </Button>
                                        <Button onClick={(e) => cancelFriendRequest(currentUser.id)}
                                            style={{ height: "4rem", width: "4rem" }}
                                        >
                                            <p> X </p>
                                        </Button>
                                    </Row>
                                }

                                {isLoggedInUser === true &&
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button color="primary" onClick={() => changeModalVisibility()}
                                            style={{ borderRadius: "100px", height: "4rem" }}
                                        >
                                            Edit Profile
                                        </Button>
                                    </div>
                                }

                                <Row>
                                    <div style={{ textAlign: "center" }}>
                                        {currentUser.location != "" &&
                                            <h5> From: {currentUser.location} </h5>
                                        }
                                        {currentUser.bio != "" &&
                                            <h5> Bio: {currentUser.bio} </h5>
                                        }
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
                        top: 100
                    }}
                >
                    <ModalBody style={{ overflowY: "scroll" }}>
                        {/* <PersonalPostForm/> */}
                        <UserProfileEditor currentUser={currentUser} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }

    return (
        <>
            {displayFriends(props)}
        </>
    )
}