import React, { useEffect, useState } from "react";
import { ClubProfile } from "./ClubProfileElements";
import { Button, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import { HeadingText } from "../Login/LoginElements";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";

function ClubApplicants() {
  const [club, setClub] = useState(null);
  const [owner, setOwner] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const { club_id } = useParams();
  console.log("Club ID on Members Page: " + club_id);

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
            <>
              <Button onClick={(e) => acceptClubApplicant(club_id, user_id)}>
                Accept
              </Button>
              <Button onClick={(e) => rejectClubApplicant(club_id, user_id)}>
                Reject
              </Button>
            </>
          ) : (
            <></>
          )}
          {isMember ? (
            <>
              <Button onClick={(e) => removeClubMember(club_id, user_id)}>
                Remove
              </Button>
              <Button onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
            </>
          ) : (
            <></>
          )}
          {isAdmin ? (
            <>
              <Button
                onClick={(e) => transferOwnershipToAdmin(club_id, user_id)}
              >
                Make Owner
              </Button>
              <Button onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
            </>
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
      <IndividualMemberCard name={owner.username} isOwner={true} />
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
