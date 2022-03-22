import React, {useState} from 'react'
import {Button, Container, Row, Col} from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'
import {HeadingText} from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import {RecommenderContainer} from './RecommenderPageElements'
import {Link} from "@material-ui/core";
import {usePromiseTracker, trackPromise} from "react-promise-tracker";
import {Oval} from 'react-loader-spinner';

const ClubRecommendationPage = () => {
    const user = useGetUser();
    if (user) {
        console.log("User ID: " + user.id);
    }

    const [clubRecommendations, setClubRecommendations] = useState([])

    function returnTop10Recommendations() {
        trackPromise(axiosInstance
            .post(`recommender/0/10/${user.id}/top_n_clubs_top_club_books/`, {})
            .then(res => {
                axiosInstance
                    .get(`recommender/0/10/${user.id}/top_n_clubs_top_club_books/`)
                    .then(res => {
                        console.log(res);
                        setClubRecommendations(res.data)
                    })
                    .catch(error => {
                            console.log(error);
                        }
                    )
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

    return (
        <Container fluid>
            <Row style={{marginBottom: "3rem"}}>
                <Nav/>
            </Row>
            <Row>
                <Col/>
                <Col xs={8}>
                    <Button onClick={returnTop10Recommendations}>Display my Recommendations</Button><br/>
                    <HeadingText>Clubs For You</HeadingText>
                    <LoadingIndicator/>
                    <RecommenderContainer>
                        <ul>
                            {clubRecommendations.map(
                                clubRecommendation =>
                                    <li>
                                        <a href={`/club_profile/${clubRecommendation['club']['id']}`}>
                                            {clubRecommendation['club']['name']}
                                        </a>
                                        <hr/>
                                    </li>
                            )}
                        </ul>
                    </RecommenderContainer>
                </Col>
                <Col/>
            </Row>
        </Container>
    )
}

export default ClubRecommendationPage