{/*
import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login/Login"
import ClubProfile from "./ClubProfile/ClubProfile";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import SignUp from "./SignUp/SignUp";
import Dummy from "./Dummy";

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
          <Route path = '/dummy2/' element={<Dummy />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
*/}

// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ

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
        return(
          <BrowserRouter>
            <Routes>
              <Route path = '/' element={<LandingPage />}></Route>
              <Route path = '/log_in/' element={<Login />}></Route>
              <Route path = '/error/' element={<Error404 />}></Route>
              <Route path = '/club_profile/' element={<ClubProfile />}></Route>
              <Route path = '/sign_up/' element={<SignUp />}></Route>
              <Route path = '/dummy2/' element={<Dummy />}></Route>
            </Routes>
          </BrowserRouter>

            /*<BrowserRouter>
                <div id="frame">
                    <Sidepanel />
                    <div className="content">
                        <Profile />
                          <BaseRouter />
                    </div>
                </div>
            </BrowserRouter>*/
        );
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
}

export default connect(null, mapDispatchToProps)(App);
