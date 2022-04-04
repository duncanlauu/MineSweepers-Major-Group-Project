import React from "react";
import { Row, Col } from "reactstrap";
import { BookStarsContainer, BookLine, BookNameContainer, ParaText } from "../UserProfileElements";
import ReactStars from "react-stars";
import { useNavigate } from "react-router";

export default function SingleBookRating(props) {

  const navigate = useNavigate();

  const navigateToBook = (e) => {
    navigate(`/book_profile/${props.book.book__ISBN}`);
  };

  return (
    <BookLine>
      <Row onClick={navigateToBook} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Col xs="2">
          <img
            src={props.book.book__image_links_small}
            alt="Book's cover"
            style={{ height: "7rem", width: "5rem" }}
          />
        </Col>
        <Col xs="6" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <BookNameContainer>
            <ParaText>
              {props.book.book__title}
            </ParaText>
          </BookNameContainer>
        </Col>
        <Col xs="4" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} data-testid={"rating"}>
          <BookStarsContainer style={{ marginRight: "1rem" }}>
            <ReactStars
              count={5}
              edit={false}
              value={props.book.rating / 2}
              size={25}
              color2={"#ffd700"}
            />
          </BookStarsContainer>
        </Col>
      </Row>
    </BookLine>
  );
}
