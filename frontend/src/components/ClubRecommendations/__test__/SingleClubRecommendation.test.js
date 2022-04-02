/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleClubRecommendation from "../SingleClubRecommendation";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains club name", async () => {
        act(() => {
            render(routerWrapper(<SingleClubRecommendation club={{
                "owner": {"email": "user2@example.org"},
                "name": "Club 1",
                "id": 1,
                "members": [1,2,3]
            }}/>))
        })

        await waitFor(() => {
            const clubName = screen.getByText(/Club 1/i)
                expect(clubName).toBeInTheDocument()
        })
    })

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleClubRecommendation club={{
                "owner": 1,
                "name": "Club 1",
                "id": 1,
                "members": [1,2,3]
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for test1@test.org")).toBeInTheDocument()
        })
    })

    test("contains members", async () => {
        act(() => {
            render(routerWrapper(<SingleClubRecommendation club={{
                "owner": 1,
                "name": "Club 1",
                "id": 1,
                "members": [1,2,3]
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Members: 3/i)).toBeInTheDocument()
        })
    })
})
