import { useContext } from "react";
import RatingsContext from "../context/RatingsProvider";

const useHasRated = () => {
    return useContext(RatingsContext);
}

export default useHasRated;