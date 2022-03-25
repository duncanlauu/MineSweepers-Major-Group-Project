import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import Nav from '../Nav/Nav'
import Chat2 from './Chat2'
import { ChatContainer, EmptyChatContainer, EmptyChatText, TitleBar } from './ChatElements'
import Sidepanel2 from './Sidepanel2'

function ChatUI() {

    const { chat_id } = useParams();

  return (
    <Container fluid>
        <Row style={{ marginBottom: "3rem" }}>
            <Nav />
        </Row>
        <Row>
            <Col xs={1} />
            <Col xs={3} style={{ padding: "0px" }}>
                <ChatContainer>
                    <TitleBar>
                        <span>Conversations</span>
                    </TitleBar>
                    <Sidepanel2 />
                </ChatContainer>
            </Col>
            <Col xs={7}>
                <ChatContainer>
                    {/* <EmptyChatContainer>
                        <img src='../../../static/images/Outbox.svg' alt='Outbox' />
                        <EmptyChatText>
                            Send messages to individual users<br />
                            or a club you're part of.
                        </EmptyChatText>
                    </EmptyChatContainer> */}
                    <Chat2 chatId = {chat_id} />
                </ChatContainer>
            </Col>
            <Col xs={1} />
        </Row>
    </Container>
  )
}

export default ChatUI