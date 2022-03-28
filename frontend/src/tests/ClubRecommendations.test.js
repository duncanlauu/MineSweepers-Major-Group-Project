import {render, screen, } from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import ClubRecommendationPage from "../components/ClubRecommendations/ClubRecommendationsPage";
import '@testing-library/jest-dom';
import {useGetUser} from "../__mocks__/react-router-dom";

test("renders", async () => {
    useGetUser.mockReturnValue({user: {id: 1}})
    render(<BrowserRouter>
        <ClubRecommendationPage />
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("recommender_container")).toBeInTheDocument();
    // This needs to wait until the state is updated
    // I think the user needs to be authenticated
})