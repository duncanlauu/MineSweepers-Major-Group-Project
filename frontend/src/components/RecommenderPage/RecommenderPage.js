import React, { useState } from 'react'
import { Button, Container, Row, Col } from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'
import { HeadingText } from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import { RecommenderContainer } from './RecommenderPageElements'


const RecommenderPage = () => {
  const user = useGetUser();
  if (user) {
    console.log("User ID: " + user.id);
  }

  const [bookRecommendations, setBookRecommendations] = useState([])

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

    axiosInstance
      .get(`recommender/0/10/${user.id}/top_n/`)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
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

    axiosInstance
      .get(`recommender/0/10/top_n_global/`)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
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

    axiosInstance
      .get(`recommender/0/10/top_n_global_for_genre/fiction/`)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
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

  axiosInstance
    .get(`recommender/0/10/${user.id}/top_n_for_genre/fiction/`)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <Container fluid>
      <Row style={{ marginBottom: "3rem" }}>
        <Nav />
      </Row>
      <Row>
      <Col />
        <Col xs={8}>
          <Button onClick={returnFictionRecommendations}>Display my Genre Recommendations</Button><br />
          <Button onClick={returnTop10Recommendations}>Display my Recommendations</Button><br />
          <Button onClick={returnGlobalTop10Recommendations}>Display my Global Recommendations</Button><br />
          <Button onClick={returnGlobalTop10FictionRecommendations}>Display my Global Genre Recommendations</Button><br />
          <HeadingText>Books For You</HeadingText>
          <RecommenderContainer>
            <ul>
              {bookRecommendations.map(
                bookRecommendation =>
                  <li>
                    {bookRecommendation[0]}
                    <hr />
                  </li>
              )}
            </ul>
          </RecommenderContainer>
        </Col>
        <Col />
        </Row>
    </Container>
  )
}

export default RecommenderPage