import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "react-dom";

import Login from "./Login/Login"
import PasswordReset from "./PasswordReset/PasswordReset"
import PasswordResetConfirm from "./PasswordResetConfirm/PasswordResetConfirm"
import Logout from "./Logout/Logout"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";
import Home from "./Home/Home";
import FriendsPage from "./FriendsPage/FriendsPage";
import Hello from "./Hello/Hello"
import ChatWrapper from "./Chat/ChatWrapper.js"
import HomePage from "./HomePage/HomePage";
import Notifications from "./Notifications/Notifications";
import CreateClub from "./CreateClub/CreateClub";
import ListOfClubs from "./ListOfClubs/ListOfClubs";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <React.StrictMode>
          {/* <Header /> */}
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/home' element={<HomePage />}></Route>
            <Route path='/log_in/' element={<Login />}></Route>
            <Route path='/log_out/' element={<Logout />}></Route>
            <Route path='/error/' element={<Error404 />}></Route>
            <Route path='/club_profile/:club_id' element={<ClubProfile />}></Route>
            <Route path='/sign_up/' element={<SignUp />}></Route>
            <Route path='/create_club/' element={<CreateClub />}></Route>
            <Route path='/notifications/' element={<Notifications />}></Route>
            <Route path='/friends_page/' element={<FriendsPage />}></Route>
            <Route path='/hello/' element={<Hello />}></Route>
            <Route path='/password_reset/' element={<PasswordReset />}></Route>
            <Route path='/password_reset_confirm/:uid/:token' element={<PasswordResetConfirm />} />
            <Route path="/chat/:chatID/" element={<ChatWrapper />}></Route>
            <Route path="/all_clubs/" element={<ListOfClubs />}></Route>
          </Routes>
          {/* <Footer /> */}
        </React.StrictMode>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
