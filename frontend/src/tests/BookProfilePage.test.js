import {render, screen,} from "@testing-library/react";
import React, {useState} from "react";
import '@testing-library/jest-dom';
import {useParams} from "../__mocks__/react-router-dom";
import BookProfilePage from "../components/BookProfilePage/BookProfilePage";
import {MemoryRouter} from "react-router";


describe("<BookProfilePage />", () => {
    // I don't know how to authenticate the user correctly
    it("can tell mocked from unmocked functions", () => {
        expect(jest.isMockFunction(useParams)).toBe(true);
        expect(jest.isMockFunction(MemoryRouter)).toBe(false);
    });

    it("renders", async () => {
        useParams.mockReturnValue({book_id: "0195153448"});
        render(<BookProfilePage/>);

        await screen.findByTestId("submitRatingButton")

        expect(screen.getByTestId("submitRatingButton")).toBeInTheDocument();
        // This needs to wait until the state is updated
        // I think the user needs to be authenticated
    })
});
