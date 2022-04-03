import React from 'react'
import {Row} from 'reactstrap'
import {BookText, MeetingContainer, MeetingHeading, MeetingPara} from './ClubProfileElements'
import {downloadCalendar} from "../../downloadCalendar";

function IndividualMeetingCard(props) {
    return (
        <Row>
            <MeetingContainer>
                <MeetingHeading>
                    <div onClick={() => downloadCalendar(props.id)}>{props.name}</div>
                </MeetingHeading><br/>
                <a href={`/book_profile/${props.book_id}`}>
                    <BookText>{props.book}</BookText>
                </a><br/>
                <MeetingPara>
                    {props.description.length > 220
                        ? props.description.slice(0, 220) + "..."
                        : props.description
                    }
                </MeetingPara>
            </MeetingContainer>
        </Row>
    )
}

export default IndividualMeetingCard