import React from 'react';
import WebSocketInstance from '../../websocket';
import Hoc from './hoc/hoc';
import axiosInstance from '../../axios'
import { EmptyChatContainer, EmptyChatText, MessageSendBox,
     MessagingProfileHeading, MessageText, MessagingProfilePara, ReceivedMessagePara} from './ChatElements';
import Gravatar from 'react-gravatar';
import { Container } from 'reactstrap';

class Chat2 extends React.Component {

    state = {
        message: '',
        chatID: ''
    }

    currentUser = null;

    initialiseChat() {
        this.setState({chatID: this.props.chatID})
        console.log("Local Storage: " + JSON.stringify(localStorage));
        this.currentUser = localStorage.username
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
        if (!(JSON.stringify(message) === JSON.stringify(this.state.messages[this.state.messages.length - 1]))) { //fix duplicate messages when sending, horrible implementation
            this.setState({messages: [...this.state.messages, message]});
        }
    }

    setMessages(messages) {
        this.setState({messages: messages.reverse()});
    }

    messageChangeHandler = (event) => {
        this.setState({message: event.target.value});
    }

    sendMessageHandler = (e) => {

        e.preventDefault();
        const messageObject = {
            from: this.currentUser, //broken
            content: this.state.message,
            chatId: this.props.chatID,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({message: ''});
    }

    leaveChatHandler = (e) => {
        console.log("BYEE")
        axiosInstance
            .delete(`chat/leave/${this.props.chatID}/`)
            .then((res) => {
                console.log(res)
            })
            .catch(error => console.error(error));
    }

    renderTimestamp = timestamp => {
        //broken 

        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        if (timeDiff < 1) { // less than one minute ago
            prefix = 'Just now';
        } else if (timeDiff < 60 && timeDiff > 1) { // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) { // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) { // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
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
                <img src="http://emilcarlsson.se/assets/mikeross.png" style={{ height:"3rem", width:"3rem", borderRadius:"100px" }} />
                {/* {message.author === this.currentUser
                    ? <Gravatar email={this.currentUser.email} style={{ height:"3rem", width:"3rem", borderRadius:"100px" }} />
                    : <img src="http://emilcarlsson.se/assets/mikeross.png" style={{ height:"3rem", width:"3rem", borderRadius:"100px" }} />
                } */}
                <p>
                    {message.author === this.currentUser ? <></> : <MessagingProfileHeading>{message.author}</MessagingProfileHeading>}
                    <br/>
                    <MessageText>{message.content}</MessageText>
                    <br/>
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
            this.messagesEnd.scrollIntoView({behavior: "smooth"});
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
            return {chatID: newProps.chatID};
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
                                <img src='../../../static/images/Outbox.svg' alt='Outbox' style={{ marginTop:"5rem" }} />
                                <EmptyChatText>
                                    Send messages to individual users<br />
                                    or a club you're part of.
                                </EmptyChatText>
                            </EmptyChatContainer>
                        </div>
                        : 
                        <>
                            <Hoc>
                                <Container style={{ display: "flex", height:"3.5rem", backgroundColor:"#F3F3F3", width:"100%", fontFamily:"Source Sans Pro", fontSize:"15px", alignItems:"center", color:"#fff", justifyContent:"flex-end", borderRadius:"10px 10px 0px 0px" }}>
                                    <img src='../../../static/images/DeleteChatIcon.svg' alt='Delete Chat' onClick={this.leaveChatHandler} style={{ cursor: 'pointer' }} />
                                </Container>
                                <div>
                                    <ul id="chat-log" 
                                        style={{ overflowY:"scroll", height:"31.5vw", paddingLeft:"2rem", paddingRight:"2rem", marginBottom:"0px" }}>
                                        {
                                            messages &&
                                            this.renderMessages(messages)
                                        }
                                        <div style={{float: "left", clear: "both"}}
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
                                        alignItems:  "center",
                                        justifyContent: "center",
                                        borderRadius: "0px 0px 10px 10px"
                                    }}>
                                    <form onSubmit={this.sendMessageHandler}>
                                        <div className="wrap">
                                            <MessageSendBox>
                                            <input
                                                style={{
                                                    borderRadius:"0px 0px 10px 10px",
                                                    fontFamily:"Source Sans Pro",
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
                                                placeholder="Start typing..."/>
                                            <button className="submit" style={{ paddingRight:"1rem", border: "0px", backgroundColor: "#F2F2F2" }}>
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

export default Chat2