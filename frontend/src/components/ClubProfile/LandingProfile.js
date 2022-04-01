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
    const clubBooks = [];
    
    const [clubApps, setClubApps] = useState([]);

    const currentUser = useGetUser();
    const user_id = currentUser.id
    console.log("User ID: " + user_id);

    const [applied, setApplied] = useState(false);

    useEffect(() => {
        axiosInstance
            .get(`clubs/`)
            .then(res => {
                console.log("All Clubs: " + JSON.stringify(res.data[0].id));
                for (let i = 0; i < res.data.length; i++) {
                    clubApps.push(res.data[i].id);
                }
                
            })
    }, [])

    useEffect(() => {
        setApplied(JSON.parse(window.localStorage.getItem('applied')));
        JSON.parse(window.localStorage.getItem('applications'))
    }, []);

    useEffect(() => {
        window.localStorage.setItem('applied', applied)
    }, [applied])

    const [modalVisible, setModalVisible] = useState(false);

    function IndividualBookCard(props) {
        return(
            <Row>
                <BookProfile>
                    <Col xs={4}>
                        <img src={props.imageURL} />
                    </Col>
                    <Col xs={8}>
                        {props.title}
                    </Col>
                </BookProfile>
            </Row>
        );
    }

    useEffect(() => {
        let mems = [];
        axiosInstance
            .get(`singleclub/${club_id}`)
            .then(res => {
                console.log(res);
                setClub(res.data);
                console.log("Club Data: " + JSON.stringify(res.data));
                for (let i = 0; i < res.data.books.length; i++) {
                    readingHistory.push(
                        res.data.books[i]
                    )
                }
                getReadingHistory();
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    if (!club) return null;

    async function getReadingHistory() {
        let promises = [];
        for (let i = 0; i < readingHistory.length; i++) {
            promises.push(axiosInstance.get(`books/${readingHistory[i]}`))
        }
        const res = await Promise
            .all(promises);
        res.forEach(book => clubBooks.push(book.data));
        console.log(
            clubBooks.forEach((book) => console.log(book.ISBN))
        );
        return console.log(res);
    }

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
                setApplied(!applied);
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
            <ul>
                {clubBooks.forEach((book) => (
                    <li>
                        {book.ISBN}
                    </li>
                ))}
            </ul>
        </Container>
    );
}

export default LandingProfile