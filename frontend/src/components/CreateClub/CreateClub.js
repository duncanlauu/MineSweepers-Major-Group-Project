import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap'
import { SignUpContainer, FormLayout, HeadingText, ParaText, RadioHeading, RadioPara } from "./CreateClubElements";
import axiosInstance from '../../axios'
import MainNav from '../Nav/MainNav'

export default function CreateClub() {

    const [nameErr, setNameErr] = useState('')
    const [descriptionErr, setDescriptionErr] = useState('')
    const [privacyValue, setPrivacyValue] = useState(true);
    const [visibilityValue, setVisibilityValue] = useState(true);

    const navigate = useNavigate();

    const initialFormData = Object.freeze({
        name: '',
        description: '',
        visibility: null,
        public: null,
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handlePrivacyChange = () => {
        setPrivacyValue(!privacyValue);
    }

    const handleVisibilityChange = () => {
        setVisibilityValue(!visibilityValue);
    }

    const RadioButton = ({card, value, onClick}) => {
        return (
            <label>
                <input type="radio" checked={value} onClick={onClick} />
                {card}
            </label>
        );
    }

    function DropdownCard(props) {
        return (
            <Container fluid style={{ display: 'flex', flexDirection: 'row' }}>
                <Col xs={3}>
                    <img src={props.imageURL} alt="Privacy Settings" />
                </Col>
                <Col xs={9} style={{ padding: '0px' }}>
                    <RadioHeading>{props.setting}</RadioHeading><br />
                    <RadioPara>{props.desc}</RadioPara>
                </Col>
            </Container>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axiosInstance
            .post(`clubs/`, {
                name: formData.name,
                description: formData.description,
                visibility: visibilityValue,
                public: privacyValue
            })
            .then((res) => {
                navigate('/club_profile/' + res.data.id)
            })
            .catch((e) => {
                setNameErr(e.response.data.name)
                setDescriptionErr(e.response.data.description)
            })
    }

    return (
        <div id="ParentDiv" style={{ overflow: "hidden" }}>
            <Row>
                <MainNav />
            </Row>
            <Container fluid>
                <Row style={{ marginTop: "6rem" }}>
                    <Col />
                    <Col>
                        <HeadingText>Create a Club</HeadingText>
                        <ParaText />
                        <SignUpContainer style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
                            <FormLayout> {/*  might have to add more info here */}
                                <FormGroup>
                                    <Label for="name"><ParaText>Name</ParaText></Label>
                                    <Input
                                        id="name"
                                        data-testid="name"
                                        name="name"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />
                                </FormGroup>
                                <div data-testid="name-errors">{nameErr}</div>

                                <FormGroup>
                                    <Label for="description"><ParaText>Description</ParaText></Label>
                                    <Input
                                        id="description"
                                        type="textarea"
                                        data-testid="description"
                                        name="description"
                                        onChange={handleChange}
                                        style={{ border: "0", backgroundColor: "#F3F3F3" }}
                                    />
                                </FormGroup>
                                <div>{descriptionErr}</div>

                                <FormGroup>
                                    <Label for="privacy"><ParaText>Privacy</ParaText></Label>
                                    <RadioButton
                                        onClick={handlePrivacyChange}
                                        value={privacyValue === false}
                                        card={
                                            <DropdownCard
                                                imageURL="../../../static/images/PrivacyTrue.svg"
                                                setting="Private"
                                                desc="Users will not be able to join your club without your approval." />
                                        } />
                                    <RadioButton
                                        onClick={handlePrivacyChange}
                                        value={privacyValue === true}
                                        card={
                                            <DropdownCard
                                                data-testid="privacy-public"
                                                imageURL="../../../static/images/PrivacyFalse.svg"
                                                setting="Public"
                                                desc="Allows access to any user who wishes to join the club." />
                                        } />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="visibility"><ParaText>Visibility</ParaText></Label>
                                    <RadioButton
                                        onClick={handleVisibilityChange}
                                        value={visibilityValue === true}
                                        card={
                                            <DropdownCard
                                                data-testid="visibility-visible"
                                                imageURL="../../../static/images/VisibilityTrue.svg"
                                                setting="Visible"
                                                desc="Your club will be visible in searches and the database." />
                                        } />
                                    <RadioButton
                                        onClick={handleVisibilityChange}
                                        value={visibilityValue === false}
                                        card={
                                            <DropdownCard
                                                imageURL="../../../static/images/VisibilityFalse.svg"
                                                setting="Invisible"
                                                desc="Your club will be invisible to all users. It cannot be searched or seen in the database." />
                                        } />
                                </FormGroup>

                                <FormGroup>
                                    <Col sm={{ size: 10, offset: 4 }}>
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handleSubmit}
                                            style={{ backgroundColor: "#653FFD", width: "7rem" }}
                                        >
                                            Create
                                        </Button>
                                    </Col>
                                </FormGroup>

                            </FormLayout>
                        </SignUpContainer>

                    </Col>
                    <Col />
                </Row>
            </Container>
        </div>
    );
}