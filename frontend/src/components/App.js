import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "react-dom";

import Login from "./Login/Login"
import Logout from "./Logout/Logout"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";
import Home from "./Home/Home";
import Hello from "./Hello/Hello"
import Chat from "./Chat.js"
import Chatv2 from "./Chatv2.js"
import ChatWrapper from "./ChatWrapper.js"

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
            <Route path="/chat/:chatID/" element={<ChatWrapper />}></Route>
            <Route path="/chatv2/:chatID/" element={<Chatv2 />}></Route>
          </Routes>
          {/* <Footer /> */}
        </React.StrictMode>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
