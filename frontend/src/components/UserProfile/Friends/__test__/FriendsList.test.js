/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import FriendsList from "../FriendsList";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains all friends", async () => {
        act(() => {
            render(routerWrapper(<FriendsList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`test${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains remove buttons", async () => {
        act(() => {
            render(routerWrapper(<FriendsList/>))
        })

        await waitFor(() => {
            const buttons = screen.getAllByText("X")
            expect(buttons.length).toBe(5)
        })
    })

    test("contains gravatars", async () => {
        act(() => {
            render(routerWrapper(<FriendsList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for test${i}@test.org`)).toBeInTheDocument()
            }
        })
    })

    test("contains all friends for other user", async () => {
        act(() => {
            render(routerWrapper(<FriendsList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 4; i++) {
                expect(screen.getByText(`test${i}`)).toBeInTheDocument()
            }
        })
    })

    test("does not contain remove buttons for other user", async () => {
        act(() => {
            render(routerWrapper(<FriendsList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            expect(screen.queryByText("X")).not.toBeInTheDocument()
        })
    })

    test("contains gravatars for other user", async () => {
        act(() => {
            render(routerWrapper(<FriendsList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 4; i++) {
                expect(screen.getByAltText(`Gravatar for test${i}@test.org`)).toBeInTheDocument()
            }
        })
    })
})
