import React from 'react'
import { Button } from 'reactstrap'
import axiosInstance from '../../axios'
import useGetUser from '../../helpers'

const RecommenderPage = () => {
  const user = useGetUser();
  console.log("User ID: " + user.id);

  function returnRecommendations() {
    axiosInstance
      .post(`recommender/0/10/${user.id}/top_n/`, {})
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })

    axiosInstance
      .get(`recommender/0/10/${user.id}/top_n/`)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    
    <>
    <div>RecommenderPage</div>
    <Button onClick={returnRecommendations}>Show </Button>
    </>
  )
}

export default RecommenderPage