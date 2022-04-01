import React, {useEffect} from "react";
import axiosInstance from "../../axios";
import {Container, Col, Row} from "reactstrap";
import {ClubListItem, Heading2Text, HeadingText, RecommendationContainer, RecommendationInfo} from "./HomePageElements";
import Gravatar from "react-gravatar";
import MainNav from "../Nav/MainNav";
import {Link} from "react-router-dom";
import {ParaText} from "./HomePageElements";
import {IoIosArrowForward} from "react-icons/io";

import FeedPostList from "../Feed/FeedPostList";

const HomePage = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    let calculatedRecommendations = false;
    useEffect(() => {
        if (!calculatedRecommendations) {
            calculatedRecommendations = true;

            axiosInstance
                .get(`recommender/0/10/${currentUser.id}/top_n_clubs_top_club_books/`)
                .then((res) => {
                    if (res.data.length === 0) {
                        console.log("Calculated all recommendations");
                        precomputeRecommenderResults();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            axiosInstance
                .get(`recommender/0/10/top_n_global/`)
                .then((res) => {
                    if (res.data.length === 0) {
                        console.log("Calculated global recommendations");
                        precomputeGlobalTop();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    const precomputeRecommenderResults = () => {
        axiosInstance
            .post(`recommender/0/20/${currentUser.id}/precompute_all/`, {})
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const precomputeGlobalTop = () => {
        axiosInstance
            .post(`recommender/0/10/top_n_global/`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Container fluid>
            <Row style={{marginBottom: "3rem"}}>
                <MainNav/>
            </Row>
            <Row>
                <Col/>
                <Col xs={5}>
                    <FeedContainer>
                        <FeedPostList/>
                    </FeedContainer>
                </Col>
                <Col xs={4}>
                    <HeadingText>Our Recommendations</HeadingText>
                    <br/>
                    <Heading2Text>Books</Heading2Text>
                    <br/>
                    <Link
                        to="/recommendations/"
                        style={{
                            color: "#653FFD",
                            textDecoration: "none",
                            fontSize: "15px",
                        }}
                    >
                        <ParaText>
                            <IoIosArrowForward/>
                            See all recommendations
                        </ParaText>
                    </Link>
                    <RecommendationContainer>
                        <Gravatar email="blah@blah.com" size={65}/>
                        <RecommendationInfo/>
                    </RecommendationContainer>
                    <RecommendationContainer>
                        <Gravatar email="blah@blah.com" size={65}/>
                        <RecommendationInfo/>
                    </RecommendationContainer>
                    <br/>
                    <Heading2Text>Clubs</Heading2Text>
                    <br/>
                    <ul style={{display: "flex", flexDirection: "row"}}>
                        <ClubListItem>
                            <Gravatar email="blah@blah.com"/>
                            <span>Club 1</span>
                        </ClubListItem>
                        <ClubListItem>
                            <Gravatar email="blah@blah.com"/>
                            <span>Club 2</span>
                        </ClubListItem>
                        <ClubListItem>
                            <Gravatar email="blah@blah.com"/>
                            <span>Club 3</span>
                        </ClubListItem>
                    </ul>
                </Col>
                <Col/>
            </Row>
        </Container>
    );
};

export default HomePage;
