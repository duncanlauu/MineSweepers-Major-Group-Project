import React, {useEffect, useState} from 'react'
import {Container, Row, Col, Button, CardBody, CardTitle, CardSubtitle, Card} from 'reactstrap'
import {HeadingText} from '../Login/LoginElements'
import Nav from '../Nav/Nav'
import axiosInstance from '../../axios'
import Gravatar from 'react-gravatar'
import {VariableWidthGrid} from 'react-variable-width-grid'
import {Link} from 'react-router-dom'

function ListOfClubs() {
    const [clubs, setClubs] = useState([]);
    const columnsPerRow = 4;

    const getClubs = () => {
        axiosInstance
            .get(`clubs/`)
            .then(res => {
                console.log(res);
                setClubs(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getColumnsForRow = () => {
        const items = clubs.map((club, index) => {
            if (index % columnsPerRow === 0) {
                return (
                    <Card key={index}
                          style={{margin: "1rem", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Gravatar email={club.owner.email} data-testid="gravatar" style={{borderRadius: "100px", marginTop: "1rem"}}/>
                        <CardBody>
                            <CardTitle>{club.name}</CardTitle>
                            <CardSubtitle>{club.members.length} Members</CardSubtitle>
                            <Link to={`/club_profile/${club.id}`}>
                                <Button>Visit Profile</Button>
                            </Link>
                        </CardBody>
                    </Card>
                );
            }
            return (
                <Card key={index}
                      style={{margin: "1rem", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Gravatar email={club.owner.email} style={{borderRadius: "100px", marginTop: "1rem"}}/>
                    <CardBody>
                        <CardTitle>{club.name}</CardTitle>
                        <CardSubtitle>{club.members.length} Members</CardSubtitle>
                        <Link to={`/club_profile/${club.id}`}>
                            <Button>Visit Profile</Button>
                        </Link>
                    </CardBody>
                </Card>
            );
        })

        return <VariableWidthGrid>{items}</VariableWidthGrid>
    }

    useEffect(() => {
        getClubs();
    }, [])

    return (
        <Container fluid>
            <Row style={{marginBottom: "3rem"}}>
                <Nav/>
            </Row>
            <Row xs={1} md={columnsPerRow}>
                <Col xs={2}/>
                <Col xs={8}>
                    <HeadingText>Club Database</HeadingText>
                    {getColumnsForRow()}
                </Col>
                <Col xs={2}/>
            </Row>
        </Container>
    )
}

export default ListOfClubs