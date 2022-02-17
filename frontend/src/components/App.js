import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login/Login"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";
import Dummy from "./Dummy";


import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import BaseRouter from '../routes';
import Sidepanel from './Sidepanel';
import Profile from './Profile';


class App extends React.Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <BrowserRouter>
        <React.StrictMode>
          {/* <Header /> */}
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/log_in/' element={<Login />}></Route>
            {/* <Route path = '/loginnew/' element={<LoginPage />}></Route> */}
            <Route path='/error/' element={<Error404 />}></Route>
            <Route path='/club_profile/' element={<ClubProfile />}></Route>
            <Route path='/sign_up/' element={<SignUp />}></Route>
            <Route path='/dummy2/' element={<Dummy />}></Route>
          </Routes>
          {/* <Footer /> */}
        </React.StrictMode>
      </BrowserRouter>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(null, mapDispatchToProps)(App);
