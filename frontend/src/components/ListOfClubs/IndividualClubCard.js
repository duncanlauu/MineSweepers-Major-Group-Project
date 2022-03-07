import React from 'react'
import Gravatar from 'react-gravatar'
import { Container } from 'reactstrap'

function IndividualClubCard() {
  return (
    <Container
        fluid
        style={{
            backgroundColor:"#fff",
            borderRadius:"5px",
            padding: "1rem",
            alignItems: "center",
            justifyContent: "center"
        }}>
        <Gravatar email='blah@blah.com' style={{ borderRadius:"100px" }} />
        
    </Container>
  )
}

export default IndividualClubCard