/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import ProfileInfo from "../ProfileInfo";
import routerWrapper from "../../../test-helpers";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser2.json"


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

    test("contains gravatar for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for test1@test.org`)).toBeInTheDocument();
        })
    })

    test("contains first name for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/first name 1/i)).toBeInTheDocument();
        })
    })

    test("contains last name for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/last name 1/i)).toBeInTheDocument();
        })
    })

    test("contains username for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`@test1`)).toBeInTheDocument();
        })
    })

    test("contains location for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`location 1`)).toBeInTheDocument();
        })
    })

    test("contains bio for another user", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo otherUserID={1}/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`bio 1`)).toBeInTheDocument();
        })
    })

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for test2@test.org`)).toBeInTheDocument();
        })
    })

    test("contains first name", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/first name 2/i)).toBeInTheDocument();
        })
    })

    test("contains last name", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/last name 2/i)).toBeInTheDocument();
        })
    })

    test("contains username", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`@test2`)).toBeInTheDocument();
        })
    })

    test("contains location", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`location 2`)).toBeInTheDocument();
        })
    })

    test("contains bio", async () => {
        act(() => {
            render(routerWrapper(<ProfileInfo/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`bio 2`)).toBeInTheDocument();
        })
    })
})
