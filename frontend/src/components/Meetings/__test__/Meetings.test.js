/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Meetings from "../Meetings";
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

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<Meetings/>))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/See your meetings/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains all meetings", async () => {
        act(() => {
            render(routerWrapper(<Meetings/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; ++i) {
                expect(screen.getByText(`Meeting ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains all images", async () => {
        act(() => {
            render(routerWrapper(<Meetings/>))
        })

        await waitFor(() => {
            let allCovers = screen.getAllByAltText(/The book's cover/i)
            expect(allCovers.length).toEqual(5)
            for (let i = 0; i < allCovers.length; ++i) {
                expect(allCovers[i]).toBeInTheDocument()
            }
        })
    })

    test("contains all events", async () => {
        act(() => {
            render(routerWrapper(<Meetings/>))
        })

        await waitFor(() => {
            let allDownloads = screen.getAllByText(/Click here to download the event/i)
            expect(allDownloads.length).toEqual(5)
            for (let i = 0; i < allDownloads.length; ++i) {
                expect(allDownloads[i]).toBeInTheDocument()
            }
        })
    })
})
