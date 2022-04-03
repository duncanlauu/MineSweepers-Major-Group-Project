import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios";

import SingleClubRecommendation from "../../ClubRecommendations/SingleClubRecommendation";

export default function ClubList(props) {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getAllClubsOfUser();
  }, []);

  const getAllClubsOfUser = () => {
    axiosInstance
      .get(`clubs/user/${props.requestedUser_id}`)
      .then((res) => {
        const allClubs = res.data;
        setClubs(allClubs);
      })
      .catch((error) => console.error(error));
  };

  const displayRatings = (e) => {
    if (clubs) {
      return clubs.map((club) => {
        return <SingleClubRecommendation club={club} />;
      });
    } else {
      if (props.requestedUser_id == undefined) {
        return <h5> You have not rated anything yet. </h5>;
      } else {
        return <h5> This user has not rated anything yet. </h5>;
      }
    }
  };

  return <>{displayRatings(props)}</>;
}
