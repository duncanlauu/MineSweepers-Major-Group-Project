import React from 'react'
import { Row } from 'reactstrap'
import { HeadingText } from '../Login/LoginElements'
import { BookText, MeetingContainer, MeetingHeading, MeetingPara, ParaText } from './ClubProfileElements'

function IndividualMeetingCard(props) {
  return (
    <Row>
        <MeetingContainer>
          <MeetingHeading>{props.name}</MeetingHeading><br />
          <a href={`/book_profile/${props.book_id}`}>
            <BookText>{props.book}</BookText>
          </a><br />
          <MeetingPara>
            {props.description.length > 220
            ? props.description.slice(0,220) + "..."
            : props.description
            }
          </MeetingPara>
        </MeetingContainer>
    </Row>
  )
}

export default IndividualMeetingCard