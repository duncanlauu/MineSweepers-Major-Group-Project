import React from 'react'
import { Container, Col, Row } from 'reactstrap'
import {
    ClubListItem,
    Heading2Text,
    HeadingText,
    RecommendationContainer,
    RecommendationInfo,
    FeedContainer
} from './HomePageElements'
import Gravatar from 'react-gravatar'
import Nav from '../Nav/Nav'
import { Link } from 'react-router-dom'
import { ParaText } from './HomePageElements'
import { IoIosArrowForward } from 'react-icons/io'

import useGetUser from "../../helpers";
import FeedPostList from '../FriendsPage/FeedPostList'

const HomePage = () => {
    const currentUser = useGetUser();
    console.log("Buenos Dias Home")
    console.log("Current user logged in: " + currentUser.id)
    return (
        <Container fluid>
            <Row style={{ marginBottom: "3rem" }}>
                <Nav />
            </Row>
            <Row>
                <Col />
                <Col xs={5}>
                    <FeedContainer>
                        <FeedPostList/>
                    </FeedContainer>
                </Col>
                <Col xs={4}>
                    <HeadingText>Our Recommendations</HeadingText><br />
                    <Heading2Text>Books</Heading2Text><br />
                    <Link to="/recommendations/" style={{ color: '#653FFD', textDecoration: 'none', fontSize:"15px" }}>
                        <ParaText><IoIosArrowForward />See all recommendations</ParaText>
                    </Link>
                    <RecommendationContainer>
                        <Gravatar email='blah@blah.com' size={65} />
                        <RecommendationInfo />
                    </RecommendationContainer>
                    <RecommendationContainer>
                        <Gravatar email='blah@blah.com' size={65} />
                        <RecommendationInfo />
                    </RecommendationContainer><br />
                    <Heading2Text>Clubs</Heading2Text><br />
                    <ul style={{ display: "flex", flexDirection: "row" }}>
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
                <Col />
            </Row>
        </Container>
    )
}

export default HomePage