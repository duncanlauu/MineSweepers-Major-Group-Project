import React, { useState } from 'react'
import Gravatar from 'react-gravatar'
import { Button, Container, Row, Col } from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'
import { HeadingText } from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import { BookProfile, FilterButton, RecommenderContainer } from './RecommenderPageElements'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {Oval} from 'react-loader-spinner';


const RecommenderPage = () => {
  const user = useGetUser();
  if (user) {
    console.log("User ID: " + user.id);
  }

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const [bookRecommendations, setBookRecommendations] = useState([]);

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
                justifyContent: 'center'
            }}>
                <Oval color="#653FFD" secondaryColor='#B29FFE' height="100" width="100" />
            </div>
          </Container>
      )
  }

  function returnTop10Recommendations() {
    axiosInstance
      .post(`recommender/0/10/${user.id}/top_n/`, {})
      .then(res => {
        console.log(res);
        setBookRecommendations(res.data)
      })
      .catch(error => {
        console.log(error);
      })

    trackPromise(
        axiosInstance
        .get(`recommender/0/10/${user.id}/top_n/`)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        })
    );
  }

  function returnGlobalTop10Recommendations() {
    axiosInstance
      .post(`recommender/0/10/top_n_global/`, {})
      .then(res => {
        console.log(res);
        setBookRecommendations(res.data)
      })
      .catch(error => {
        console.log(error);
      })

    trackPromise(
        axiosInstance
        .get(`recommender/0/10/top_n_global/`)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
      }));
  }

  function returnGlobalTop10FictionRecommendations() {
    axiosInstance
      .post(`recommender/0/10/top_n_global_for_genre/fiction/`, {})
      .then(res => {
        console.log(res);
        setBookRecommendations(res.data)
      })
      .catch(error => {
        console.log(error);

      })

    trackPromise(
        axiosInstance
        .get(`recommender/0/10/top_n_global_for_genre/fiction/`)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
      }));
  }

  function returnFictionRecommendations() {
    axiosInstance
    .post(`recommender/0/10/${user.id}/top_n_for_genre/fiction/`, {})
    .then(res => {
      console.log(res);
      setBookRecommendations(res.data)
    })
    .catch(error => {
      console.log(error);
    })

    trackPromise(
        axiosInstance
            .get(`recommender/0/10/${user.id}/top_n_for_genre/fiction/`)
            .then(res => {
            console.log(res);
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
          <FilterButton onClick={returnFictionRecommendations}>My Genre Recommendations</FilterButton><br />
          <FilterButton onClick={returnTop10Recommendations}>My Recommendations</FilterButton><br />
          <FilterButton onClick={returnGlobalTop10Recommendations}>Global Top 10</FilterButton><br />
          <FilterButton onClick={returnGlobalTop10FictionRecommendations}>Global Genre Top 10</FilterButton><br />
          <LoadingIndicator />
          
            <ul>
              {bookRecommendations.map(
                bookRecommendation =>
                  <li>
                    <BookProfile>
                      <Col xs={3}>
                        <Gravatar email='blah@blah.com' />
                      </Col>
                      <Col xs={9}>
                        {bookRecommendation[0]}
                      </Col>
                    </BookProfile>
                  </li>
              )}
            </ul>
        </Col>
        <Col />
        </Row>
    </Container>
  )
}

export default RecommenderPage