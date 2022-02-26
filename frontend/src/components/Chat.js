// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import { connect } from 'react-redux';
import WebSocketInstance from '../websocket';
import Hoc from '../hoc/hoc';
import { Link, useParams } from 'react-router-dom';

class Chat extends React.Component {

	state = { message: '' }

	initialiseChat() {
		let username = "admin"
        this.waitForSocketConnection(() => {
          WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
          WebSocketInstance.fetchMessages(
            username,
            this.props.chatID
          );
        });
		console.log("initialise Chat: " + this.props.chatID)
    WebSocketInstance.connect(this.props.chatID);
	}

    constructor(props) {
        super(props);

				console.log(this.props.chatID)
		this.initialiseChat();
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
        this.setState({ messages: [...this.state.messages, message] });
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse()});
    }

    messageChangeHandler = (event) =>  {
        this.setState({ message: event.target.value });
    }

    sendMessageHandler = (e) => {
        e.preventDefault();
        const messageObject = {
            from: "admin", //broken
            content: this.state.message,
            chatId: this.props.chatID,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({ message: '' });
    }

    renderTimestamp = timestamp => {
        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000);
        if (timeDiff < 1) { // less than one minute ago
            prefix = 'just now...';
        } else if (timeDiff < 60 && timeDiff > 1) { // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24*60 && timeDiff > 60) { // less than 24 hours ago
            prefix = `${Math.round(timeDiff/60)} hours ago`;
        } else if (timeDiff < 31*24*60 && timeDiff > 24*60) { // less than 7 days ago
            prefix = `${Math.round(timeDiff/(60*24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
    }

    renderMessages = (messages) => {
			const currentUser = "admin";
        // const currentUser = this.props.username; correct
        // return <div>Yo</div>
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
                className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>{message.content}
                    <br />
                    <small>
                        {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillReceiveProps(newProps) {
      console.log(newProps.params)
			if(newProps.params.chatID != undefined) {
      	if (this.props.params.chatID !== newProps.params.chatID) {
            	WebSocketInstance.disconnect();
            	this.waitForSocketConnection(() => {
                	WebSocketInstance.fetchMessages(
                  	this.props.username,
                  	newProps.params.chatID
                	);
              	});
								console.log("componentWillReceiveProps: " + this.props.params.chatID)
              	WebSocketInstance.connect(newProps.params.chatID);
        	}
				}
    }

    render() {
        const messages = this.state.messages;
        return (
            <Hoc>
                <div className="messages">
                    <ul id="chat-log">
                    {
                        messages &&
                        this.renderMessages(messages)
                    }
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    };
}

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

const mapStateToProps = state => {
    return {
        username: state.username
    }
}

export default Chat

// export default connect(mapStateToProps)(withParams(Chat));
