import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'
import { HeadingText } from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import { BookProfile, FilterButton } from './RecommenderPageElements'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { Oval } from 'react-loader-spinner';


const RecommenderPage = () => {
    const user = useGetUser();
    if (user) {
        console.log("User ID: " + user.id);
    }

    const [value, setValue] = useState('');

    const [bookRecommendations, setBookRecommendations] = useState([]);
    const [genres, setGenres] = useState([]);

    function getGenres() {
        axiosInstance
            .get(`genres?n=10`)
            .then(res => {
                console.log(res);
                setGenres(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        setBookRecommendations([])
    }, [value]);

    useEffect(() => {
        getGenres();
    }, [])

    const LoadingIndicator = (props) => {

        const { promiseInProgress } = usePromiseTracker();

        return (
            promiseInProgress &&
            <Container>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10'
                }}>
                    <Oval color="#653FFD" secondaryColor='#B29FFE' height="70" width="70" />
                </div>
            </Container>
        )
    }

    function returnTop10Recommendations() {
        trackPromise(
            axiosInstance
                .get(`recommender/0/10/${user.id}/top_n/`)
                .then(res => {
                    console.log(res);
                    setBookRecommendations(res.data);
                })
                .catch(error => {
                    console.log(error);
                })
        );
    }

    function returnGlobalTop10Recommendations() {
        trackPromise(
            axiosInstance
                .get(`recommender/0/10/top_n_global/`)
                .then(res => {
                    console.log(res);
                    setBookRecommendations(res.data)
                })
                .catch(error => {
                    console.log(error);
                }));
    }

    function returnGlobalTop10GenreRecommendations() {
        const genre = value;
        axiosInstance
            .post(`recommender/0/10/top_n_global_for_genre/${genre}/`, {})
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);

            })

        trackPromise(
            axiosInstance
                .get(`recommender/0/10/top_n_global_for_genre/${genre}/`)
                .then(res => {
                    console.log(res);
                    setBookRecommendations(res.data)
                })
                .catch(error => {
                    console.log(error);
                }));
    }

    function returnTop10GenreRecommendations() {
        const genre = value;
        axiosInstance
            .post(`recommender/0/10/${user.id}/top_n_for_genre/${genre}/`, {})
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })

        trackPromise(
            axiosInstance
                .get(`recommender/0/10/${user.id}/top_n_for_genre/${genre}/`)
                .then(res => {
                    console.log(res);
                    setBookRecommendations(res.data)
                })
                .catch(error => {
                    console.log(error);
                })
        );
    }

    return (
        <Container fluid>
            <Row style={{ marginBottom: "3rem" }}>
                <Nav />
            </Row>
            <Row>
                <Col />
                <Col xs={6}>
                    <HeadingText>Books For You</HeadingText><br />
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}>
                        <option />
                        {genres.map(genre =>
                            <option key={genre} value={genre}>{genre}</option>
                        )}
                    </select><br />
                    {value && <><FilterButton onClick={returnTop10GenreRecommendations} data-testId="genreRecommendation">My {value} Recommendations</FilterButton><br /></>}
                    <FilterButton onClick={returnTop10Recommendations} data-testId="myTop10Recommendations">My Recommendations</FilterButton><br />
                    <FilterButton onClick={returnGlobalTop10Recommendations} data-testId="globalTop10Recommendations">Global Top 10</FilterButton><br />
                    {value && <><FilterButton onClick={returnGlobalTop10GenreRecommendations} data-testId="genreRecommendation">Global {value} Top 10</FilterButton><br /></>}
                    <LoadingIndicator />
                    {value && <><ul>
                        {bookRecommendations.map(
                            bookRecommendation =>
                                <li>
                                    <BookProfile>
                                        <Col xs={3}>
                                            <img src={bookRecommendation['book']['image_links_small']}
                                                alt={"The book's cover"} />
                                        </Col>
                                        <Col xs={9}>
                                            <a href={`/book_profile/${bookRecommendation['book']['ISBN']}`}>
                                                {bookRecommendation['book']['title']}
                                            </a>
                                        </Col>
                                    </BookProfile>
                                </li>
                        )}
                    </ul>
                    </>
                    }
                </Col>
                <Col />
            </Row>
        </Container>
    )
}

export default RecommenderPage