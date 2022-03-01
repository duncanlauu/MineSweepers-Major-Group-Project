import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import Nav from '../Navbar/Nav'

const UserSettings = () => {
  return (
    <Container fluid>
        <Row style={{ marginBottom:"3rem" }}>
            <Nav />
        </Row>
        <Row>
            <Col />
            <Col xs={3}>

            </Col>
            <Col xs={7}></Col>
            <Col />
        </Row>
    </Container>
  )
}

export default UserSettings