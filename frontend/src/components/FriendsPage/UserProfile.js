import React, {useState, useEffect} from "react";
import {Container, Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane, CardGroup} from 'reactstrap'
import classnames from 'classnames';
import Gravatar from 'react-gravatar';
import useGetUser from "../../helpers";
import {
    DataContainer,
    DataContainerCard,
    DataContainerBelowTabs,
    FriendRecommenderContainer,
    ProfileInfoCard,
    ProfileInfoContainer,
    ProfileInfoDetails,
    FriendListContainer,
    TabsText,
    SuggestedUserContainer
} from "./UserProfileElements";
import MainNav from "../Nav/MainNav";
import PersonalPostList from "./PersonalPostList";
import FriendsList from "./FriendsList";
import FriendRequestList from "./FriendRequestList";
import SuggestedUserList from "./SuggestedUserList";
import {useParams} from 'react-router';
import axiosInstance from '../../axios';
import {useNavigate} from "react-router";
import BookRatingList from "./BookRatingList";

const UserProfile = () => {

    const [currentUser, setCurrentUser] = useState(useGetUser())
    const [currentActiveTab, setCurrentActiveTab] = useState("1");
    const {user_id} = useParams();
    const currentLoggedInUser = useGetUser()
    const navigate = useNavigate()
    const [setIsLoggedInUser] = useState(true)

    useEffect(() => {
        if (user_id === currentLoggedInUser.id || user_id === undefined || user_id === "") {
            console.log("So user_id is " + user_id + " and currentLoggedInUser.id is " + currentLoggedInUser.id)
            axiosInstance.get('/get_current_user/')
                .then(res => {
                    console.log(res);
                    setCurrentUser(res.data)
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            console.log("So user_id is " + user_id + " and currentLoggedInUser.id is " + currentLoggedInUser.id)
            axiosInstance
                .get(`user/get_update/${user_id}`)
                .then(res => {
                    if (res.data.id == null) {
                        navigate('/error/')
                    }
                    setCurrentUser(res.data)
                    setIsLoggedInUser(false)
                })
                .catch(err => {
                    console.log(err);
                    navigate('/error/')
                })
        }
    }, [])

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab)
        }
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

    return (
        <div>
            <Container fluid>
                <Row style={{marginBottom: "3rem"}}>
                    <MainNav/>
                </Row>

                <Row style={{marginTop: "6rem"}}>
                    <Col xs="3">
                        <ProfileInfoContainer>
                            <ProfileInfoCard>
                                <Row style={{justifyContent: "center"}}>
                                    <Col xs="8">
                                        <Gravatar email={currentUser.email} size={150} style={{
                                            borderRadius: "50px",
                                            marginTop: "1rem",
                                            marginBottom: "1rem"
                                        }}
                                        />
                                    </Col>
                                </Row>

                                <Row style={{justifyContent: "center", marginTop: "1rem"}}>
                                    <ProfileInfoDetails>
                                        <Row style={{justifyContent: "center", marginTop: "1rem"}}>
                                            <div style={{textAlign: "center", borderBottomStyle: "dotted"}}>
                                                <h3><b>{currentUser.first_name} {currentUser.last_name} </b></h3>
                                                <h4><b> <i> @{currentUser.username} </i></b></h4>
                                            </div>
                                        </Row>

                                        {user_id !== undefined &&
                                        <Row style={{display: "flex", justifyContent: "center", marginBottom: "1rem"}}>
                                            <Button color="primary" onClick={(e) => postFriendRequest(currentUser.id)}
                                                    style={{height: "4rem", width: "8rem"}}
                                            >
                                                <p> Follow </p>
                                            </Button>
                                            <Button onClick={(e) => cancelFriendRequest(currentUser.id)}
                                                    style={{height: "4rem", width: "4rem"}}
                                            >
                                                <p> X </p>
                                            </Button>
                                        </Row>
                                        }

                                        <Row>
                                            <div style={{textAlign: "center"}}>
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
                    </Col>

                    <Col xs="6">
                        <DataContainer>
                            <DataContainerCard>
                                <Nav tabs style={{
                                    marginBottom: "1rem",
                                    width: "100%",
                                    marginTop: "1rem",
                                    borderRadius: "100px"
                                }}
                                >
                                    <NavItem style={{width: "33%"}}>
                                        <NavLink className={classnames({active: currentActiveTab === "1"})}
                                                 onClick={() => {
                                                     toggle("1");
                                                 }}>
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>
                                                    Posts
                                                </TabsText>
                                            </div>

                                        </NavLink>
                                    </NavItem>

                                    <NavItem style={{width: "33%"}}>
                                        <NavLink className={classnames({active: currentActiveTab === "2"})}
                                                 onClick={() => {
                                                     toggle("2");
                                                 }}>
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>
                                                    Friends
                                                </TabsText>
                                            </div>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem style={{width: "33%"}}>
                                        <NavLink className={classnames({active: currentActiveTab === "3"})}
                                                 onClick={() => {
                                                     toggle("3");
                                                 }}>
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>
                                                    Book ratings
                                                </TabsText>
                                            </div>
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <DataContainerBelowTabs>
                                    <TabContent activeTab={currentActiveTab}>
                                        <TabPane tabId="1">
                                            <PersonalPostList requestedUser_id={user_id}/>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            {user_id == undefined &&
                                            <FriendRequestList/>
                                            }

                                            <FriendListContainer>
                                                <FriendsList requestedUser_id={user_id}/>
                                            </FriendListContainer>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            {user_id == undefined ? <BookRatingList/>
                                                : <BookRatingList requestedUser_id={user_id}/>}
                                        </TabPane>
                                    </TabContent>
                                </DataContainerBelowTabs>
                            </DataContainerCard>
                        </DataContainer>
                    </Col>

                    <Col xs="3">
                        <FriendRecommenderContainer>
                            {/* <NonFriendList /> */}
                            <SuggestedUserContainer>
                                <SuggestedUserList/>
                            </SuggestedUserContainer>
                        </FriendRecommenderContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default UserProfile;
