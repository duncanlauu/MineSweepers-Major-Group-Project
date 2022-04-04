import styled from "styled-components";

export const HeadingText = styled.text`
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 600;
  font-size: 30px;
`;

export const Heading2Text = styled.text`
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 600;
  font-size: 25px;
  color: #585858;
`;

export const ParaText = styled.text`
  font-family: "Source Sans Pro", sans-serif;
  line-height: 5px;
`;

export const FeedContainer = styled.div`
  height: 80rem;
  width: 100%;
  border-radius: 10px;
  overflow-y: scroll;
`;

export const RecommendationContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  height: 7vw;
  width: 90%;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;
export const RecommendationInfo = styled.div`
  height: 60%;
  width: 75%;
  background-color: #fff;
`;

export const ClubListItem = styled.li`
  margin-right: 2rem;
  height: 13rem;
  width: 11rem;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

export const BookProfile = styled.div`
  background-color: #ffffff;
  height: 10rem;
  width: 90%;
  border-radius: 7px;
  margin-left: 1rem;
  display: flex;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
`;

export const RecommendedClubsText = styled.text`
  font-family: "Source Sans Pro";
  color: #000;
  opacity: 85%;
  font-size: 10px;
`

export const RecommendedClubMembersText = styled.text`
  font-family: "Source Sans Pro";
  color: #653ffd;
  font-weight: 600;
  font-size: 10px;
`