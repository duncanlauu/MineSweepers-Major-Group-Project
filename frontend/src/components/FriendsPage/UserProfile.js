import React, { Component, useState, useEffect } from "react";
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, CardGroup} from 'reactstrap'
import classnames from 'classnames';
import Gravatar from 'react-gravatar';
import useGetUser from "../../helpers";
import { DataContainer, DataContainerCard, DataContainerBelowTabs, FriendRecommenderContainer, ProfileInfoCard, ProfileInfoContainer, ProfileInfoDetails, FriendListContainer, TabsText } from "./UserProfileElements";
import MainNav from "../Nav/MainNav";
import PersonalPostList from "./PersonalPostList";
import NonFriendList from "./NonFriendList";
import FriendsList from "./FriendsList";
import FriendRequestList from "./FriendRequestList";
import BookRatingsList from "./BookRatingsList";

const UserProfile = () => {

    const currentUser = useGetUser();
    const [currentActiveTab, setCurrentActiveTab] = useState("1");

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
          setCurrentActiveTab(tab)
        }
    }

    return(
        <div>
             <Container fluid>
                <Row style={{ marginBottom: "3rem" }}>
                    <MainNav/>
                </Row>

                <Row style={{ marginTop: "6rem" }}>
                    <Col xs="3">
                        <ProfileInfoContainer>
                            <ProfileInfoCard>
                                <Row style={{justifyContent: "center"}}>
                                    <Col xs="8">
                                        <Gravatar email='user@example.com' size={150} style={{ 
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
                                            <div style={{textAlign : "center", borderBottomStyle: "dotted"}}>
                                                <h3> <b>{currentUser.first_name} {currentUser.last_name} </b></h3>  
                                                <h4> <b> <i> @{currentUser.username} </i></b></h4>  
                                            </div>
                                        </Row>
                                        <Row>
                                            <div style={{textAlign : "center"}}>
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
                                    <NavLink className={classnames({active: currentActiveTab === "1"})} onClick={() => {toggle("1");}}>
                                        <div style={{textAlign: "center"}}>
                                            <TabsText>
                                                Posts 
                                            </TabsText>
                                        </div>

                                    </NavLink>
                                </NavItem>

                                <NavItem style={{width: "33%"}}>
                                    <NavLink className={classnames({active: currentActiveTab === "2"})} onClick={() => {toggle("2");}}>
                                        <div style={{textAlign: "center"}}>
                                            <TabsText>
                                                Friends 
                                            </TabsText>
                                        </div>
                                    </NavLink>
                                </NavItem>

                                <NavItem style={{width: "34%"}}>
                                    <NavLink className={classnames({active: currentActiveTab === "3"})} onClick={() => {toggle("3");}}>
                                        <div style={{textAlign: "center"}}>
                                            <TabsText>
                                                Book Ratings 
                                            </TabsText>
                                        </div>
                                    </NavLink>
                                </NavItem>

                            </Nav>
                            
                            <DataContainerBelowTabs>
                                <TabContent activeTab={currentActiveTab}>
                                    <TabPane tabId="1">
                                        
                                            <CardGroup>
                                                <PersonalPostList/>
                                            </CardGroup>
                                        
                                
                                    </TabPane>

                                    <TabPane tabId="2">
                                        <FriendRequestList/>
                                        
                                        <FriendListContainer>
                                            <FriendsList />
                                        </FriendListContainer>
                                    </TabPane>

                                    <TabPane tabId="3">
                                        
                                        <BookRatingsList />
                                    </TabPane>

                                </TabContent>
                            </DataContainerBelowTabs>
                        </DataContainerCard>
                        </DataContainer>
                    </Col>

                    <Col xs="3">
                        <FriendRecommenderContainer>
                            <h3> Suggested People </h3>
                            <NonFriendList />
                        </FriendRecommenderContainer>
                    </Col>
                </Row>
             </Container>
        </div>
    )
}

export default UserProfile