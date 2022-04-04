// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React, { useEffect } from 'react'
import Contact from './Contact';
import axiosInstance from '../../axios'

export default function Sidepanel(props) {

    useEffect(() => {
        getUserChats()
    }, []);

    const getUserChats = (e) => {
        const username = JSON.parse(localStorage.getItem('user')).username
        axiosInstance.get(`chat/?username=${username}`)
            .then(res => {
                let userChats = res.data;
                userChats.sort(function (a, b) {
                    return (b.last_update).localeCompare(a.last_update);
                })
                props.setChats(userChats)
            });

    }

    const activeChats = props.chats.map(c => {
        return (
            // <Contact
            //     key={c.id}
            //     name={getChatName(c)}
            //     gravatar={getChatGravatar(c)}
            //     chatURL={`/chat/${c.id}`}
            //     lastMessage={c.last_message}
            //     lastUpdated={c.last_updated}
            // />
            <div key={c.id}>
                {getChatName(c) == "Bookgle User (Left the chat)"
                    ?
                    <div style={{ opacity: "25%" }}>
                        <Contact
                            key={c.id}
                            name={getChatName(c)}
                            gravatar={getChatGravatar(c)}
                            chatURL={`/chat/${c.id}`}
                            lastMessage={c.last_message}
                            lastUpdated={c.last_updated}
                        />
                    </div>
                    :
                    <Contact
                        key={c.id}
                        name={getChatName(c)}
                        gravatar={getChatGravatar(c)}
                        chatURL={`/chat/${c.id}`}
                        lastMessage={c.last_message}
                        lastUpdated={c.last_updated}
                    />
                }
            </div>
        )
    })

    function getChatName(chat) {
        let chatName = "undefined";
        if (chat.group_chat == false) {
            if (chat.participants.length == 2) {
                for (const participant of chat.participants) {
                    if (participant.username != localStorage.username) {
                        chatName = participant.username;
                    }
                }
            } else if (chat.participants.length == 1) {
                chatName = "Bookgle User (Left the chat)"
            }
        } else {
            chatName = chat.name;
        }
        return chatName;
    }

    function getChatGravatar(chat) {
        let gravatar = "undefined";
        if (chat.group_chat == false) {
            if (chat.participants.length == 2) {
                for (const participant of chat.participants) {
                    if (participant.username != localStorage.username) {
                        gravatar = participant.email
                    }
                }
            } else if (chat.participants.length == 1) {
                gravatar = chat.participants[0].email
            }
        } else {
            if (chat.owner_gravatar != "") {
                gravatar = chat.owner_gravatar
            } else {
                gravatar = chat.participants[0].email
            }
        }
        return gravatar;
    }


    return (
        <div id="sidepanel" style={{ height: "100%", overflowY: "scroll" }}>
            <div id="contacts">
                <ul>
                    {activeChats.length === 0 ? <>You have no active chats.</> : activeChats}
                </ul>
            </div>
        </div>
    );
}
