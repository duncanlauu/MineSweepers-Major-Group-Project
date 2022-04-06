/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import routerWrapper from "../../../../test-helpers";
import fakeLocalStorage from "../../../../fakeLocalStorage";
import user from "../../../../mocksData/getCurrentUser.json";
import PersonalPostList from "../PersonalPostList";


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

    test("contains all gravatars", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByAltText(`Gravatar for author${i}@example.com`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post titles", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post title ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post contents", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post content ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all edit buttons", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList/>))
        })

        await waitFor(() => {
            const buttons = screen.getAllByText("Edit")
            expect(buttons.length).toBe(3)
        })
    })

    test("contains all gravatars for other user", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByAltText(`Gravatar for author${i}@example.com`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post titles", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post title ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post contents", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post content ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains no edit buttons", async () => {
        act(() => {
            render(routerWrapper(<PersonalPostList requestedUser_id={2}/>))
        })

        await waitFor(() => {
            const buttons = screen.queryAllByText("Edit")
            expect(buttons.length).toBe(0)
        })
    })
})
