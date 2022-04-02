import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import { BookProfile } from "./ClubProfileElements";
import axiosInstance from "../../axios";
import { useParams } from "react-router-dom";
import { ParaText } from "../Login/LoginElements";

const LandingProfile = (props) => {
  const { club_id } = useParams();
  console.log("Club ID: " + club_id);
  const [club, setClub] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);
  let history = [];

  const memberStatus = props.memberStatus;

  const [modalVisible, setModalVisible] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const user_id = currentUser.id;
    console.log("User ID: " + user_id);


  function IndividualBookCard(props) {
    return (
      <Row>
        <BookProfile>
          <Col xs={4}>
            <Gravatar email="blah@blah.com" size={70}></Gravatar>
          </Col>
          <Col xs={8}>{book}</Col>
        </BookProfile>
      </Row>
    );
  }

  useEffect(() => {
    axiosInstance
      .get(`singleclub/${club_id}`)
      .then((res) => {
        console.log(res);
        setClub(res.data.club);
        console.log("Club Data: " + JSON.stringify(res.data));
        res.data.club.books.forEach((book_id) =>
          readingHistory.push(
            axiosInstance.get(`books/${book_id}`).then((bookRes) => {
              console.log("Book Response: " + JSON.stringify(bookRes.data));
            })
          )
        );
        console.log("Reading History: " + JSON.stringify(readingHistory));
        // res.data.books.map(book_id => {
        //     axiosInstance
        //         .get(`/books/${book_id}`)
        //         .then(bookRes => {
        //             console.log("Book Res: " + JSON.stringify(bookRes.data))

        //         })
        // })
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

  let buttonState =
    memberStatus === "notApplied" ? "Apply" : "Withdraw Application";

  function applyToClub(id, user_id, e) {
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

  function withdrawApplication(id, user_id, e) {
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

  return (
    <Container fluid>
      <Row style={{ display: "flex" }}>
        <Col xs={8}>
          <span style={{ fontFamily: "Source Sans Pro", fontSize: "15px" }}>
            {club.description}
          </span>
        </Col>
        <Col>
          <Gravatar
            email="blah@blah.com"
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
                : withdrawApplication(club_id, user_id)
            }
            style={memberStatus === "notApplied" ? applyStyle : appliedStyle}
          >
            {buttonState}
          </Button>
        )}
        {memberStatus === "banned" && (
          <ParaText>You are banned from this club</ParaText> // TODO: Add styling
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

      {/* Something wrong with the history array
             {history.map(book =>
                <Row>
                    <BookProfile>
                        <Col xs={4}>
                            <Gravatar email='blah@blah.com' size={70}></Gravatar>
                        </Col>
                        <Col xs={8}>
                            {book}
                        </Col>
                    </BookProfile>
                </Row>
            )} */}
    </Container>
  );
};

export default LandingProfile;
