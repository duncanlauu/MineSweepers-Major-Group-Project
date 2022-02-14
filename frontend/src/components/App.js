import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = '/'><p>This is the home page</p></Route>
          <Route path = '/log_in/' element={<LoginPage />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);

//           <Route path = '/log_in' component={LoginPage}/>