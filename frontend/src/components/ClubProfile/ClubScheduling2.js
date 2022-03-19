import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Row, Button, Container, Col, Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap'
import axiosInstance from '../../axios';
import useGetUser from '../../helpers';
import { FormLayout } from '../CreateClub/CreateClubElements';
import { HeadingText } from '../Login/LoginElements'
import { ClubProfile } from './ClubProfileElements';

const ClubScheduling2 = () => {
    const { club_id } = useParams();
    console.log("Club ID on scheduling page: " + club_id);

    const user = useGetUser();
    console.log("User ID on scheduling: " + user.id);

    const [bookData, setBookData] = useState([]);
    const [books, setBooks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    

    function toggleModal() {
        setModalVisible(!modalVisible);
    }

    const initialFormData = Object.freeze({
        name: '',
        description: '',
        book: '',
        start_time: '',
        end_time: '',
        link: ''
    })

    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        console.log("changes")
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
            .post(`scheduling/`, {
                name: formData.name,
                description: formData.description,
                club: club_id,
                organiser: user.id,
                attendees: [2, 8, 110],
                book: bookData,
                start_time: formData.start_time,
                end_time: formData.end_time,
                link: formData.link
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    function getRecommendedBooks() {
        axiosInstance
            .post(`recommender/0/10/${club_id}/top_n_for_club/`, {})
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

        axiosInstance
            .get(`recommender/0/10/${club_id}/top_n_for_club/`)
            .then(res => {
                console.log(res);
                setBooks(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getRecommendedBooks();
    }, []);    

    function IndividualMeetingCard(props) {
        // const meetingName = props.name;
        // const meetingDescription = props.description;
        // const book = props.book
        // const startTime = props.startTime
        // const endTime = props.endTime
        // const url = props.url

        return(
            <ClubProfile>
                <Col xs={9}>
                    <h5>Meeting Name</h5>
                </Col>
            </ClubProfile>
        );
    }

  return (
    <div>
        <Container>
                <HeadingText>Past Meetings</HeadingText>
                <Button
                    style={{ float:"right" }}
                    onClick={toggleModal}>
                        Schedule Meeting
                </Button>
        </Container><br />
        <Container fluid>
            <IndividualMeetingCard />
        </Container>
        <Modal
            isOpen={modalVisible}
            toggle={toggleModal}
            style={{ left:0, top:150 }}>
                <ModalHeader toggle={toggleModal}>
                    <HeadingText>Create a new Meeting</HeadingText>
                </ModalHeader>
                <ModalBody>
                    <FormLayout>
                        <FormGroup>
                            <Label for='name'>Name</Label>
                            <Input
                                id='name'
                                name='name'
                                onChange={handleChange}
                                style={{border: "0", backgroundColor: "#F3F3F3"}} />
                        </FormGroup>
                        <FormGroup>
                            <Label for='description'>Description</Label>
                            <Input
                                id='description'
                                name='description'
                                onChange={handleChange}
                                style={{border: "0", backgroundColor: "#F3F3F3"}} />
                        </FormGroup>
                        <FormGroup>
                            <Label for='book'>Book</Label>
                            <select
                                value={bookData}
                                onChange={(e) => setBookData(e.target.value)}
                                style={{border: "0", backgroundColor: "#F3F3F3"}}>
                                    <option />
                                    {books.map(book =>
                                        <option>{book.book}</option>
                                    )}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label for="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                name="start_time"
                                type="datetime-local"
                                onChange={handleChange}
                                style={{border: "0", backgroundColor: "#F3F3F3"}} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="end_time">End Time</Label>
                            <Input
                                id="start_time"
                                name="start_time"
                                type="datetime-local"
                                onChange={handleChange}
                                style={{border: "0", backgroundColor: "#F3F3F3"}} />
                        </FormGroup>
                        <FormGroup>
                            <Label for='link'>Meeting Link</Label>
                            <Input
                                id='link'
                                name='link'
                                onChange={handleChange}
                                style={{border: "0", backgroundColor: "#F3F3F3"}} />
                        </FormGroup>
                        <FormGroup>
                            <Col sm={{size: 10, offset: 5}}>
                                <Button
                                    type="submit"
                                    className="submit"
                                    onClick={handleSubmit}
                                    style={{backgroundColor: "#653FFD", width: "7rem"}}>
                                        Create
                                 </Button>
                            </Col>
                        </FormGroup>
                    </FormLayout>
                </ModalBody>
        </Modal>
    </div>
  )
}

export default ClubScheduling2