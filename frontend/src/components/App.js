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
import FriendsPage from "./FriendsPage/FriendsPage";
import Hello from "./Hello/Hello"
import ChatWrapper from "./Chat/ChatWrapper.js"
import HomePage from "./HomePage/HomePage";
import Notifications from "./Notifications/Notifications";
import CreateClub from "./CreateClub/CreateClub";
import Layout from "./Layout/Layout";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./RequireAuth/RequireAuth";
import Scheduling from "./Scheduling/Scheduling";
import Meetings from "./Meetings/Meetings";
import ClubRecommendationPage from "./ClubRecommendations/ClubRecommendationsPage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                {/* public routes */}
                <Route path='/' element={<LandingPage/>}/>
                <Route path='log_in' element={<Login/>}/>
                <Route path='sign_up' element={<SignUp/>}/>
                <Route path='password_reset' element={<PasswordReset/>}/>
                <Route path='password_reset_confirm/:uid/:token' element={<PasswordResetConfirm />} />
                {/* <Route path='unauthorized' element={<Unauthorized />}></Route> */}

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path='home' element={<HomePage/>}/>
                  <Route path='log_out' element={<Logout/>}/>
                  <Route path='club_profile/:club_id' element={<ClubProfile />}></Route>
                  <Route path='create_club' element={<CreateClub/>}/>
                  <Route path='notifications' element={<Notifications/>}/>
                  <Route path='friends_page' element={<FriendsPage/>}/>
                  <Route path="chat/:chatID" element={<ChatWrapper/>}/>
                  <Route path="/chat/" element={<ChatWrapper/>}/>
                  <Route path='hello' element={<Hello/>}/>
                  <Route path="/scheduling/" element={<Scheduling/>}/>
                  <Route path="/meetings/" element={<Meetings/>}/>
                  <Route path='recommend_clubs' element={<ClubRecommendationPage/>}/>
                </Route>

                {/* catch all */}
                <Route path='error' element={<Error404/>}/>
                <Route path='*' element={<Error404 />} />
                {/* not sure what to do with error */}
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
