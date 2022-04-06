/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import ListOfClubs from "../ListOfClubs";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains heading", async () => {
        act(() => {
            render(routerWrapper(<ListOfClubs/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Club Database/i)).toBeInTheDocument()
        })
    })

    test("contains all gravatars", async () => {
        act(() => {
            render(routerWrapper(<ListOfClubs/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for owner${i}@example.com`)).toBeInTheDocument()
            }
        })
    })

    test("contains all member list lengths", async () => {
        act(() => {
            render(routerWrapper(<ListOfClubs/>))
        })

        await waitFor(() => {
            let members = screen.getAllByText(/6 Members/i)
            expect(members.length).toBe(5)
            for (let i = 0; i < members.length; i++) {
                expect(members[i]).toBeInTheDocument()
            }
        })
    })

    test("contains all visit profiles", async () => {
        act(() => {
            render(routerWrapper(<ListOfClubs/>))
        })

        await waitFor(() => {
            let members = screen.getAllByText(/Visit Profile/i)
            expect(members.length).toBe(5)
            for (let i = 0; i < members.length; i++) {
                expect(members[i]).toBeInTheDocument()
            }
        })
    })

    test("contains all visit profiles", async () => {
        act(() => {
            render(routerWrapper(<ListOfClubs/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`Club ${i}`)).toBeInTheDocument()
            }
        })
    })
})
