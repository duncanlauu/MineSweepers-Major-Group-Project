import React, { Component } from "react";
import { render } from "react-dom";
import Error404 from "./Error404/Error404";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Login/Login";


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LandingPage />
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);