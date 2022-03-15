import React from 'react'
import { Container, Col, Row } from 'reactstrap'
import { ClubListItem, Heading2Text, HeadingText, ParaText, RecommendationContainer, RecommendationInfo, FeedContainer } from './HomePageElements'
import Gravatar from 'react-gravatar'
import Nav from '../Nav/Nav'

const HomePage = () => {
    return (
        <Container fluid>
        <Row style={{ marginBottom:"3rem" }}>
            <Nav />
        </Row>
        <Row>
            <Col></Col>
            <Col xs={5}>
                <FeedContainer>
                </FeedContainer>
            </Col>
            <Col xs={4}>
                <HeadingText>Our Recommendations</HeadingText><br />
                <Heading2Text>Books</Heading2Text>
                <RecommendationContainer>
                    <Gravatar email='blah@blah.com' size={65} />
                    <RecommendationInfo />
                </RecommendationContainer>
                <RecommendationContainer>
                    <Gravatar email='blah@blah.com' size={65} />
                    <RecommendationInfo />
                </RecommendationContainer><br />
                <Heading2Text>Clubs</Heading2Text><br />
                <ul style={{ display:"flex", flexDirection:"row" }}>
                <ClubListItem>
                    <Gravatar email='blah@blah.com' />
                    <span>Club 1</span>
                </ClubListItem>
                <ClubListItem>
                    <Gravatar email='blah@blah.com' />
                    <span>Club 2</span>
                </ClubListItem>
                <ClubListItem>
                    <Gravatar email='blah@blah.com' />
                    <span>Club 3</span>
                </ClubListItem>
                </ul>
            </Col>
            <Col></Col>
        </Row>
        </Container>
    )
}

export default HomePage