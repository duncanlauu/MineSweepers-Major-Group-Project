import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Row, Col } from "reactstrap";
import { BookLine } from "./UserProfileElements";
import ReactStars from "react-stars";
import { useNavigate } from "react-router";

export default function SingleBookRating(props) {
  const [book, setBook] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Book id in call : ", props.book_id);
    axiosInstance
      .get(`books/${props.book_id}`)
      .then((res) => {
        console.log("Book data: ", res.data);
        setBook(res.data);
        console.log("Book: ", res.data.book);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigateToBook = (e) => {
    navigate(`/book_profile/${props.book_id}`);
  };

  return (
    <div>
      <BookLine>
        <Row style={{ height: "5rem" }} onClick={navigateToBook}>
          <Col xs="2">
            <img
              src={book.image_links_small}
              alt="Book's cover"
              style={{ height: "5rem", width: "5rem" }}
            />
          </Col>

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
            {book.title}
          </Col>
          <Col xs="3" style={{ display: "flex", justifyContent: "flex-end" }}>
            <ReactStars
              count={5}
              edit={false}
              value={props.rating / 2}
              size={21}
              color2={"#ffd700"}
            />
          </Col>
        </Row>
      </BookLine>
    </div>
  );
}
