import React from "react";
import { Route, Routes } from "react-router-dom";

import Chat from "./components/Chat";

const BaseRouter = () => (
  <div>
    <Routes>
      <Route exact path="/:chatID/" component={Chat} />
    </Routes>
  </div>
);

export default BaseRouter;
