import {render, screen,} from "@testing-library/react";
import React, {useEffect} from "react";
import '@testing-library/jest-dom';
import {useParams} from "../__mocks__/react-router-dom";
import {MemoryRouter} from "react-router";
import useAuth from "../components/hooks/useAuth";


const AuthenticatePlease = (user) => {
    const {setAuth} = useAuth();
    setAuth({"username": user})

    useEffect(() => {
        console.log(user)
    })

    return (
        <></>
    )
}


describe("<BookProfilePage />", () => {
    // I don't know how to authenticate the user correctly
    it("can tell mocked from unmocked functions", () => {
        expect(jest.isMockFunction(useParams)).toBe(true);
        expect(jest.isMockFunction(MemoryRouter)).toBe(false);
    });

    it("renders", async () => {
        useParams.mockReturnValue({book_id: "0195153448"});
        render(AuthenticatePlease("Jeb"));

        await screen.findByTestId("submitRatingButton")

        expect(screen.getByTestId("submitRatingButton")).toBeInTheDocument();
        // This needs to wait until the state is updated
        // I think the user needs to be authenticated
    })
});
