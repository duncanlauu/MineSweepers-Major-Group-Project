import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios";

import SingleClubRecommendation from "../../ClubRecommendations/SingleClubRecommendation";

export default function ClubList(props) {
  const [clubs, setClubs] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
    if (clubs.length > 0) {
      return clubs.map((club) => {
        return <SingleClubRecommendation club={club} />;
      });
    } else {
      if (props.requestedUser_id == currentUser.id) {
        return <h5> You are not part of any clubs yet. </h5>;
      } else {
        return <h5> This user is not in any club yet.</h5>;
      }
    }
  };

  return <>{displayRatings(props)}</>;
}
