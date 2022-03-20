import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Button, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {FormLayout, HeadingText, ParaText, SignUpContainer} from "../CreateClub/CreateClubElements";
import useGetUser from "../../helpers";


export default function Scheduling() {
    const user = useGetUser();
    const [books, setBooks] = useState([]);
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        getRecommendedBooks();
    }, []);

    const getRecommendedBooks = () => {
        axiosInstance
            .post('recommender/0/10/3/top_n_for_club/', {})
            .then(() => {
                axiosInstance
                    .get('recommender/0/10/3/top_n_for_club/', {})
                    .then((res) => {
                        let book_list = []
                        for (let i = 0; i < res.data.length; ++i) {
                            book_list.push({id: res.data[i]['book'], name: res.data[i]['book']})
                        }
                        setBooks(book_list)
                        console.log(book_list)
                        console.log(books)
                    })
            })
    }

    const initialFormData = Object.freeze({
        name: '',
        description: '',
        book: '',
        start_time: '',
        end_time: '',
        link: ''
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        console.log("changes")
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", formData)


        axiosInstance
            .post(`scheduling/`, {
                name: formData.name,
                description: formData.description,
                club: 3,
                organiser: user.id,
                attendees: [2, 8, 110],
                book: bookData,
                start_time: formData.start_time,
                end_time: formData.end_time,
                link: formData.link
            })
            .then((res) => {
                console.log(res.data)
            })


        // axiosInstance
        //     .get('singleclub/3', {})
        //     .then((res) => {
        //         club = res.data
        //         console.log(res)
        //     })


    }

    let booksList = books.length > 0
        && books.map((item, i) => {
            return (
                <option key={i} value={item.id}>{item.name}</option>
            )
        }, this);

    if (books.length > 0) {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                            <HeadingText>Create a meeting</HeadingText>
                            <ParaText/>
                            <SignUpContainer>
                                <FormLayout>
                                    <FormGroup>
                                        <Label for="name">Name </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="description"> Description </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="book"> Book </Label>
                                        <select
                                            value={bookData}
                                            onChange={(e) => setBookData(e.target.value)}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        >
                                            <option></option>
                                            {books.map(book =>
                                                <option>{book.name}</option>
                                            )}
                                        </select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="start_time"> Start time </Label>
                                        <Input
                                            id="start_time"
                                            name="start_time"
                                            type="datetime-local"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="end_time"> End time </Label>
                                        <Input
                                            id="end_time"
                                            name="end_time"
                                            type="datetime-local"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="link"> Meeting link </Label>
                                        <Input
                                            id="link"
                                            name="link"
                                            onChange={handleChange}
                                            style={{border: "0", backgroundColor: "#F3F3F3"}}
                                        />
                                    </FormGroup>


                                    <FormGroup>
                                        <Col sm={{size: 10, offset: 5}}>
                                            <Button
                                                type="submit"
                                                className="submit"
                                                onClick={handleSubmit}
                                                style={{backgroundColor: "#653FFD", width: "7rem"}}
                                            >
                                                Create
                                            </Button>
                                        </Col>
                                    </FormGroup>

                                </FormLayout>
                            </SignUpContainer>

                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        );
    } else {
        return (
            <div>Wait please</div>
        )
    }
}