import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login/Login"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = '/' element={<LandingPage />}></Route>
          <Route path = '/log_in/' element={<Login />}></Route>
          <Route path = '/error/' element={<Error404 />}></Route>
          <Route path = '/club_profile/' element={<ClubProfile />}></Route>
          <Route path = '/sign_up/' element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);