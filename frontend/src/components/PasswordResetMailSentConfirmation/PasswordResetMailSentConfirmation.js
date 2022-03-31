import React from 'react'
import { Row, Col, Container } from 'reactstrap'
import { Link } from 'react-router-dom'


const PasswordResetMailSentConfirmation = () => {

  return (
    <div>
      <Container fluid>
        <Row>
          <Col />
          <Col>
            <h1>Confirmation Sent</h1><br />
            <span>If an account with this email exists, we have sent you instructions for resetting your password.</span>
            <br />
            <Link to='/'>Landing page</Link>
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  )
}

export default PasswordResetMailSentConfirmation