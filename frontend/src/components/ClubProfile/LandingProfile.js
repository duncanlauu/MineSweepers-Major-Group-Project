import React, {useState, useEffect} from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import Gravatar from 'react-gravatar';
import {BookProfile} from './ClubProfileElements';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import useGetUser from '../../helpers';

const LandingProfile = () => {

    const { club_id } = useParams();
    console.log("Club ID: " + club_id);
    const [club, setClub] = useState(null);
    const [readingHistory, setReadingHistory] = useState([]);
    const [ownerDetails, setOwnerDetails] = useState(null);
    let history = [];

    const currentUser = useGetUser();
    const user_id = currentUser.id
    console.log("User ID: " + user_id);

    const [applied, setApplied] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    function IndividualBookCard(props) {
        return(
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <Gravatar email='blah@blah.com' size={70}></Gravatar>
                    </Col>
                    <Col xs={8}>
                        {book}
                    </Col>
                </BookProfile>
            </Row>
        );
    }

    useEffect(() => {
        axiosInstance
            .get(`singleclub/${club_id}`)
            .then(res => {
                console.log(res);
                setClub(res.data);
                console.log("Club Data: " + JSON.stringify(res.data));
                res.data.books.forEach(book_id =>
                    readingHistory.push(
                        axiosInstance
                            .get(`books/${book_id}`)
                            .then(bookRes => {
                                console.log("Book Response: " + JSON.stringify(bookRes.data))
                            })
                    )
                )
                console.log("Reading History: " + JSON.stringify(readingHistory))
                // res.data.books.map(book_id => {
                //     axiosInstance
                //         .get(`/books/${book_id}`)
                //         .then(bookRes => {
                //             console.log("Book Res: " + JSON.stringify(bookRes.data))
                            
                //         })
                // })
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    if (!club) return null;

    const applyStyle = {
        width: "17rem",
        margin: "1rem",
        fontFamily: "Source Sans Pro",
        borderRadius: "5px",
        backgroundColor: "#653FFD",
        border: "2px solid #653DDF",
    }

    const appliedStyle = {
        width: "17rem",
        margin: "1rem",
        fontFamily: "Source Sans Pro",
        borderRadius: "5px",
        backgroundColor: "#fff",
        border: "2px solid #653DDF",
        color: "#653FFD"
    }

    let buttonState = applied ? "Applied" : "Apply"

    function applyToClub(id, user_id, e) {
        const action = 'apply'
        axiosInstance
            .put(`singleclub/${id}/${action}/${user_id}`, {})
            .then(res => {
                console.log(res);
                setApplied(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    

    return (
        <Container fluid>
            <Row style={{display: "flex"}}>
                <Col xs={8}>
                <span style={{fontFamily: "Source Sans Pro", fontSize: "15px"}}>
                    {club.description}
                </span>
                </Col>
                <Col>
                    <Gravatar email="blah@blah.com" size={100} style={{ borderRadius:"100px" }} />
                </Col>
            </Row>
            <Row>
                <Button
                    onClick={(e) => applyToClub(club_id, user_id)}
                    style={applied ? appliedStyle : applyStyle}>
                        {buttonState}
                    </Button>
            </Row>
            <Row>
                <h3 style={{fontFamily: "Source Sans Pro", marginTop: "2rem", fontWeight: "600"}}>Reading History</h3>
            </Row>
            
            {/* Something wrong with the history array
             {history.map(book =>
                <Row>
                    <BookProfile>
                        <Col xs={4}>
                            <Gravatar email='blah@blah.com' size={70}></Gravatar>
                        </Col>
                        <Col xs={8}>
                            {book}
                        </Col>
                    </BookProfile>
                </Row>
            )} */}
        </Container>
    );
}

export default LandingProfile