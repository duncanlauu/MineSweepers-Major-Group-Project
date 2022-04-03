import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import { BookProfile } from "./ClubProfileElements";
import axiosInstance from "../../axios";
import { useParams } from "react-router-dom";
import { ParaText } from "../Login/LoginElements";
import { BookHeading, YearAuthorInfo } from "../RecommenderPage/RecommenderPageElements";

const LandingProfile = (props) => {
  const { club_id } = useParams();
  console.log("Club ID: " + club_id);
  const [club, setClub] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const user_id = props.user_id;

  const memberStatus = props.memberStatus;

  const [modalVisible, setModalVisible] = useState(false);


  function IndividualBookCard(props) {
    return (
      <Row>
        <BookProfile>
          <Col xs={2}>
            <img src={props.imageURL} alt="Book Cover" />
          </Col>
          <Col xs={10}>
            <a href={`/book_profile/${props.isbn}`}>
              <BookHeading>{props.title}</BookHeading><br />
              <YearAuthorInfo>{props.author}, {props.year}</YearAuthorInfo><br />
            </a>
          </Col>
        </BookProfile>
      </Row>
    );
  }

  useEffect(() => {
    axiosInstance
      .get(`singleclub/${club_id}`)
      .then((res) => {
        console.log(res);
        setClub(res.data);
        console.log(res.data.books);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!club) return null;

  const applyStyle = {
    width: "17rem",
    margin: "1rem",
    fontFamily: "Source Sans Pro",
    borderRadius: "5px",
    backgroundColor: "#653FFD",
    border: "2px solid #653DDF",
  };

  const appliedStyle = {
    width: "17rem",
    margin: "1rem",
    fontFamily: "Source Sans Pro",
    borderRadius: "5px",
    backgroundColor: "#fff",
    border: "2px solid #653DDF",
    color: "#653FFD",
  };

  const leaveStyle = {
    width: "17rem",
    margin: "1rem",
    fontFamily: "Source Sans Pro",
    borderRadius: "5px",
    backgroundColor: "#ff6666",
    border: "2px solid #000000",
    color: "#fff",
  };

  let buttonState =
    memberStatus === "notApplied" ? "Apply" : "Withdraw Application";

  function applyToClub(id, user_id) {
    axiosInstance
      .put(`singleclub/${id}/apply/${user_id}`, {})
      .then((res) => {
        console.log(res);
        props.setMemberStatus("applied");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function withdrawApplication(id, user_id) {
    axiosInstance
      .put(`singleclub/${id}/reject/${user_id}`, {})
      .then((res) => {
        console.log(res);
        props.setMemberStatus("notApplied");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function leaveClub(id, user_id) {
    axiosInstance
      .put(`singleclub/${id}/leave/${user_id}`, {})
      .then((res) => {
        console.log(res);
        props.setMemberStatus("notApplied");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container fluid>
      <Row style={{ display: "flex" }}>
        <Col xs={8}>
          <span style={{ fontFamily: "Source Sans Pro", fontSize: "15px" }}>
            {club.club.description}
          </span>
        </Col>
        <Col>
          <Gravatar
            email={club.owner.email}
            size={100}
            style={{ borderRadius: "100px" }}
          />
        </Col>
      </Row>
      <Row>
        {(memberStatus === "notApplied" || memberStatus === "applied") && (
          <Button
            onClick={(e) =>
              memberStatus === "notApplied"
                ? applyToClub(club_id, user_id)
                : withdrawApplication(club_id, user_id )
            }
            style={memberStatus === "notApplied" ? applyStyle : appliedStyle}
          >
            {buttonState}
          </Button>
        )}  
        {(memberStatus === "admin" || memberStatus === "member" ) && (
          <Button onClick={(e) => leaveClub(club_id, user_id)} style={leaveStyle}>
            Leave Club
          </Button>
        )}
        {memberStatus === "banned" && (
          <ParaText>You are banned from this club</ParaText> // TODO: Add styling
        )}
        {memberStatus === "owner" && (
          <ParaText>If you would like to leave the club, please transfer the ownership</ParaText> // TODO: Add styling
        )}
      </Row>
      <Row>
        <h3
          style={{
            fontFamily: "Source Sans Pro",
            marginTop: "2rem",
            fontWeight: "600",
          }}
        >
          Reading History
        </h3>
      </Row>
      {club.books.map(book =>
        <IndividualBookCard 
          imageURL={book.image_links_small} 
          isbn={book.ISBN} 
          title={book.title} 
          author={book.author} 
          year={book.publication_date} />
      )}
    </Container>
  );
};

export default LandingProfile;