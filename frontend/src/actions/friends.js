import React, { useEffect, useState } from "react"
import axiosInstance from '../axios'


export const getAllFriends = () => {
    axiosInstance
        .get(`friends/`)
        .then((res) => {
            const allFriends = res.data.friends;
            setFriends(allFriends)
        })
        .catch(error => console.error(error));
}

export const deleteFriend = (id, e) => {
    axiosInstance
        .delete(`friend/${id}`)
        .then((res) => {
            console.log(res)
            removeFromPage(e) // remove friend with id from myFriends state
        })
        .catch(error => console.error(error));
}
