import { Card, CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap";
import ReactStars from "react-stars";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import { useEffect } from "react";
import { borderRadius } from "@mui/system";

export default function BookRatingCard(props) {
  const title = props.title;
  const author = props.author;
  const image = props.image;
  const id = props.id;

  const [rate, setRating] = useState(0);


  const ratingChanged = (newRating) => {
    console.log("Initial rating: " + props.initialRating);
    console.log("Rating changed: " + newRating + " previous rating: " + rate);
    props.parentCallBack([id], newRating);
    setRating(newRating);
  };

  const clearRating = () => {
    console.log("Clearing rating");
    props.parentCallBack([id], 0);
    setRating(0);
  };

  return (
    <>
      <Card
        style={{
          height: "610px",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px",
          border: " 3px solid rgba(0,0,0,.125)",
        }}
      >
        <CardImg src={image} top style={{ height: "450px" }} />

        <CardBody>
          <CardTitle tag="h4">{title}</CardTitle>

          <CardSubtitle
            style={{ marginBottom: "1rem" }}
            className="mb-2 text-muted"
            tag="h7"
          >
            {author}
          </CardSubtitle>

          <Row style={{ position: "absolute", bottom: "1rem" }}>
            <Col xs="8">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                value={rate}
                size={24}
                color2={"#ffd700"}
              />
            </Col>
              <Col xs="4">
                <Button
                  type="submit"
                  className="submit"
                  onClick={clearRating}
                  style={{ backgroundColor: "#653FFD", width: "7rem" }}
                >
                  Clear
                </Button>
              </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
