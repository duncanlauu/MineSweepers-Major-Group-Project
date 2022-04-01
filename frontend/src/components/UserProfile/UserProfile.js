import React, { Component, useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardGroup,
  Modal,
  ModalBody,
} from "reactstrap";
import classnames from "classnames";
import Gravatar from "react-gravatar";
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
import FriendRequestList from "./Friends/FriendRequestList";
import SuggestedUserList from "./SuggestedUsers/SuggestedUserList";
import { useNavigate } from "react-router";
import ProfileInfo from "./ProfileInfo";
import BookRatingList from "./BookRatings/BookRatingList";
import ClubList from "./Clubs/ClubList";

const UserProfile = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const navigate = useNavigate();
  const currrentUser = JSON.parse(localStorage.getItem("user"));

  const toggle = (tab) => {
    if (currentActiveTab !== tab) {
      setCurrentActiveTab(tab);
    }
  };

  return (
    <div>
      <Container fluid>
        <Row style={{ marginBottom: "3rem" }}>
          <MainNav />
        </Row>

        <Row style={{ marginTop: "6rem" }}>
          <Col xs="3">
            <ProfileInfo />
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
                  <NavItem style={{ width: "20%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "1",
                      })}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <TabsText>Posts</TabsText>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem style={{ width: "20%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "2",
                      })}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <TabsText>Friends</TabsText>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem style={{ width: "20%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "3",
                      })}
                      onClick={() => {
                        toggle("3");
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <TabsText>Clubs</TabsText>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem style={{ width: "40%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "4",
                      })}
                      onClick={() => {
                        toggle("4");
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <TabsText>Book ratings</TabsText>
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>

                <DataContainerBelowTabs>
                  <TabContent activeTab={currentActiveTab}>
                    <TabPane tabId="1">
                      <PersonalPostList />
                    </TabPane>

                    <TabPane tabId="2">
                      <FriendRequestList />

                      <FriendListContainer>
                        <FriendsList />
                      </FriendListContainer>
                    </TabPane>

                    <TabPane tabId="3">
                      <ClubList requestedUser_id={currrentUser.id} />
                    </TabPane>

                    <TabPane tabId="4">
                      <BookRatingList />
                    </TabPane>
                  </TabContent>
                </DataContainerBelowTabs>
              </DataContainerCard>
            </DataContainer>
          </Col>

          <Col xs="3">
            <FriendRecommenderContainer>
              <SuggestedUserContainer>
                <SuggestedUserList />
              </SuggestedUserContainer>
            </FriendRecommenderContainer>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;
