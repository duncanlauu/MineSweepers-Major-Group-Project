import React, { useEffect, useState } from "react";
import { ClubProfile } from "./ClubProfileElements";
import { Button, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import { HeadingText } from "../Login/LoginElements";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import { jsx } from "@emotion/react";

function ClubApplicants() {
  const [club, setClub] = useState(null);
  const [owner, setOwner] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);

  let ownerData = [];
  let adminData = [];
  let memberData = [];
  let applicantData = [];

  const { club_id } = useParams();
  console.log("Club ID on Members Page: " + club_id);

  const managementButtonStyle = {
    backgroundColor: "#fff",
    border: "2px solid #653FFD",
    fontFamily: "Source Sans Pro",
    color:"#000",
    borderRadius: "100px",
    marginRight: "10px"
  }

  useEffect(() => {
    axiosInstance
      .get(`singleclub/${club_id}`)
      .then((res) => {
        setClub(res.data);

        setOwner(res.data.owner);
        console.log("Owner: " + res.data.owner);

        setAdmins(res.data.admins);
        console.log("Admins: " + res.data.admins);

        setMembers(res.data.members);
        console.log("Members: " + res.data.members);

        setApplicants(res.data.applicants);
        console.log("Applicants: " + res.data.applicants);

        // Get owner data
        ownerData.push(
          axiosInstance
            .get(`user/get_update/${res.data.owner}`)
            .then(ownerRes => console.log(ownerRes.data))
        )
        
        // Get admin data
        for (let adm = 0; adm < res.data.admins.length; adm++) {
          adminData.push(
            axiosInstance
              .get(`user/get_update/${res.data.admins[adm]}`)
              .then(adminRes => console.log(adminRes))
          )
        }

        // Get member data
        for (let mem = 0; mem < res.data.members.length; mem++) {
          memberData.push(
            axiosInstance
              .get(`user/get_update/${res.data.members[mem]}`)
              .then(memberRes => console.log(memberRes))
          )
        }

        // Get applicant data
        for (let app = 0; app < res.data.applicants.length; app++) {
          applicantData.push(
            axiosInstance
              .get(`user/get_update/${res.data.applicants[app]}`)
              .then(applicantRes => console.log(applicantRes))
          )
        }
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function IndividualMemberCard(props) {
    const isApplicant = props.isApplicant;
    const isMember = props.isMember;
    const isAdmin = props.isAdmin;
    const isOwner = props.isOwner;
    const user_id = props.userId;

    return (
      <ClubProfile>
        <Col xs={3}>
          <Gravatar email="blah@blah.com" size={70} />
        </Col>
        <Col xs={9}>
          <HeadingText>{props.name}</HeadingText>
          {isApplicant ? (
            <div style={{ float:"right" }}>
              <Button 
                style={managementButtonStyle} 
                onClick={(e) => acceptClubApplicant(club_id, user_id)}>
                Accept
              </Button>
              <Button 
                style={managementButtonStyle} 
                onClick={(e) => rejectClubApplicant(club_id, user_id)}>
                Reject
              </Button>
            </div>
          ) : (
            <></>
          )}
          {isMember ? (
            <div style={{ float:"right" }}>
              <Button 
                style={managementButtonStyle} 
                onClick={(e) => removeClubMember(club_id, user_id)}>
                Remove
              </Button>
              <Button 
                style={managementButtonStyle} 
                onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
            </div>
          ) : (
            <></>
          )}
          {isAdmin ? (
            <div style={{ float:"right" }}>
              <Button
                style={managementButtonStyle}
                onClick={(e) => transferOwnershipToAdmin(club_id, user_id)}
              >
                Make Owner
              </Button>
              <Button 
                style={managementButtonStyle}
                onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
            </div>
          ) : (
            <></>
          )}
        </Col>
      </ClubProfile>
    );
  }

  IndividualMemberCard.defaultProps = {
    isApplicant: false,
    isMember: false,
    isAdmin: false,
    isOwner: false,
  };

  function acceptClubApplicant(id, user_id, e) {
    const action = "accept";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function rejectClubApplicant(id, user_id, e) {
    const action = "reject";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function removeClubMember(id, user_id, e) {
    const action = "remove";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function banUser(id, user_id, e) {
    const action = "ban";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function transferOwnershipToAdmin(id, user_id, e) {
    const action = "transfer";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unbanUser(id, user_id, e) {
    const action = "unban";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <IndividualMemberCard name={owner} isOwner={true} />
      <hr />
      <ul>
        {admins.map((admin) => (
          <li key={admin}>
            <IndividualMemberCard name={admin} isAdmin={true} userId={admin} />
          </li>
        ))}
      </ul>
      <hr />
      <ul>
        {members.map((member) => (
          <li key={member}>
            <IndividualMemberCard
              name={member}
              isMember={true}
              userId={member}
            />
          </li>
        ))}
      </ul>
      <hr />
      <ul>
        {applicants.map((applicant, index) => (
          <li key={applicant}>
            <IndividualMemberCard
              name={applicant}
              isApplicant={true}
              userId={applicant}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ClubApplicants;