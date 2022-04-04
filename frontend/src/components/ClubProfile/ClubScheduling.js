import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Container, Row } from "reactstrap";
import axiosInstance from "../../axios";
import { HeadingText } from "../Login/LoginElements";
import IndividualMeetingCard from "./IndividualMeetingCard";

const ClubScheduling = () => {
    const { club_id } = useParams();
    console.log("Club ID on scheduling: " + club_id);
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        axiosInstance
            .get(`club_meetings/${club_id}`)
            .then(res => {
                setMeetings(res.data);
            })
    }, [])

    const buttonStyle = {
        float: "right",
        width: "fit-content",
        backgroundColor: "#653FFD",
        fontFamily: "Source Sans Pro",
        color: "#fff"
    }

    return (
        <>
            <Row style={{ display: "inline-block", width: "100%"}}>
                <HeadingText>All meetings </HeadingText>
                <Link
                    to={`/scheduling/${club_id}`}
                    style={{ color: "#653FFD", textDecoration: "none", fontSize: "15px" }}
                >
                    <Button style={buttonStyle}>
                        <img src="../../../static/images/MeetingScheduleIcon.svg" style={{ paddingRight: "10px" }} />
                        <span>Schedule a meeting</span>
                    </Button>
                </Link>
            </Row>
            <Container>
                {meetings.map(meeting =>
                    <IndividualMeetingCard
                        id={meeting.id}
                        name={meeting.name}
                        book_id={meeting.book.ISBN}
                        book={meeting.book.title}
                        description={meeting.description} />
                )}
            </Container>
        </>
    );
};

export default ClubScheduling;
