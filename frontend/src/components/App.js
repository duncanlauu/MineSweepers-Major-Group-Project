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
import Hello from "./Hello/Hello"

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
            <Route path='/home' element={<Home />}></Route>
            <Route path='/log_in/' element={<Login />}></Route>
            <Route path='/log_out/' element={<Logout />}></Route>
            <Route path='/error/' element={<Error404 />}></Route>
            <Route path='/club_profile/' element={<ClubProfile />}></Route>
            <Route path='/sign_up/' element={<SignUp />}></Route>
            <Route path='/hello/' element={<Hello />}></Route>
            <Route path='/password_reset/' element={<PasswordReset />}></Route>
            <Route path='/password_reset_confirm/:uid/:token' element={<PasswordResetConfirm />} />
          </Routes>
          {/* <Footer /> */}
        </React.StrictMode>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
