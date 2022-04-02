import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row } from "reactstrap";
import axiosInstance from "../../axios";
import { HeadingText } from "../Login/LoginElements";
import { ScheduleButton } from "./ClubProfileElements";

const ClubScheduling = () => {
  const { club_id } = useParams();
  console.log("Club ID on scheduling: " + club_id);

  const buttonStyle = {
    float: "right",
    width: "fit-content",
    backgroundColor: "#653FFD",
    fontFamily: "Source Sans Pro",
    color: "#fff"
  }

  return (
    <>
      <Row style={{ display: "inline-block", width: "100%" }}>
        <HeadingText>Meeting History</HeadingText>
        <Link
          to={`/scheduling/${club_id}`}
          style={{ color: "#653FFD", textDecoration: "none", fontSize: "15px" }}
        >
          <Button style={buttonStyle}>
          <img src="../../../static/images/MeetingScheduleIcon.svg" style={{ paddingRight:"10px" }} />
          <span>Schedule a Meeting</span>
          </Button>
        </Link>
      </Row>
      <Row>

      </Row>
    </>
  );
};

export default ClubScheduling;
