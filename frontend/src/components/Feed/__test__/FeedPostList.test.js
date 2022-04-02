/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import FeedPostList from "../FeedPostList";
import routerWrapper from "../../../test-helpers";
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";


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
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByAltText(`Gravatar for test${i}@test.org`)).toBeInTheDocument()
            }
        })
    })

    test("contains all poster names", async () => {
        act(() => {
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`@test${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post titles", async () => {
        act(() => {
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post title ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all post contents", async () => {
        act(() => {
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                expect(screen.getByText(`Post content ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all view comments buttons", async () => {
        act(() => {
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                const buttons = screen.getAllByText("view all comments")
                expect(buttons).toHaveLength(3)
            }
        })
    })

    test("contains all like counts", async () => {
        act(() => {
            render(routerWrapper(<FeedPostList/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 3; i++) {
                const buttons = screen.getAllByText("Likes: 3")
                expect(buttons).toHaveLength(3)
            }
        })
    })
})
