// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import BaseRouter from '../routes';
import Sidepanel from './Sidepanel';
import Profile from './Profile';
import { Route, Routes } from "react-router-dom";

class Dummy extends React.Component {

    render() {
        return(
          <div id="frame">
            <Sidepanel />
            <div className="content">
              <Profile />
            </div>
          </div>
        );
    };
}

export default Dummy
