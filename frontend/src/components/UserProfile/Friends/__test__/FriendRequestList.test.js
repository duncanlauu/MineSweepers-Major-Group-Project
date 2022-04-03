/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import FriendRequestList from "../FriendRequestList";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains all users", async () => {
        act(() => {
            render(routerWrapper(<FriendRequestList />))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByText(`test${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all gravatars", async () => {
        act(() => {
            render(routerWrapper(<FriendRequestList />))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; i++) {
                expect(screen.getByAltText(`Gravatar for test${i}@test.org`)).toBeInTheDocument()
            }
        })
    })

    test("contains all accept buttons", async () => {
        act(() => {
            render(routerWrapper(<FriendRequestList />))
        })

        await waitFor(() => {
            const buttons = screen.getAllByText('Accept')
            expect(buttons.length).toBe(5)
        })
    })

    test("contains all reject buttons", async () => {
        act(() => {
            render(routerWrapper(<FriendRequestList />))
        })

        await waitFor(() => {
            const buttons = screen.getAllByText('Reject')
            expect(buttons.length).toBe(5)
        })
    })
})
