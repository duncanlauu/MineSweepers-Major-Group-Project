import React from 'react'
import { BookProfile } from './ClubProfileElements'
import { Col } from 'reactstrap'
import Gravatar from 'react-gravatar';

function ClubApplicants() {
  return (
    <div style={{ alignContent:"center", justifyContent:"center" }}>
        <BookProfile>
          <Col xs={3}>
            <Gravatar email='blah@blah.com' size={70}></Gravatar>
          </Col>
          <Col xs={9}>
          </Col>
        </BookProfile>
        <BookProfile />
        <BookProfile />
    </div>
  )
}

export default ClubApplicants