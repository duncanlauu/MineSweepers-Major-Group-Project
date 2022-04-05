import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Container, Col, Row } from "reactstrap";
import {
  ClubListItem,
  FeedContainer,
  Heading2Text,
  HeadingText,
  RecommendationContainer,
  RecommendationInfo,
  RecommendedClubMembersText,
  RecommendedClubsText,
} from "./HomePageElements";
import Gravatar from "react-gravatar";
import MainNav from "../Nav/MainNav";
import { Link } from "react-router-dom";
import { ParaText } from "./HomePageElements";
import { IoIosArrowForward } from "react-icons/io";

import FeedPostList from "../Feed/FeedPostList";
import IndividualBookCard from "../RecommenderPage/IndividualBookCard";

function IndividualClubCard(props) {
  return (
    <a name="recommended-club" href={`/club_profile/${props.id}`}>
      <ClubListItem>
        <Gravatar
          email={props.email}
          size={65}
          style={{
            marginBottom: "1rem",
            marginTop: "1rem",
            borderRadius: "100px",
          }}
        />
        <RecommendedClubsText>{props.name}</RecommendedClubsText>
        <RecommendedClubMembersText>
          {props.size} Members
        </RecommendedClubMembersText>
      </ClubListItem>
    </a>
  );
}

function SelectRandomClubs(arr) {
  const displayClubs = arr.sort(() => 0.5 - Math.random()).slice(0, 3);
  return displayClubs;
}

function SelectRandomBooks(arr) {
  const displayBooks = arr.sort(() => 0.5 - Math.random()).slice(0, 2);
  return displayBooks;
}

async function getOwnerEmail(id) {
  const clubOwner = await axiosInstance.get(`user/get_update/${id}`);
  return clubOwner.data.email;
}

const HomePage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recommendedClubs, setRecommendedClubs] = useState([]);

  let calculatedRecommendations = false;
  useEffect(() => {
    if (!calculatedRecommendations) {
      calculatedRecommendations = true;

      axiosInstance
        .get(`recommender/0/10/${currentUser.id}/top_n_clubs_top_club_books/`)
        .then((res) => {
          if (res.data.length === 0) {
            precomputeRecommenderResults();
          }
          setRecommendedClubs(SelectRandomClubs(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
      axiosInstance
        .get(`recommender/0/10/top_n_global/`)
        .then((res) => {
          if (res.data.length === 0) {
            precomputeGlobalTop();
          }
          setRecommendedBooks(SelectRandomBooks(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const precomputeRecommenderResults = () => {
    axiosInstance
      .post(`recommender/0/20/${currentUser.id}/precompute_all/`, {})
      .catch((err) => {
        console.error(err);
      });
  };

  const precomputeGlobalTop = () => {
    axiosInstance
      .post(`recommender/0/10/top_n_global/`)
      .then((res) => {
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container fluid>
      <Row style={{ marginBottom: "3rem" }}>
        <MainNav />
      </Row>
      <Row>
        <Col />
        <Col xs={5}>
          <FeedContainer>
            <FeedPostList />
          </FeedContainer>
        </Col>
        <Col xs={4}>
          <HeadingText>Our Recommendations</HeadingText>
          <br />
          <Heading2Text>Books</Heading2Text>
          <br />
          <Link
            to="/recommendations/"
            style={{
              color: "#653FFD",
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            <ParaText>
              <IoIosArrowForward />
              See all recommendations
            </ParaText>
          </Link>
          <ul style={{ display: "flex", flexDirection: "column" }}>
            {recommendedBooks.map((book) => (
              <li>
                <IndividualBookCard
                  imageURL={book.book.image_links_small}
                  isbn={book.book.ISBN}
                  title={book.book.title}
                  author={book.book.author}
                  rating={book.weighted_rating}
                  numberOfRatings={book.number_of_ratings}
                  year={book.book.publication_date}
                />
              </li>
            ))}
          </ul>
          <br />
          <Heading2Text>Clubs</Heading2Text>
          <br />
          <Row>
            <Col xs="7">
              <Link
                to="/recommend_clubs"
                style={{
                  color: "#653FFD",
                  textDecoration: "none",
                  fontSize: "15px",
                }}
              >
                <ParaText>
                  <IoIosArrowForward />
                  See all club recommendations
                </ParaText>
              </Link>
            </Col>
            <Col xs="5">
              <Link
                to="/all_clubs"
                style={{
                  color: "#653FFD",
                  textDecoration: "none",
                  fontSize: "15px",
                }}
              >
                <ParaText>
                  <IoIosArrowForward />
                  See all clubs
                </ParaText>
              </Link>
            </Col>
          </Row>
          <br />
          <ul style={{ display: "flex", flexDirection: "row" }}>
            {recommendedClubs.map((club) => (
              <li>
                <IndividualClubCard
                  id={club.club.id}
                  email={club.email}
                  name={club.club.name}
                  size={club.club.admins.length + club.club.members.length + 1}
                />
              </li>
            ))}
          </ul>
        </Col>
        <Col />
      </Row>
    </Container>
  );
};

export default HomePage;
