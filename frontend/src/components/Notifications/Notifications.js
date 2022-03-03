import React from 'react'
import { Container, Col, Row } from 'reactstrap'
import { Heading2Text, HeadingText, ParaText } from '../HomePage/HomePageElements'
import Nav from '../Nav/Nav'
import { Heading3Text, NotifBar, NotifDate, NotificationsContainer } from './NotificationsElements'
import Gravatar from 'react-gravatar'

const Notifications = () => {
  return (
    <Container fluid>
        <Row style={{ marginBottom:"3rem" }}>
            <Nav />
        </Row>
        <Row>
            <Col />
            <Col xs={5}>
                <HeadingText>Your Activity</HeadingText>
                <NotificationsContainer>
                    <NotifDate><span>1 February 2022</span></NotifDate>
                    <NotifBar>
                        <Gravatar email='blah@blah.com' style={{ borderRadius: '100px' }} />
                        <div style={{ display:'flex', flexDirection:'column' }}>
                            <Heading3Text>Lorem Ipsum</Heading3Text>
                            <ParaText>started reading Peppa Pig: Lost in Space</ParaText>
                        </div>
                        <ParaText>22:54</ParaText>
                    </NotifBar>
                    <NotifBar>
                        <Gravatar email='blah@blah.com' style={{ borderRadius: '100px' }} />
                        <div style={{ display:'flex', flexDirection:'column' }}>
                            <Heading3Text>Lorem Ipsum</Heading3Text>
                            <ParaText>started reading Peppa Pig: Lost in Space</ParaText>
                        </div>
                        <ParaText>22:54</ParaText>
                    </NotifBar>
                </NotificationsContainer>
            </Col>
            <Col xs={4}>
                <HeadingText>Charts</HeadingText>
                
                <NotificationsContainer></NotificationsContainer>
            </Col>
            <Col />
        </Row>
        </Container>
  )
}

export default Notifications