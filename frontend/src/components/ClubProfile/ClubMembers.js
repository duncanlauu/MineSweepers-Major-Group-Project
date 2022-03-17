import React, { useEffect, useState } from 'react'
import {  ClubProfile } from './ClubProfileElements'
import { Button, Col } from 'reactstrap'
import Gravatar from 'react-gravatar';
import { HeadingText } from '../Login/LoginElements';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios';

const ClubMembers = () => {
  const [club, setClub] = useState(null);
  const [owner, setOwner] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const { club_id } = useParams();
  console.log("Club ID on Members Page: " + club_id);

  useEffect(() => {
    axiosInstance
      .get(`clubs/${club_id}`)
      .then(res => {
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
      .catch(err => {
        console.log(err);
      })
  }, [])

  function IndividualMemberCard(props) {
    const isApplicant = props.isApplicant;
    const user_id = props.userId;
    return(
      <ClubProfile>
        <Col xs={3}>
          <Gravatar email='blah@blah.com' size={70} />
        </Col>
        <Col xs={9}>
          <HeadingText>{props.name}</HeadingText>
          {isApplicant ?
            <>
              <Button onClick={(e) => acceptClubApplicant(club_id, user_id)}>Accept</Button>
              <Button onClick={(e) => rejectClubApplicant(club_id, user_id)}>Reject</Button>
            </> :
            <></>
          }
        </Col>
      </ClubProfile>
    )
  }

  function acceptClubApplicant(id, user_id, e) {
    const action = 'accept'
    axiosInstance
      .put(`clubs/${id}/${action}/${user_id}`, {})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  function rejectClubApplicant(id, user_id, e) {
    const action = 'reject'
    axiosInstance
      .put(`clubs/${id}/${action}/${user_id}`, {})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <>
      <IndividualMemberCard name={owner} isApplicant={false} />
      <hr />
      <ul>
        {admins.map(admin => 
          <li key={admin}>
            <IndividualMemberCard name={admin} isApplicant={false} />
          </li>
        )}
      </ul>
      <hr />
      <ul>
        {members.map(member => 
          <li key={member}>
            <IndividualMemberCard name={member} isApplicant={false} />
          </li>
        )}
      </ul>
      <hr />
      <ul>
        {applicants.map((applicant, index) =>
          <li key={applicant}>
            <IndividualMemberCard name={applicant} isApplicant={true} userId={applicant} />
          </li>
        )}
      </ul>
    </>
  )
}

export default ClubMembers