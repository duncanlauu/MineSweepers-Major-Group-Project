import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
import useGetUser from "../../helpers";
import axiosInstance from "../../axios";

import { useNavigate } from "react-router";

export default function UserProfileEditor(props) {
  const [formData, updateFormData] = useState(props.currentUser);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPostCreatorEmail = (author_id) => {
    axiosInstance
      .get(`user/get_update/${author_id}/`)
      .then((res) => {
        setPosterEmail(res.data.email);
      })
      .catch((error) => console.error(error));
  };

  const navigate = useNavigate();

  const handleEditRequest = (e) => {
    e.preventDefault();

    axiosInstance
      .put(`user/get_update/${props.currentUser.id}/`, {
        action: "edit",
        password: props.currentUser.password,
        username: props.currentUser.username,
        email: props.currentUser.email,
        first_name: props.currentUser.first_name,
        last_name: props.currentUser.last_name,
        location: formData.location,
        bio: formData.bio,
      })
      .then((res) => {
        navigate("/home/");
        navigate("/user_profile/");
        console.log("New profile content: ");
        console.log(res);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const displayPersonalPostForm = (e) => {
    return (
      <Container fluid>
        <Row>
          <Col>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1> Edit Profile </h1>
            </div>

            <Container>
              <Form>
                <FormGroup>
                  <Label for="bio"> Bio </Label>
                  <Input
                    type="textarea"
                    rows="5"
                    id="bio"
                    name="bio"
                    onChange={handleChange}
                    style={{
                      border: "0",
                      backgroundColor: "#F3F3F3",
                      borderRadius: "20px",
                    }}
                    value={formData.bio}
                  />
                  <p></p>
                </FormGroup>
                {/* <div>{titleErr}</div> */}

                <FormGroup>
                  <Label for="location"> Location </Label>
                  <Input
                    id="location"
                    name="location"
                    onChange={handleChange}
                    style={{
                      border: "0",
                      backgroundColor: "#F3F3F3",
                      borderRadius: "20px",
                    }}
                    value={formData.location}
                  />
                </FormGroup>
                {/* <div>{contentErr}</div> */}

                <FormGroup>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      type="submit"
                      className="submit"
                      onClick={handleEditRequest}
                      style={{ borderRadius: "50px" }}
                    >
                      Save changes
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  };
  return <>{displayPersonalPostForm(props)}</>;
}
