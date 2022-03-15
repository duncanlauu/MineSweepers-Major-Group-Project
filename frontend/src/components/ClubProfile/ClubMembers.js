import React from 'react'
import { BookProfile, ParaText } from './ClubProfileElements'
import { Button, Col, Container } from 'reactstrap'
import Gravatar from 'react-gravatar';
import { HeadingText } from '../Login/LoginElements';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios';

function IndividualMemberCard(props) {
  console.log("Prop Names: " + props.name)
  return (
    <BookProfile>
      <Col xs={3}>
        <Gravatar email='blah@blah.com' size={70} />
      </Col>
      <Col xs={9}>
        <HeadingText>{props.name}</HeadingText>
        <Button onClick={(e) => acceptClubApplicant(87)}>Accept</Button>
      </Col>
    </BookProfile>
  )
}

function acceptClubApplicant(user_id, e) {
  const action = 'accept'
  axiosInstance.put(
    `clubs/${id}/${action}/${user_id}`, {}
  ).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

function rejectClubApplicant(user_id, e) {
  const action = 'reject'
  axiosInstance.put(
    `clubs/${id}/${action}/${user_id}`, {}
  ).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

export default function ClubMembers() {

  const [members, setMembers] = React.useState([]);
  const [admins, setAdmins] = React.useState([]);
  const [applicants, setApplicants] = React.useState([]);

  const { club_id } = useParams(); // Gets the id provided in the URL
  console.log("Club ID on Members tab: " + club_id);
  const [club, setClub] = React.useState(null);

  React.useEffect(() => {
      axiosInstance.get(`clubs/${club_id}`).then(
          res => {
              console.log(res);
              setClub(res.data);
          }
      );
  }, []);

  React.useEffect(() => {
      axiosInstance.get(`clubs/${club_id}`).then(
        res => {
          // console.log("Admin: " + res.data.admin);
          // setAdmin(res.data.admin);
          console.log("Applicants: " + res.data.applicants);
          setApplicants(res.data.applicants);
          // console.log("Applicants: " + res.data.applicants);
          // setApplicants(res.data.applicants);
        }
      ).catch(err => {
        console.log(err);
      })
    }
  );

  if (!club) return null;

  return (
    <div style={{ alignContent:"center", justifyContent:"center" }}>
      
        <BookProfile>
          <Col xs={3}>
            <Gravatar email='blah@blah.com' size={70}></Gravatar>
          </Col>
          <Col xs={9}>
            <HeadingText>{club.owner}</HeadingText>
            <ParaText>Owner</ParaText>
          </Col>
        </BookProfile>
        <ul>
          {admins.map(admin => 
            <li>
              <IndividualMemberCard name={admin} />
            </li>
          )}
        </ul>
        <hr />
        <ul>
          {applicants.map(applicant => 
            <li>
              <IndividualMemberCard name={applicant} />
            </li>
          )}
        </ul>
    </div>
  )
}