import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Row, Col } from "reactstrap";
import { BookLine } from "./UserProfileElements";
import ReactStars from "react-stars";
import { useNavigate } from "react-router";

export default function SingleClub(props) {
    const club = props.club;

  const navigate = useNavigate();

  const navigateToClub = (e) => {
    navigate(`/club_profile/${props.book_id}`);
  };

  return (
    <div>
      <BookLine>
        <Row style={{ height: "5rem" }} onClick={navigateToClub}>
          <Col
            xs="6"
            style={{
              height: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "15px",
            }}
          >
            {club.name}
          </Col>
        </Row>
      </BookLine>
    </div>
  );
}
