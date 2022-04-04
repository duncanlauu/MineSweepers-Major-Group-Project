import React, {useState} from "react";
import {
    Container,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames";
import {
    DataContainer,
    DataContainerCard,
    DataContainerBelowTabs,
    FriendRecommenderContainer,
    FriendListContainer,
    TabsText,
    SuggestedUserContainer,
} from "./UserProfileElements";
import MainNav from "../Nav/MainNav";
import PersonalPostList from "./PersonalPosts/PersonalPostList";
import FriendsList from "./Friends/FriendsList";
import SuggestedUserList from "./SuggestedUsers/SuggestedUserList";
import {useParams} from "react-router";
import ProfileInfo from "./ProfileInfo";
import BookRatingList from "./BookRatings/BookRatingList";
import ClubList from "./Clubs/ClubList";

const OtherUserProfile = () => {
    const {user_id} = useParams();
    const [currentActiveTab, setCurrentActiveTab] = useState("1");

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab);
        }
    };

    return (
        <div>
            <Container fluid>
                <Row style={{marginBottom: "3rem"}}>
                    <MainNav/>
                </Row>

                <Row style={{marginTop: "6rem"}}>
                    <Col xs="3" data-testid={"profile-info"}>
                        <ProfileInfo otherUserID={user_id}/>
                    </Col>

                    <Col xs="6">
                        <DataContainer>
                            <DataContainerCard>
                                <Nav
                                    tabs
                                    style={{
                                        marginBottom: "1rem",
                                        width: "100%",
                                        marginTop: "1rem",
                                        borderRadius: "100px",
                                    }}
                                >
                                    <NavItem style={{width: "25%"}}>
                                        <NavLink
                                            className={classnames({
                                                active: currentActiveTab === "1",
                                            })}
                                            onClick={() => {
                                                toggle("1");
                                            }}
                                        >
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>Posts</TabsText>
                                            </div>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem style={{width: "25%"}}>
                                        <NavLink
                                            className={classnames({
                                                active: currentActiveTab === "2",
                                            })}
                                            onClick={() => {
                                                toggle("2");
                                            }}
                                        >
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>Friends</TabsText>
                                            </div>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem style={{width: "25%"}}>
                                        <NavLink
                                            className={classnames({
                                                active: currentActiveTab === "3",
                                            })}
                                            onClick={() => {
                                                toggle("3");
                                            }}
                                        >
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>Club</TabsText>
                                            </div>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem style={{width: "25%"}}>
                                        <NavLink
                                            className={classnames({
                                                active: currentActiveTab === "4",
                                            })}
                                            onClick={() => {
                                                toggle("4");
                                            }}
                                        >
                                            <div style={{textAlign: "center"}}>
                                                <TabsText>Ratings</TabsText>
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
                                            <FriendListContainer>
                                                <FriendsList requestedUser_id={user_id}/>
                                            </FriendListContainer>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <ClubList requestedUser_id={user_id}/>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <BookRatingList requestedUser_id={user_id}/>
                                        </TabPane>
                                    </TabContent>
                                </DataContainerBelowTabs>
                            </DataContainerCard>
                        </DataContainer>
                    </Col>

                    <Col xs="3">
                        <FriendRecommenderContainer>
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

export default OtherUserProfile;
