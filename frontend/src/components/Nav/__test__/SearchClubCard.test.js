/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SearchClubCard from "../SearchClubCard";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains name", async () => {
        act(() => {
            render(routerWrapper(<SearchClubCard name="Name 1" ownerEmail="owner1@example.com" description="Description 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Name 1`)).toBeInTheDocument()
        })
    })

    test("contains owner gravatar", async () => {
        act(() => {
            render(routerWrapper(<SearchClubCard name="Name 1" ownerEmail="owner1@example.com" description="Description 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for owner1@example.com`)).toBeInTheDocument()
        })
    })

    test("contains description", async () => {
        act(() => {
            render(routerWrapper(<SearchClubCard name="Name 1" ownerEmail="owner1@example.com" description="Description 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Description 1...`)).toBeInTheDocument()
        })
    })

    test("contains long description", async () => {
        act(() => {
            render(routerWrapper(<SearchClubCard name="Name 1" ownerEmail="owner1@example.com"
                                                 description="qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`qwertyuiopasdfghjklzxcvbnmqwertyuio...`)).toBeInTheDocument()
        })
    })
})
