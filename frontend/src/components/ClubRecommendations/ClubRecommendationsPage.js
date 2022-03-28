import React, {useEffect, useState} from 'react'
import {Button, Container, Row, Col} from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'
import {HeadingText} from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import {RecommenderContainer} from './RecommenderPageElements'
import {usePromiseTracker, trackPromise} from "react-promise-tracker";
import {Oval} from 'react-loader-spinner';
import SingleClubRecommendation from "./SingleClubRecommendation";

const ClubRecommendationPage = () => {
    const user = useGetUser();
    const [clubRecommendations, setClubRecommendations] = useState([])

    function getTopClubs() {
        trackPromise(
            axiosInstance
                .get(`recommender/0/10/${user.id}/top_n_clubs_top_club_books/`)
                .then(res => {
                    console.log(res);
                    let recommendations = []
                    for (let i = 0; i < res.data.length; i++) {
                        recommendations.push(res.data[i].club);
                    }
                    setClubRecommendations(recommendations);
                })
                .catch(error => {
                    console.log(error);
                })
        )
    }

    const LoadingIndicator = () => {

        const {promiseInProgress} = usePromiseTracker();

        return (
            promiseInProgress &&
            <Container>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Oval color="#653FFD" secondaryColor='#B29FFE' height="100" width="100"/>
                </div>
            </Container>
        )
    }

    if (clubRecommendations.length > 0) {
        return (
            <Container fluid>
                <Row style={{marginBottom: "3rem"}}>
                    <Nav/>
                </Row>
                <Row>
                    <Col/>
                    <Col xs={8}>
                        <HeadingText>Clubs For You</HeadingText>
                        <LoadingIndicator/>
                        <RecommenderContainer>
                            {clubRecommendations.map(
                                clubRecommendation => {
                                    console.log(clubRecommendation)
                                    return (
                                        <SingleClubRecommendation club={clubRecommendation}/>
                                    )
                                }
                            )}
                        </RecommenderContainer>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        )
    } else {
        if (user !== "") {
            getTopClubs()
        }
        return (
            <Container fluid>
                <Row style={{marginBottom: "3rem"}}>
                    <Nav/>
                </Row>
                <Row>
                    <Col/>
                    <Col xs={8}>
                        <HeadingText>Clubs For You</HeadingText>
                        <LoadingIndicator/>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        )
    }
}

export default ClubRecommendationPage