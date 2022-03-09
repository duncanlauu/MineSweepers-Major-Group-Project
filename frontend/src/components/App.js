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
import Layout from "./Layout/Layout";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./RequireAuth/RequireAuth";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <React.StrictMode>
            <Routes>
              <Route path='/' element={<Layout />}>
                {/* public routes */}
                <Route path='' element={<LandingPage />}></Route>
                <Route path='log_in' element={<Login />}></Route>
                <Route path='sign_up' element={<SignUp />}></Route>
                <Route path='password_reset' element={<PasswordReset />}></Route>
                <Route path='password_reset_confirm/:uid/:token' element={<PasswordResetConfirm />} />
                {/* <Route path='unauthorized' element={<Unauthorized />}></Route> */}

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path='home' element={<HomePage />}></Route>
                  <Route path='log_out' element={<Logout />}></Route>
                  <Route path='club_profile' element={<ClubProfile />}></Route>
                  <Route path='create_club' element={<CreateClub />}></Route>
                  <Route path='notifications' element={<Notifications />}></Route>
                  <Route path='friends_page' element={<FriendsPage />}></Route>
                  <Route path='hello' element={<Hello />}></Route>
                  <Route path="chat/:chatID" element={<ChatWrapper />}></Route>
                </Route>

                {/* catch all */}
                <Route path='*' element={<Error404 />} />
                <Route path='error' element={<Error404 />}></Route>
                {/* not sure what to do with error */}
              </Route>
            </Routes>
          </React.StrictMode>
        </BrowserRouter>
      </AuthProvider>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
