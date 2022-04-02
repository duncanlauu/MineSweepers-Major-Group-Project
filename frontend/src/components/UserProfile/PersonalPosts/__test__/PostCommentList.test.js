/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SinglePersonalPost from "../";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains author's gravatar", async () => {
        act(() => {
            render(routerWrapper(<SinglePersonalPost personalPost={{
                id: 1,
                title: "title1",
                content: "content1",
                author__email: "author1@example.com"
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Gravatar for author1@example.com`)).toBeInTheDocument()
        })
    })
})
