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
    SuggestedUserContainer
} from "./UserProfileElements";
import MainNav from "../Nav/MainNav";
import PersonalPostList from "./PersonalPostList";
import FriendsList from "./FriendsList";
import FriendRequestList from "./FriendRequestList";
import SuggestedUserList from "./SuggestedUserList";
import {useNavigate} from "react-router";
import ProfileInfo from "./ProfileInfo";
import { useParams } from "react-router";
import axiosInstance from "../../axios";
import UserProfileEditor from "./UserProfileEditor";
import PersonalPostForm from "./PersonalPostForm";
import BookRatingList from "./BookRatingList";

const UserProfile = () => {

    const [currentActiveTab, setCurrentActiveTab] = useState("1");
    const navigate = useNavigate()

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab)
        }
    }

    return (
        <div>
            <Container fluid>
                <Row style={{marginBottom: "3rem"}}>
                    <MainNav/>
                </Row>

                <Row style={{marginTop: "6rem"}}>
                    <Col xs="3">
                        <ProfileInfo/>
                    </Col>

          <Col xs="6">
            <DataContainer>
              <DataContainerCard>
                <Nav tabs style={{
                    marginBottom: "1rem",
                    width: "100%",
                    marginTop: "1rem",
                    borderRadius: "100px",
                  }}
                >
                  <NavItem style={{ width: "33%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "1",
                      })}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <TabsText>
                            Posts
                        </TabsText>
                      </div>
                    </NavLink>
                  </NavItem>

                  <NavItem style={{ width: "33%" }}>
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

                  <NavItem style={{ width: "33%" }}>
                    <NavLink
                      className={classnames({
                        active: currentActiveTab === "3",
                      })}
                      onClick={() => {
                        toggle("3");
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
                      <PersonalPostList/>
                    </TabPane>

                    <TabPane tabId="2">
                        <FriendRequestList/>

                        <FriendListContainer>
                            <FriendsList/>
                        </FriendListContainer>
                    </TabPane>

                    <TabPane tabId="3">
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
                                <SuggestedUserList/>
                            </SuggestedUserContainer>
                        </FriendRecommenderContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserProfile