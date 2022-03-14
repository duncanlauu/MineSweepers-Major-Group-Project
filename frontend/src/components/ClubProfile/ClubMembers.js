import React from 'react'
import { BookProfile } from './ClubProfileElements'
import { Col, Container } from 'reactstrap'
import Gravatar from 'react-gravatar';
import { HeadingText } from '../Login/LoginElements';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axios';

function IndividualMemberCard(props) {
  return (
    <BookProfile>
      <Col xs={3}>
        <Gravatar email='blah@blah.com' size={70} />
      </Col>
      <Col xs={9}>
        <HeadingText>{props.name}</HeadingText>
      </Col>
    </BookProfile>
  )
}

export default function ClubMembers() {

  const [members, setMembers] = React.useState([]);
  const [admin, setAdmin] = React.useState([]);
  const [applicants, setApplicants] = React.useState(null);

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
          console.log(res.data.members);
          setMembers(res.data.members);
          const memberList = res.data.members
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
          </Col>
        </BookProfile>
        {/* <ul>
          {members.map(
            member =>
            <li>
              <IndividualMemberCard
                name={member.name}
              />
            </li>
          )
          }
        </ul> */}
        <ul>
          {members.map(member => 
            <li>
              <IndividualMemberCard name={member} />
            </li>
          )}
        </ul>
    </div>
  )
}