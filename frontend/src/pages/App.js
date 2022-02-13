import React, { Component } from "react";
import { render } from "react-dom";
import Error404 from "./Error404/Error404";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Error404 />
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);