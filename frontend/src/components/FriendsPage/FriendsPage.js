import React, { Component, useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Container, Row, Col, Navbar, NavbarBrand, Button, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames';
// import {Box, Tab, Tabs, TabPanel} from '@mui/material/Button';
import { FriendsListContainer, NonFriendsListContainer, FriendsRequestContainer, UserDetailsContainer } from "./FriendsPageElements";
import Gravatar from 'react-gravatar';

import axiosInstance from '../../axios'
import { useNavigate } from "react-router";
import FriendList from "../FriendList/FriendList";
import FriendRequests from "./FriendRequests";
import NonFriendList from "./NonFriendList";



export default function FriendsPage() {

  const navigate = useNavigate(); // for test purpose if axios works

  // const [myFriendRequests, setFriendRequests] = useState("");

  // useEffect(() => {
  //   getAllFriendRequests();
  // }, []);

  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  const toggle = (tab) => {
    if (currentActiveTab !== tab) {
      setCurrentActiveTab(tab)
    }
  }


  return (
    <div id="ParentDiv">

      <Row>
        <Navbar color="light" expand="md" light>
          <NavbarBrand href="/">
            <h1> bookgle </h1>
          </NavbarBrand>
        </Navbar>
      </Row>

      <Container fluid>
        <Row style={{ marginTop: "6rem" }}>
          <Col />
          <Col>

            <Row>
              <Col>
                <Gravatar email='user@example.com' size={170} style={{ borderRadius: "100px", marginLeft: "1rem", marginBottom: "1rem" }} />
              </Col>
            </Row>

            <Row>
              <h1> JaneDoe </h1>
              <h4> janedoe@example.com </h4>
            </Row>

            <Row>
              <UserDetailsContainer>
                <h5> London, UK </h5>
                <h5> Date joined </h5>
              </UserDetailsContainer>
            </Row>

          </Col>


          <Col>

            <div>
              <Nav tabs> 
                <NavItem>
                  <NavLink className={classnames({active: currentActiveTab === "1"})} onClick={() => {toggle("1");}}>
                      Profile
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={classnames({active: currentActiveTab === "2"})} onClick={() => {toggle("2");}}>
                      Books
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={classnames({active: currentActiveTab === "3"})} onClick={() => {toggle("3");}}>
                      Friends
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={classnames({active: currentActiveTab === "4"})} onClick={() => {toggle("4");}}>
                      Posts
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink className={classnames({active: currentActiveTab === "5"})} onClick={() => {toggle("5");}}>
                      Find friends
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={currentActiveTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 1 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
                
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 2 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
                
                <TabPane tabId="3">
                  
                  {/* FriendPage content */}


                    <h1> Friends Page </h1>
                    
                      <FriendsRequestContainer>
                        <p> Here are your friend requests</p>
                        <FriendRequests />
                      </FriendsRequestContainer>


                      <FriendsListContainer>
                        <FriendList />
                      </FriendsListContainer>

                    </TabPane>

                    <TabPane tabId="4">
                      <Row>
                        <Col sm="12">
                          <h5>Sample Tab 4 Content</h5>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="5">

                      <NonFriendsListContainer>
                        <NonFriendList />
                      </NonFriendsListContainer>

                    </TabPane>
                  </TabContent>
                </div>

        

          </Col>
          <Col />
        </Row>
      </Container>

    </div>

  );
}