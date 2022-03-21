import React, {useState} from "react";
import {useNavigate} from "react-router";
import {Container, Row, Col, FormGroup, Label, Input, Button} from 'reactstrap'
import {SignUpContainer, FormLayout, HeadingText, ParaText} from "./CreateClubElements";
import axiosInstance from '../../axios'

export default function CreateClub() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        name: '',
        description: '',
        visibility: true,
        public: true,
    })
<<<<<<< HEAD
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("submitting", formData)

    axiosInstance
      .post(`clubs/`, { 
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        public: formData.public
      })
      .then((res) => {
        navigate("/home/") 
        console.log(res)
        console.log(res.data)
      })
  }

  // Todo: move styles to a CSS file?
  return (


    <div id="ParentDiv">

      <Row>
        
      </Row>


      <Container fluid>
        <Row style={{ marginTop: "6rem" }}>
          <Col />
          <Col>
            <HeadingText>Create a Club</HeadingText>
            <ParaText></ParaText>
            <SignUpContainer>
              <FormLayout> {/*  might have to add more info here */}
                <FormGroup>
                  <Label for="name">Name </Label>
                  <Input
                    data-testid="name"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="description"> description </Label>
                  <Input
                    data-testid="description"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    style={{ border: "0", backgroundColor: "#F3F3F3" }}
                  />
                </FormGroup>

                
                <FormGroup>
                  <Col sm={{ size: 10, offset: 5 }}>
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
=======

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData, // ... is spread syntax. Slits the iterable into individual elements
            [e.target.name]: e.target.value.trim(), // Referring to the forms elements name attribute. Trimming whitespace
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", formData)

        axiosInstance
            .post(`clubs/`, {
                name: formData.name,
                description: formData.description,
                visibility: formData.visibility,
                public: formData.public
            })
            .then((res) => {
                navigate("/home/")
                console.log(res)
                console.log(res.data)
            })
    }

    // Todo: move styles to a CSS file?
    return (


        <div id="ParentDiv">

            <Row>

            </Row>


            <Container fluid>
                <Row style={{marginTop: "6rem"}}>
                    <Col/>
                    <Col>
                        <HeadingText>Create a Club</HeadingText>
                        <ParaText/>
                        <SignUpContainer>
                            <FormLayout> {/*  might have to add more info here */}
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
                                    <Label for="description"> description </Label>
                                    <Input
                                        id="description"
                                        name="description"
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
>>>>>>> 4ed477c9a80d97123742cbe698cdd0466ffe4322
}