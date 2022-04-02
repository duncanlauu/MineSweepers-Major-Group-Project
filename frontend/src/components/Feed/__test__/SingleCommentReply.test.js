/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleCommentReply from "../SingleCommentReply";
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

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleCommentReply reply={{
                author: 1,
                author__email: "author1@example.com",
                content: "Reply 1"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Gravatar for author1@example.com")).toBeInTheDocument()
        })
    })

    test("contains reply content", async () => {
        act(() => {
            render(routerWrapper(<SingleCommentReply reply={{
                author: 1,
                author__email: "author1@example.com",
                content: "Reply 1"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Reply 1")).toBeInTheDocument()
        })
    })

    test("contains delete button if author is the same as current user", async () => {
        act(() => {
            render(routerWrapper(<SingleCommentReply reply={{
                author: 1,
                author__email: "author1@example.com",
                content: "Reply 1"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("x")).toBeInTheDocument()
        })
    })

    test("does not contain delete button if author is not the same as current user", async () => {
        act(() => {
            render(routerWrapper(<SingleCommentReply reply={{
                author: 2,
                author__email: "author1@example.com",
                content: "Reply 1"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.queryByText("x")).not.toBeInTheDocument()
        })
    })
})
