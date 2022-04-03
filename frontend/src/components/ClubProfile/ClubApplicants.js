import React, { useEffect, useState } from "react";
import {
  BioText,
  ClubProfile,
  MemberListHeading,
  NameText,
  UsernameText,
} from "./ClubProfileElements";
import { Button, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import { HeadingText } from "../Login/LoginElements";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";

const managementButtonStyle = {
  backgroundColor: "#fff",
  border: "2px solid #653FFD",
  fontFamily: "Source Sans Pro",
  fontSize: "15px",
  padding: "0px",
  color: "#000",
  height: "2.5rem",
  borderRadius: "100px",
  marginRight: "5px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
};

const buttonStyle = {
  backgroundColor: "#fff",
  color: "#653ffd",
  fontFamily: "Source Sans Pro",
  fontWeight: "600",
  borderRadius: "100px",
  padding: "0px",
  marginBottom: "5px",
};

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

        setOwner(res.data.owner);

        setAdmins(res.data.admins);

        setMembers(res.data.members);

        setApplicants(res.data.applicants);

        setBannedUsers(res.data.banned_users);
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
    const memberStatus = props.memberStatus;

    return (
      <ClubProfile>
        <Col xs={3}>
          <Gravatar
            email={props.email}
            size={70}
            style={{ borderRadius: "100%" }}
          />
        </Col>
        <Col xs={6}>
          <a href={`/user_profile/${props.userId}`}>
            <UsernameText>{props.username}</UsernameText>
          </a>
          <br />
          <NameText>{props.email}</NameText>
          <br />
          <BioText>{props.bio}</BioText>
        </Col>
        <Col
          xs={3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          {isApplicant && memberStatus !== "member" ? (
            <>
              <Button
                style={buttonStyle}
                onClick={(e) => acceptClubApplicant(club_id, user_id)}
              >
                Accept
              </Button>
              <Button
                style={buttonStyle}
                onClick={(e) => rejectClubApplicant(club_id, user_id)}
              >
                Reject
              </Button>
            </>
          ) : (
            <></>
          )}
          {isMember && memberStatus !== "member" ? (
            <>
              {memberStatus === "owner" && (
                <Button
                  style={buttonStyle}
                  onClick={(e) => promoteMember(club_id, user_id)}
                >
                  Promote
                </Button>
              )}
              <Button
                style={buttonStyle}
                onClick={(e) => banUser(club_id, user_id)}
              >
                Ban
              </Button>
            </>
          ) : (
            <></>
          )}
          {isAdmin && memberStatus === "owner" ? (
            <>
              <Button
                style={buttonStyle}
                onClick={(e) => transferOwnershipToAdmin(club_id, user_id)}
              >
                Make Owner
              </Button>
              <Button
                style={buttonStyle}
                onClick={(e) => demoteAdmin(club_id, user_id)}
              >
                Demote
              </Button>
              <Button
                style={buttonStyle}
                onClick={(e) => banUser(club_id, user_id)}
              >
                Ban
              </Button>
            </>
          ) : (
            <></>
          )}
          {isBanned && memberStatus !== "member" ? (
            <>
              <Button
                style={buttonStyle}
                onClick={(e) => unbanUser(club_id, user_id)}
              >
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

  function promoteMember(id, user_id, e) {
    axiosInstance
      .put(`singleclub/${id}/promote/${user_id}`, {})
      .then((res) => {
        console.log(res);
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <MemberListHeading>Owner</MemberListHeading>
      <IndividualMemberCard
        username={owner.username}
        email={owner.email}
        userId={owner.id}
        bio={owner.bio}
        isOwner={true}
      />
      {admins.length > 0 ? (
        <MemberListHeading>Admins</MemberListHeading>
      ) : (
        <></>
      )}
      <ul>
        {admins.map((admin) => (
          <li key={admin}>
            <IndividualMemberCard
              username={admin.username}
              email={admin.email}
              bio={admin.bio}
              isAdmin={true}
              userId={admin.id}
              memberStatus={memberStatus}
            />
          </li>
        ))}
      </ul>
      {members.length > 0 ? (
        <MemberListHeading>Members</MemberListHeading>
      ) : (
        <></>
      )}
      <ul>
        {members.map((member) => (
          <li key={member}>
            <IndividualMemberCard
              username={member.username}
              email={member.email}
              bio={member.bio}
              isMember={true}
              userId={member.id}
              memberStatus={memberStatus}
            />
          </li>
        ))}
      </ul>
      {applicants.length > 0 ? (
        <MemberListHeading>Applicants</MemberListHeading>
      ) : (
        <></>
      )}
      <ul>
        {applicants.map((applicant, index) => (
          <li key={applicant}>
            <IndividualMemberCard
              username={applicant.username}
              email={applicant.email}
              bio={applicant.bio}
              isApplicant={true}
              userId={applicant.id}
              memberStatus={memberStatus}
            />
          </li>
        ))}
      </ul>
      {bannedUsers.length > 0 ? (
        <MemberListHeading>Banned Users</MemberListHeading>
      ) : (
        <></>
      )}
      <ul>
        {bannedUsers.map((bannedUser) => (
          <li key={bannedUser}>
            <div style={{ opacity: "60%" }}>
              <IndividualMemberCard
                username={bannedUser.username}
                isBanned={true}
                email={bannedUser.email}
                bio={bannedUser.bio}
                userId={bannedUser.id}
                memberStatus={memberStatus}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ClubApplicants;
