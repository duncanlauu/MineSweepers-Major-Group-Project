import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import SingleClub from "./SingleClub";

export default function BookRatingList(props) {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    if (props.requestedUser_id == undefined) {
      getAllClubs();
    } else {
      getAllClubsOfOtherUser();
    }
  }, []);

  const getAllClubs = () => {
    axiosInstance
      .get(`clubs/user/${props.requestedUser_id}`)
      .then((res) => {
        console.log("Club data: ", res);
        const allClubs = res.data.clubs;
        setClubs(allClubs);
      })
      .catch((error) => console.error(error));
  };

  const getAllClubsOfOtherUser = () => {
    axiosInstance
      .get(`clubs/user/${props.requestedUser_id}`)
      .then((res) => {
        console.log("Club data:", res);
        const allClubs = res.data.clubs;
        setClubs(allClubs);
      })
      .catch((error) => console.error(error));
  };

  const displayRatings = (e) => {
    if (clubs) {
      return clubs.map((club) => {
        return <SingleClub club={club} />;
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
