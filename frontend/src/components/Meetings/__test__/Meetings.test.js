/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Meetings from "../Meetings";
import routerWrapper from "../../../test-helpers";


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
            expect(screen.getByText(/Meeting 1/i)).toBeInTheDocument()
            expect(screen.getByText(/Meeting 2/i)).toBeInTheDocument()
            expect(screen.getByText(/Meeting 3/i)).toBeInTheDocument()
            expect(screen.getByText(/Meeting 4/i)).toBeInTheDocument()
            expect(screen.getByText(/Meeting 5/i)).toBeInTheDocument()
            let allCovers = screen.getAllByAltText(/The book's cover/i)
            expect(allCovers.length).toEqual(5)
            for (let i = 0; i < allCovers.length; ++i) {
                expect(allCovers[i]).toBeInTheDocument()
            }
            let allDownloads = screen.getAllByText(/Click here to download the event/i)
            expect(allDownloads.length).toEqual(5)
            for (let i = 0; i < allDownloads.length; ++i) {
                expect(allDownloads[i]).toBeInTheDocument()
            }
        })
    })
})
