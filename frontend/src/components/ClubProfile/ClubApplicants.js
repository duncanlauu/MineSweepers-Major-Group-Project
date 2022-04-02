import React, { useEffect, useState } from "react";
import { ClubProfile } from "./ClubProfileElements";
import { Button, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import { HeadingText } from "../Login/LoginElements";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";

function ClubApplicants(props) {
  const [club, setClub] = useState(null);
  const [owner, setOwner] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const memberStatus = props.memberStatus;


  const { club_id } = useParams();
  console.log("Club ID on Members Page: " + club_id);

  useEffect(() => {
    axiosInstance
      .get(`singleclub/${club_id}`)
      .then((res) => {
        setClub(res.data.club);

        setOwner(res.data.club.owner);

        setAdmins(res.data.club.admins);

        setMembers(res.data.club.members);

        setApplicants(res.data.club.applicants);

        setBannedUsers(res.data.club.banned_users);

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
    const isBanned = props.isBanned;
    const user_id = props.userId;
    const memberStatus = props.memberStatus

    return (
      <ClubProfile>
        <Col xs={3}>
          <Gravatar email="blah@blah.com" size={70} />
        </Col>
        <Col xs={9}>
          <HeadingText>{props.name}</HeadingText>
          {isApplicant && memberStatus !== "member" ? (
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
          {isMember && memberStatus !== "member" ? (
            <>
              <Button onClick={(e) => removeClubMember(club_id, user_id)}>
                Remove
              </Button>
              {memberStatus === "owner" && <Button onClick={(e) => promoteMember(club_id, user_id)}>Promote</Button>}
              <Button onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
             
            </>
          ) : (
            <></>
          )}
          {isAdmin && memberStatus === "owner" ? (
            <>
              <Button
                onClick={(e) => transferOwnershipToAdmin(club_id, user_id)}
              >
                Make Owner
              </Button>
              <Button onClick={(e) => demoteAdmin(club_id, user_id)}>Demote</Button>
              <Button onClick={(e) => banUser(club_id, user_id)}>Ban</Button>
            </>
          ) : (
            <></>
          )}
          {isBanned && memberStatus !== "member" ? (
            <>
              <Button onClick={(e) => unbanUser(club_id, user_id)}>
                Unban
              </Button>
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
    isBanned: false,
  };

  function acceptClubApplicant(id, user_id, e) {
    const action = "accept";
    axiosInstance
      .put(`singleclub/${id}/${action}/${user_id}`, {})
      .then((res) => {
        console.log(res);
        // setApplicants(applicants.filter((applicant) => applicant !== user_id))
        // setMembers(members.concat(user_id))
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
        //setApplicants(applicants.filter((applicant) => applicant !== user_id))
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
        //setMembers(members.filter((member) => member !== user_id))
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
        // setBannedUsers(bannedUsers.concat(user_id))
        // setMembers(members.filter((member) => member !== user_id))
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
        // setAdmins(admins.concat(owner))
        // setOwner(user_id)
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
        // setBannedUsers(bannedUsers.filter((bannedUser) => bannedUser !== user_id))
      })
      .catch((err) => {
        console.log(err);
      });
  }


  function promoteMember(id, user_id, e) {
    axiosInstance
      .put(`singleclub/${id}/promote/${user_id}`, {})
      .then((res) => {
        console.log(res);
        // setMembers(members.filter((member) => member !== user_id))
        // setAdmins(admins.concat(user_id))
      })
      .catch((err) => {
      console.log(err);
    });
  }

  function demoteAdmin(id, user_id, e) {
    axiosInstance
      .put(`singleclub/${id}/demote/${user_id}`, {})
      .then((res) => {
        console.log(res);
        // setAdmins(admins.filter((admin) => admin !== user_id))
        // setMembers(members.concat(user_id))
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
            <IndividualMemberCard name={admin} isAdmin={true} userId={admin} memberStatus={memberStatus}/>
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
              memberStatus={memberStatus}
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
              memberStatus={memberStatus}
            />
          </li>
        ))}
      </ul>
      <hr />
      <ul>
        {bannedUsers.map((bannedUser) => (
          <li key={bannedUser}>
            <IndividualMemberCard
              name={bannedUser}
              isBanned={true}
              userId={bannedUser}
              memberStatus={memberStatus}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ClubApplicants;
