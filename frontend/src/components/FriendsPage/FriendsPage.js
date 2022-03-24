// import React, { Component, useState, useEffect } from "react";
// import { Link } from 'react-router-dom'
// import { Container, Row, Col, Button, Card, CardGroup, CardBody, CardTitle, Navbar, NavbarBrand, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
// import classnames from 'classnames';
// // import {Box, Tab, Tabs, TabPanel} from '@mui/material/Button';
// import { FriendsListContainer, NonFriendsListContainer, FriendsRequestContainer, UserDetailsContainer, PostsContainer } from "./FriendsPageElements";
// import Gravatar from 'react-gravatar';

// import { useNavigate } from "react-router";
// import FriendList from "./FriendList";
// import FriendRequests from "./FriendRequests";
// import NonFriendList from "./NonFriendList";
// import useGetUser from "../../helpers";
// import PersonalPostForm from "./PersonalPostForm";
// import {Nav as MainNav} from "../Nav/Nav";
// import PersonalPostList from "./PersonalPostList";


// export default function FriendsPage() {

//   const navigate = useNavigate(); // for test purpose if axios works

//   const currentUser = useGetUser();
//   console.log("Buenos Dias")
//   console.log("Current user logged in: " + currentUser.id)

//   const [currentActiveTab, setCurrentActiveTab] = useState("1");

//   const toggle = (tab) => {
//     if (currentActiveTab !== tab) {
//       setCurrentActiveTab(tab)
//     }
//   }

//   const tabsStyle = {
//     marginBottom: "1rem",
//     width: "70rem",
//     marginTop: "1rem",
//   };

//   return (
//     <div id="ParentDiv">

//       <Row>
//         <Navbar color="light" expand="md" light>
//           <NavbarBrand href="/">
//             <h1> bookgle </h1>
//           </NavbarBrand>
//         </Navbar>
//       </Row>



//       {/* <Row style={{ marginBottom: "3rem" }}>
//           <MainNav />
//       </Row> */}

//       <Container fluid>
//         <Row style={{ marginTop: "6rem" }}>
//           <Col />
//           <Col>

//             <Row>
//               <Col>
//                 <Gravatar email='user@example.com' size={170} style={{ borderRadius: "100px", marginLeft: "1rem", marginBottom: "1rem" }} />
//               </Col>
//             </Row>

//             <Row>
//               <h1> {currentUser.username}  </h1>
//               <h4> {currentUser.email} </h4>
//             </Row>

//             <Row>
//               <UserDetailsContainer>
//                 <h5> From: {currentUser.location} </h5>
//                 <h5> Joined: {currentUser.created_at} </h5>
//               </UserDetailsContainer>
//             </Row>

//           </Col>


//           <Col>

//             <div>
//               <Nav tabs style={tabsStyle}> 
//               {/* <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "1"})} onClick={() => {toggle("1");}}>
//                       <h5> Feed </h5>
                      
//                   </NavLink>
//                 </NavItem> */}

//                 {/* <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "2"})} onClick={() => {toggle("2");}}>
//                      <h5> Books </h5>
//                   </NavLink>
//                 </NavItem> */}

//                 <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "1"})} onClick={() => {toggle("1");}}>
//                       <h5> Posts </h5>
//                   </NavLink>
//                 </NavItem>

//                 <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "2"})} onClick={() => {toggle("2");}}>
//                       <h5> Friends </h5>
//                   </NavLink>
//                 </NavItem>

//                 <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "3"})} onClick={() => {toggle("3");}}>
//                       <h5> Find friends </h5>
//                   </NavLink>
//                 </NavItem>

//                 <NavItem>
//                   <NavLink className={classnames({active: currentActiveTab === "4"})} onClick={() => {toggle("4");}}>
//                       <h5> Add Post </h5>
//                   </NavLink>
//                 </NavItem>
//               </Nav>

              
//               <TabContent activeTab={currentActiveTab}>
                
//                 <TabPane tabId="1">
//                       <h1> My Posts </h1>
//                       {/* <PostsContainer>
//                         <PersonalPosts /> 
//                       </PostsContainer> */}

//                       {/* <CardGroup>
//                         <PersonalPosts /> 
//                       </CardGroup> */}

//                       <CardGroup>
//                         <PersonalPostList/>
//                       </CardGroup>

//                     </TabPane>
                
//                 <TabPane tabId="2">

//                     <h3> Friend Requests </h3>
                    
//                       <FriendsRequestContainer>
//                         <FriendRequests />
//                       </FriendsRequestContainer>

//                       <h3> Friends </h3>

//                       <FriendsListContainer>
//                         <FriendList />
//                       </FriendsListContainer>

//                     </TabPane>

//                 <TabPane tabId="3">
                      
//                       <NonFriendsListContainer>
//                         <NonFriendList />
//                       </NonFriendsListContainer>

//                 </TabPane>

//                 <TabPane tabId="4">

//                       <PostsContainer>
//                         <PersonalPostForm />
//                       </PostsContainer>

//                 </TabPane>
//               </TabContent>
//             </div>

//           </Col>
//           <Col />
//         </Row>
//       </Container>

//     </div>

//   );
// }