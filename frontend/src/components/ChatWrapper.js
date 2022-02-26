import React from 'react';
// import useParams from "react-router-dom";
import { useParams } from 'react-router-dom';

import Chat from './Chat';

export default function ChatWrapper() {

    let params = useParams()

    return (
        <div>
          <Chat chatID={params.chatID} />
        </div>
    );
}

// export default ChatWrapper;


  // <Chat chatId={id} />
