import React from 'react';
// import useParams from "react-router-dom";
import { useParams } from 'react-router-dom';

import Chat from './Chat';
import Profile from './Profile';
import Sidepanel from './Sidepanel';
import useGetUser from '../helpers';

export default function ChatWrapper() {


    let params = useParams();
    
    //use react hook to get user and then return

    return (
      <div id="frame">
        <Sidepanel />
        <div className="content">
          <Profile />
          <Chat chatID={params.chatID} />
        </div>
      </div>
    );
}
