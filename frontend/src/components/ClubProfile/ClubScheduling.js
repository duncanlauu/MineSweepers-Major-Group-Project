import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { HeadingText } from "../Login/LoginElements";
import { ScheduleButton } from "./ClubProfileElements";

const ClubScheduling = () => {
  const { club_id } = useParams();
  console.log("Club ID on scheduling: " + club_id);

  return (
    <>
      <Row style={{ display: "inline-block", width: "100%" }}>
        <HeadingText>Meeting History</HeadingText>
        <Link
          to={`/scheduling/${club_id}`}
          style={{ color: "#653FFD", textDecoration: "none", fontSize: "15px" }}
        >
          <Button style={{ float: "right", width: "fit-content" }}>
            Schedule a Meeting
          </Button>
        </Link>
      </Row>
    </>
  );
};

export default ClubScheduling;
