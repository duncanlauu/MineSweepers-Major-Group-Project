import React from 'react';
import { useParams } from 'react-router-dom';

import Chat from './Chat';
import Profile from './Profile';
import Sidepanel from './Sidepanel';

export default function ChatWrapper() {


    let params = useParams();

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