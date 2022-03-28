/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import RecommenderPage from '../RecommenderPage';
import { BrowserRouter } from 'react-router-dom'


let container

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("Components exist", () => {

    test("contains heading", async () => {
        act(() => {
            render(<BrowserRouter><RecommenderPage /></BrowserRouter>, container)
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Books For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains filter button for genre recommendations", async () => {
        act(() => {
            render(<BrowserRouter><RecommenderPage /></BrowserRouter>, container)
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("myTop10Recommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })

    test("contains filter button for global top 10", async () => {
        act(() => {
            render(<BrowserRouter><RecommenderPage /></BrowserRouter>, container)
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("globalTop10Recommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })
})


// <FilterButton onClick={returnFictionRecommendations}>My {value} Recommendations</FilterButton><br/>
// <FilterButton onClick={returnTop10Recommendations}>My Recommendations</FilterButton><br/>
// <FilterButton onClick={returnGlobalTop10Recommendations}>Global Top 10</FilterButton><br/>
// <FilterButton onClick={returnGlobalTop10FictionRecommendations}>Global {value} Top 10</FilterButton><br/>