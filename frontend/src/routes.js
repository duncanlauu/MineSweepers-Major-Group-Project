import React from "react";
import { Route, Routes } from "react-router-dom";
import Hoc from './hoc/hoc';

import Chat from "./components/Chat";

const BaseRouter = () => (
  <Hoc>
    <Routes>
      <Route exact path="/:chatID/" element={<Chat />} />
    </Routes>
  </Hoc>
);

export default BaseRouter;
