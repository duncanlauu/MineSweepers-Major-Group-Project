import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Col, Container, Row} from "reactstrap";
import {HeadingText, ParaText} from "../CreateClub/CreateClubElements";
import {MeetingProfile} from "./MeetingPageElements";
import {downloadCalendar} from "../../downloadCalendar";
import MainNav from "../Nav/MainNav";


export default function Meetings() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [meetings, updateMeetings] = useState([])

    useEffect(() => {
        getTheMeetings()
    }, [user]);

    const getTheMeetings = () => {
        axiosInstance
            .get(`meetings/${user.id}`, {})
            .then((res) => {
                updateMeetings(res.data)
            })
    }

    return (
        <div id="ParentDiv">
            <Row style={{marginBottom: "3rem"}}>
                <MainNav/>
            </Row>
            <Row>
            </Row>
            <Container fluid>
                <Row style={{marginTop: "6rem"}}>
                    <Col/>
                    <Col xs={9}>
                        <HeadingText>See your meetings</HeadingText>
                        <ParaText/>

                        <ul>
                            {
                                meetings.length > 0 && Array.isArray(meetings) && meetings.map(meeting =>
                                    <li>
                                        <MeetingProfile>
                                            <Col xs={2}>
                                                <a href={`/book_profile/${meeting['book']['ISBN']}`}>
                                                    <img src={meeting['book']['image_links_small']}
                                                         alt={"The book's cover"} data-testid="image"/>
                                                </a>
                                            </Col>
                                            <Col xs={6}>
                                                <a href={`/club_profile/${meeting['club']}`}>
                                                    {meeting['name']}
                                                </a>
                                            </Col>
                                            <Col xs={4} onClick={() => downloadCalendar(meeting['id'])}>
                                                Click here to download the event
                                            </Col>
                                        </MeetingProfile>
                                    </li>
                                )
                            }
                        </ul>
                    </Col>
                    <Col/>
                </Row>
            </Container>
        </div>
    );
}