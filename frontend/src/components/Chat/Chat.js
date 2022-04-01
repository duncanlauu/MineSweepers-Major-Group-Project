import React from 'react';
import WebSocketInstance from '../../websocket';
import Hoc from './hoc/hoc';
import axiosInstance from '../../axios'
import Gravatar from 'react-gravatar';
import {
    EmptyChatContainer, EmptyChatText, MessageSendBox,
    MessagingProfileHeading, MessageText, MessagingProfilePara, ReceivedMessagePara, MessageHeader, EmptyChatNotif
} from './ChatElements';
import { Container } from 'reactstrap';

class Chat extends React.Component {

    state = {
        messages: [],
        message: '',
        chatID: ''
    }

    currentUser = null;

    initialiseChat() {
        this.setState({ chatID: this.props.chatID })
        this.currentUser = JSON.parse(localStorage.getItem('user')).username
        WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))

        if (this.state.chatID != undefined) {
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.state.chatID
                );
            });
            console.log("initialise Chat: " + this.state.chatID)
            WebSocketInstance.connect(this.state.chatID);
        }
    }

    constructor(props) {
        super(props);
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function () {
                if (WebSocketInstance.state() === 1) {
                    console.log("Connection is made");
                    callback();
                    return;
                } else {
                    console.log("wait for connection...");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    addMessage(message) {
        if (!(JSON.stringify(message) === JSON.stringify(this.state.messages[this.state.messages.length - 1]))) {
            this.setState({ messages: [...this.state.messages, message] });
        }
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse() });
    }

    messageChangeHandler = (event) => {
        this.setState({ message: event.target.value });
    }

    sendMessageHandler = (e) => {

        e.preventDefault();
        const messageObject = {
            from: this.currentUser,
            content: this.state.message,
            chatId: this.props.chatID,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({ message: '' });
    }

    leaveChatHandler = (e) => {
        axiosInstance
            .delete(`chat/leave/${this.props.chatID}/`)
            .then((res) => {
                console.log(res)
            })
            .catch(error => console.error(error));
    }

    // Returns a string based on a timestamp, displays the time that passed since the message was sent
    // If more than a day passed then it displays it as yesterday 
    // If more time passed then shows how many days ago, weeks or months
    renderTimestamp = timestamp => {
        const date = new Date(timestamp);
        const today = new Date();
        if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
            return `${date.getHours()}:${this.renderMinutes(date)}`;
        } else {
            const days = Math.floor((today - date) / 1000 / 60 / 60 / 24);
            if (days <= 1) {
                return `Yesterday at ${date.getHours()}:${this.renderMinutes(date)}`;
            } else if (days < 7) {
                return `${days} days ago`;
            } else if (days < 30) {
                return `${Math.floor(days / 7)} weeks ago`;
            } else {
                return `${Math.floor(days / 30)} months ago`;
            }
        }
    }

    //Returns the minutes from date object but adds a leading 0 if the minutes is less than 10
    renderMinutes = (date) => {
        if (date.getMinutes() < 10) {
            return `0${date.getMinutes()}`;
        } else {
            return date.getMinutes();
        }
    }

    renderMessages = (messages) => {
        console.log("renderMessages")
        console.log(messages)

        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{
                    marginBottom: '15px',
                    marginTop: "15px",
                    backgroundColor: message.author === this.currentUser ? '#653FFD' : '#ECECEC',
                    borderRadius: message.author === this.currentUser ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
                    padding: "1rem 1rem 0.2rem 1rem",
                    color: message.author === this.currentUser ? '#fff' : '#000',
                    textAlign: message.author === this.currentUser ? 'right' : 'left',
                    maxWidth: "50%",
                    position: 'relative',
                    marginLeft: message.author === this.currentUser ? 'auto' : '0',
                }}
                className={message.author === this.currentUser ? 'sent' : 'replies'}>
                <Gravatar email={message.gravatar} size={30} style={{ borderRadius: "100px" }} />
                {message.author === this.currentUser ? <></> : <MessagingProfileHeading style={{ marginLeft: "1rem" }}>{message.author}</MessagingProfileHeading>}

                <p>
                    <br />
                    <MessageText>{message.content}</MessageText>
                    <br />
                    {message.author === this.currentUser
                        ? <MessagingProfilePara>{this.renderTimestamp(message.timestamp)}</MessagingProfilePara>
                        : <ReceivedMessagePara>{this.renderTimestamp(message.timestamp)}</ReceivedMessagePara>
                    }
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidMount() {
        this.initialiseChat();
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.chatID !== this.state.chatID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.state.chatID
                );
            });
            WebSocketInstance.connect(this.state.chatID);
        }
        this.scrollToBottom();
    }

    static getDerivedStateFromProps(newProps, prevState) {
        console.log(newProps.chatID);

        if (newProps.chatID !== prevState.chatID) {
            return { chatID: newProps.chatID };
        } else {
            return null
        }
    }

    render() {
        const messages = this.state.messages;
        const invalidChatID = this.state.chatID == undefined;
        return (
            <div>
                {invalidChatID
                    ?
                    <div>
                        <EmptyChatContainer>
                            <img src='../../../static/images/Outbox.svg' alt='Outbox' style={{ marginTop: "5rem" }} />
                            <EmptyChatText>
                                Send messages to individual users<br />
                                or a club you're part of.
                            </EmptyChatText>
                        </EmptyChatContainer>
                    </div>
                    :
                    <>
                        <Hoc>
                            <Container style={{ display: "flex", height: "3.5rem", backgroundColor: "#F3F3F3", width: "100%", fontFamily: "Source Sans Pro", fontSize: "15px", alignItems: "center", color: "#fff", justifyContent: "flex-end", borderRadius: "10px 10px 0px 0px" }}>
                                <img src='../../../static/images/DeleteChatIcon.svg' alt='Delete Chat' onClick={this.leaveChatHandler} style={{ cursor: 'pointer' }} />
                            </Container>
                            <div>
                                <ul id="chat-log"
                                    style={{ overflowY: "scroll", height: "31.5vw", paddingLeft: "2rem", paddingRight: "2rem", marginBottom: "0px" }}>
                                    {
                                        messages &&
                                        this.renderMessages(messages)
                                    }
                                    {
                                        messages.length == 0
                                            ?
                                            <EmptyChatNotif>
                                                Start the conversation.
                                            </EmptyChatNotif>
                                            : <></>
                                    }
                                    <div style={{ float: "left", clear: "both" }}
                                        ref={(el) => {
                                            this.messagesEnd = el;
                                        }}>
                                    </div>
                                </ul>
                            </div>
                            <div
                                className="message-input"
                                style={{
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "0px 0px 10px 10px"
                                }}>
                                <form onSubmit={this.sendMessageHandler}>
                                    <div className="wrap">
                                        <MessageSendBox>
                                            <input
                                                style={{
                                                    borderRadius: "0px 0px 10px 10px",
                                                    fontFamily: "Source Sans Pro",
                                                    fontSize: "15px",
                                                    width: "100%",
                                                    height: "4rem",
                                                    textIndent: "2rem",
                                                    backgroundColor: "#F2F2F2",
                                                    border: '0',
                                                }}
                                                onChange={this.messageChangeHandler}
                                                value={this.state.message}
                                                required
                                                id="chat-message-input"
                                                type="text"
                                                placeholder="Start typing..." />
                                            <button className="submit" style={{ paddingRight: "1rem", border: "0px", backgroundColor: "#F2F2F2" }}>
                                                <img src='../../../static/images/SendMessageIcon.svg' alt='Send Icon' />
                                            </button>
                                        </MessageSendBox>
                                    </div>
                                </form>
                            </div>
                        </Hoc>
                    </>
                }
            </div>
        );
    };
}

export default Chat