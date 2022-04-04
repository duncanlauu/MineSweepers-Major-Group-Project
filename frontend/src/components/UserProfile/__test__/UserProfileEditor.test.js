/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import UserProfileEditor from "../UserProfileEditor";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import routerWrapper from "../../../test-helpers";
import userEvent from "@testing-library/user-event";


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

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={{
                id: 1,
                username: "test",
                email: "test@test.com",
                bio: "test bio",
                location: "test location",
                createdAt: "2020-01-01T00:00:00.000Z",
                first_name: "test first name",
                last_name: "test last name",
                password: "test password"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Edit Profile`)).toBeInTheDocument();
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={{
                id: 1,
                username: "test",
                email: "test@test.com",
                bio: "test bio",
                location: "test location",
                createdAt: "2020-01-01T00:00:00.000Z",
                first_name: "test first name",
                last_name: "test last name",
                password: "test password"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Bio`)).toBeInTheDocument();
        })
    })

    test("contains location", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={{
                id: 1,
                username: "test",
                email: "test@test.com",
                bio: "test bio",
                location: "test location",
                createdAt: "2020-01-01T00:00:00.000Z",
                first_name: "test first name",
                last_name: "test last name",
                password: "test password"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Location`)).toBeInTheDocument();
        })
    })

    test("contains save changes button", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={{
                id: 1,
                username: "test",
                email: "test@test.com",
                bio: "test bio",
                location: "test location",
                createdAt: "2020-01-01T00:00:00.000Z",
                first_name: "test first name",
                last_name: "test last name",
                password: "test password"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Save changes`)).toBeInTheDocument();
        })
    })

    test("correctly updates the user profile", async () => {
        act(() => {
            render(routerWrapper(<UserProfileEditor currentUser={{
                id: 1,
                username: "test",
                email: "test@test.com",
                bio: "test bio",
                location: "test location",
                createdAt: "2020-01-01T00:00:00.000Z",
                first_name: "test first name",
                last_name: "test last name",
                password: "test password"
            }}/>))
        })

        await waitFor(async () => {
            const bioInput = await screen.findByLabelText(`Bio`);
            const locationInput = await screen.findByLabelText(`Location`);
            const saveChangesButton = await screen.findByText(`Save changes`);

            userEvent.clear(bioInput);
            userEvent.type(bioInput, "New bio")
            userEvent.clear(locationInput);
            userEvent.type(locationInput, "New location")

            userEvent.click(saveChangesButton)

            await new Promise(process.nextTick)
            expect(JSON.parse(window.localStorage.getItem("user")).bio).toBe("New bio")
            expect(JSON.parse(window.localStorage.getItem("user")).location).toBe("New location")
            expect(JSON.parse(window.localStorage.getItem("user")).first_name).toBe("test first name")
            expect(JSON.parse(window.localStorage.getItem("user")).last_name).toBe("test last name")
            expect(JSON.parse(window.localStorage.getItem("user")).username).toBe("test")
            expect(JSON.parse(window.localStorage.getItem("user")).password).toBe("test password")
        })
    })
})
