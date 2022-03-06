import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { HeadingText } from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import axios from 'axios'

class IndividualClubCard extends React.Component {
  render() {
    const { email } = this.props
    return(
      <Container>
        <h3>{email}</h3>
      </Container>
    )
  }
}

export default class ListOfClubs extends React.Component {

  constructor() {
    super();

    this.state = {
      clubs: []
    }
  }

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/users`).then(
      response => {
        console.log(response)
        this.setState({
          clubs: response.data
        });
      }
    )
  }

  render() {
    return (
      <Container fluid>
        <Row style={{ marginBottom: "3rem" }}>
            <Nav />
        </Row>
        <Row>
            <Col />
            <Col xs={8}>
                <HeadingText>Club Database</HeadingText>
                <ul>
                  {this.state.clubs.map(club => <li>{club.name}</li>)}
                </ul>
            </Col>
            <Col />
        </Row>
      </Container>
    )
  }
}

