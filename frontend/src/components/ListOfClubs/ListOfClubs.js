import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { HeadingText, ParaText } from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import axiosInstance from '../../axios'
import Gravatar from 'react-gravatar'

function IndividualClubsCard(props) {
  return (
    <Container fluid>
      <Gravatar email='blah@blah.com' style={{ borderRadius:"100px" }} />
      <HeadingText>{props.name}</HeadingText>
      <Button>Apply</Button>
    </Container>
  )
}

export default class ListOfClubs extends React.Component {

  constructor() {
    super();

    this.state = {
      clubs: []
    }
  }

  componentDidMount() {
    axiosInstance.get(`clubs/`).then(
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
                  {this.state.clubs.map(club =>
                      <li>
                        <IndividualClubsCard
                          name={club.name}
                        />
                      </li>
                    )
                  }
                </ul>
            </Col>
            <Col />
        </Row>
      </Container>
    )
  }
}
