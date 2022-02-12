import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
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
          <div>yo</div>
            <Router>
                <div id="frame">
                    <Sidepanel />
                    <div className="content">
                        <Profile />
                        <BaseRouter />
                    </div>
                </div>
            </Router>
        );
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
}

export default connect(null, mapDispatchToProps)(App);


//
// import React, { Component } from "react";
// import { render } from "react-dom";
//
// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//     return (
//       <h1>The integration worked, you're not a total failure</h1>
//     );
//   }
// }
//
// const appDiv = document.getElementById("app");
// render(<App />, appDiv);
