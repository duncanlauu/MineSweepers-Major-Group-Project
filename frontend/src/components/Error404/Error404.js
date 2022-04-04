import React from 'react'
import { Row, Col, Container } from 'reactstrap'
import { Text404 } from './Error404Elements'


const Error404 = () => {

  return (
    <div>
      <Container fluid>
        <Row>
          <Col />
          <Col>
            {/* <iframe src="./dino.html" height="300" width="800"></iframe> */}
            <Text404>404: Page Not Found</Text404><br />
            <span>This page is currently in development or does not exist.</span>
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  )
}

export default Error404