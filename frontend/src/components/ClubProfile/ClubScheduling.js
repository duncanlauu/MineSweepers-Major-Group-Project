import React from 'react'
import { Button, Row } from 'reactstrap'
import { HeadingText } from '../Login/LoginElements'
import { ScheduleButton } from './ClubProfileElements'

const ClubScheduling = () => {
  return (
    <>
        <Row style={{ display:'inline-block', width:'100%' }}>
            <HeadingText>Meeting History</HeadingText>
            <Button style={{ float:'right', width:'fit-content' }}>Schedule a Meeting</Button>
        </Row>
    </>
  )
}

export default ClubScheduling