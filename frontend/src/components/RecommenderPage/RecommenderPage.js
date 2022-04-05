import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import axiosInstance from '../../axios'
import { HeadingText } from '../Login/LoginElements'
import MainNav from '../Nav/MainNav'
import { FilterButton } from './RecommenderPageElements'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { Oval } from 'react-loader-spinner';
import IndividualBookCard from './IndividualBookCard'


const RecommenderPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const [value, setValue] = useState('');

    const [bookRecommendations, setBookRecommendations] = useState([]);
    const [genres, setGenres] = useState([]);

    const selectStyle = {
        backgroundColor: "#fff",
        fontFamily: "Source Sans Pro",
        height: "3rem",
        width: "fit-content",
        borderRadius: "100px",
        border: "3px solid #653ffd",
        paddingLeft: "1rem"
    }

    function getGenres() {
        axiosInstance
            .get(`genres?n=10`)
            .then(res => {
                setGenres(res.data);
            })
            .catch(err => {
                console.error(err)
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
                    setBookRecommendations(res.data);
                })
                .catch(err => {
                    console.error(err);
                })
        );
    }

    function returnGlobalTop10Recommendations() {
        trackPromise(
            axiosInstance
                .get(`recommender/0/10/top_n_global/`)
                .then(res => {
                    setBookRecommendations(res.data)
                })
                .catch(err => {
                    console.error(err);
                }));
    }

    function returnGlobalTop10GenreRecommendations() {
        const genre = value;
        axiosInstance
            .post(`recommender/0/10/top_n_global_for_genre/${genre}/`, {})

            .catch(err => {
                console.error(err);
            })

        trackPromise(
            axiosInstance
                .get(`recommender/0/10/top_n_global_for_genre/${genre}/`)
                .then(res => {
                    setBookRecommendations(res.data)
                })
                .catch(err => {
                    console.error(err);
                }));
    }

    function returnTop10GenreRecommendations() {
        const genre = value;
        axiosInstance
            .post(`recommender/0/10/${user.id}/top_n_for_genre/${genre}/`, {})
            .catch(err => {
                console.error(err);
            })

        trackPromise(
            axiosInstance
                .get(`recommender/0/10/${user.id}/top_n_for_genre/${genre}/`)
                .then(res => {
                    setBookRecommendations(res.data)
                })
                .catch(err => {
                    console.error(err);
                })
        );
    }

    return (
        <Container fluid>
            <Row style={{ marginBottom: "3rem" }}>
                <MainNav />
            </Row>
            <Row>
                <Col />
                <Col xs={6}>
                    <HeadingText>Books For You</HeadingText><br />
                    <select
                        name="genre-select"
                        style={selectStyle}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}>
                        <option>Select genre</option>
                        {genres.map(genre =>
                            <option data-testId="genre-selection" key={genre} value={genre}>{genre}</option>
                        )}
                    </select><br />
                    <FilterButton onClick={returnTop10Recommendations} data-testId="myTop10Recommendations">My Recommendations</FilterButton><br />
                    <FilterButton onClick={returnGlobalTop10Recommendations} data-testId="globalTop10Recommendations">Global Top 10</FilterButton><br />
                    {value && value !== "Select genre" && <><FilterButton onClick={returnTop10GenreRecommendations} data-testId="genreRecommendation">My {value} Recommendations</FilterButton><br /></>}
                    {value && value !== "Select genre" && <><FilterButton onClick={returnGlobalTop10GenreRecommendations} data-testId="genreRecommendation">Global {value} Top 10</FilterButton><br /></>}
                    <LoadingIndicator />
                    <ul>
                        {bookRecommendations.map(
                            (bookRecommendation, index) =>
                                <li data-testId="book-recommendation" key={index}>
                                    <IndividualBookCard
                                        imageURL={bookRecommendation['book']['image_links_small']}
                                        isbn={bookRecommendation['book']['ISBN']}
                                        title={bookRecommendation['book']['title']}
                                        author={bookRecommendation['book']['author']}
                                        rating={bookRecommendation['weighted_rating']}
                                        numberOfRatings={bookRecommendation['number_of_ratings']}
                                        year={bookRecommendation['book']['publication_date']} />
                                </li>
                        )
                        }
                    </ul>
                </Col>
                <Col />
            </Row>
        </Container>
    )
}

export default RecommenderPage