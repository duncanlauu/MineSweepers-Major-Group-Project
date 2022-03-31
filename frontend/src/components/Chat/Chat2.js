import React from 'react';
import WebSocketInstance from '../../websocket';
import Hoc from './hoc/hoc';
import axiosInstance from '../../axios'
import { EmptyChatContainer, EmptyChatText, MessageSendBox,
     MessagingProfileHeading, MessageText, MessagingProfilePara} from './ChatElements';

class Chat2 extends React.Component {

    state = {
        message: '',
        chatID: ''
    }

    currentUser = null;

    initialiseChat() {
        this.setState({chatID: this.props.chatID})
        this.currentUser = JSON.parse(localStorage.user).username
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
                style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
                className={message.author === this.currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png"/>
                <p>
                    <MessagingProfileHeading>{message.author}</MessagingProfileHeading>
                    <br/>
                    <MessageText>{message.content}</MessageText>
                    <br/>
                    <MessagingProfilePara>{this.renderTimestamp(message.timestamp)}</MessagingProfilePara>
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
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

    emptyChatWindow() {
        return(
            <>

            </>
        );
    }

    render() {
        const messages = this.state.messages;
        const invalidChatID = this.state.chatID == undefined;
        return (
            <Hoc>
                <div>
                    <button 
                        onClick={this.leaveChatHandler} 
                        id="chat-message-submit" 
                        className="submit"
                        style={{
                            backgroundColor:"#E6E4E4",
                            color: '#653FFD',
                            fontSize: '12px',
                            border: '0',
                            borderRadius: '100px',
                            fontWeight: '600'
                        }}>
                        <span style={{ paddingLeft: '5px',
                            paddingRight: '5px' }}>Leave Conversation</span>
                    </button>
                </div>
                <div className="messages">
                    {invalidChatID
                        ?
                        <>
                            <EmptyChatContainer>
                                <img src='../../../static/images/Outbox.svg' alt='Outbox' />
                                <EmptyChatText>
                                    Send messages to individual users<br />
                                    or a club you're part of.
                                </EmptyChatText>
                            </EmptyChatContainer>
                        </>
                        : <div/>
                    }
                    <ul id="chat-log">
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
                        justifyContent: "center"
                    }}>
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <MessageSendBox>
                            <input
                                style={{
                                    borderRadius:"100px",
                                    fontFamily:"Source Sans Pro",
                                    fontSize: "15px",
                                    width: "100%",
                                    height: "3rem",
                                    textIndent: "2rem",
                                    backgroundColor: "#E6E4E4",
                                    border: '0',
                                }}
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Start typing..."/>
                            <button className="submit" style={{ backgroundColor:"#fff", borderRadius:"100px", border: "0px" }}>
                                <img src='../../../static/images/SendMessage.svg' alt='Send Icon' />
                            </button>
                            </MessageSendBox>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    };
}

export default Chat2