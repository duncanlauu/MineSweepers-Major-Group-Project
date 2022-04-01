/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SearchUserCard from "../SearchUserCard";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SearchUserCard username="User 1" email="user1@example.com" bio="example bio"/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for user1@example.com`)).toBeInTheDocument()
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<SearchUserCard username="User 1" email="user1@example.com" bio="example bio"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`User 1`)).toBeInTheDocument()
        })
    })

    test("contains email", async () => {
        act(() => {
            render(routerWrapper(<SearchUserCard username="User 1" email="user1@example.com" bio="example bio"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`user1@example.com`)).toBeInTheDocument()
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<SearchUserCard username="User 1" email="user1@example.com" bio="example bio"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`example bio...`)).toBeInTheDocument()
        })
    })

    test("contains long bio", async () => {
        act(() => {
            render(routerWrapper(<SearchUserCard username="User 1" email="user1@example.com"
                                                 bio="qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`qwertyuiopasdfghjklzxcvbnmqwertyuio...`)).toBeInTheDocument()
        })
    })
})
