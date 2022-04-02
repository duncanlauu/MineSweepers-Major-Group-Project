/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import BookRatingList from "../BookRatingList";
import routerWrapper from "../../../../test-helpers";
import fakeLocalStorage from "../../../../fakeLocalStorage";
import user from "../../../../mocksData/getCurrentUser.json";
import user2 from "../../../../mocksData/getCurrentUser2.json";


beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});

describe("Components exist", () => {

    test("contains books for a logged in user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Classical Mythology`)).toBeInTheDocument()
            expect(screen.getByText(`A Soldier of the Great War`)).toBeInTheDocument()
            expect(screen.getByText(`Test Book 1`)).toBeInTheDocument()
        })
    })

    test("contains book covers for a logged in user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList/>))
        })

        await waitFor(() => {
            const covers = screen.getAllByAltText(`Book\'s cover`)
            expect(covers.length).toBe(3)
        })
    })

    test("contains book ratings for a logged in user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList/>))
        })

        await waitFor(() => {
            const ratings = screen.getAllByTestId("rating")
            expect(ratings.length).toBe(3)
        })
    })

    test("contains book titles for another user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList requestedUser_id={2}/>))
        })
        await waitFor(() => {
            expect(screen.getByText(`Classical Mythology`)).toBeInTheDocument()
            expect(screen.getByText(`A Soldier of the Great War`)).toBeInTheDocument()
        })
    })

    test("contains book covers for another user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            const covers = screen.getAllByAltText(`Book\'s cover`)
            expect(covers.length).toBe(2)
        })
    })

    test("contains book ratings for another user", async () => {
        act(() => {
            render(routerWrapper(<BookRatingList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            const ratings = screen.getAllByTestId("rating")
            expect(ratings.length).toBe(2)
        })
    })
})
