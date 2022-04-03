/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import UserProfile from "../UserProfile";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import routerWrapper from "../../../test-helpers";


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

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for test1@test.org`)).toBeInTheDocument();
        })
    })

    test("contains first name", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/first name 1/i)).toBeInTheDocument();
        })
    })

    test("contains last name", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/last name 1/i)).toBeInTheDocument();
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`@test1`)).toBeInTheDocument();
        })
    })

    test("contains location", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`location 1`)).toBeInTheDocument();
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`bio 1`)).toBeInTheDocument();
        })
    })

    test("contains posts", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Posts`)).toBeInTheDocument();
        })
    })

    test("contains friends", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Friends`)).toBeInTheDocument();
        })
    })

    test("contains clubs", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Clubs`)).toBeInTheDocument();
        })
    })

    test("contains ratings", async () => {
        act(() => {
            render(routerWrapper(<UserProfile/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Ratings`)).toBeInTheDocument();
        })
    })
})
