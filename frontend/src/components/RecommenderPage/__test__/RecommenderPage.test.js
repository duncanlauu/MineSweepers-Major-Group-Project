/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import RecommenderPage from '../RecommenderPage';
import routerWrapper from '../../../test_helpers'

describe("Components exist", () => {

    test("contains heading", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Books For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains combobox", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            expect(comboBox).toBeInTheDocument()
        })
    })

    test("contains filter button for genre recommendations", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("myTop10Recommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })

    test("contains filter button for global top 10", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("globalTop10Recommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })

    test("contains filter button for my top 10 genre recommendations", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("myTop10GenreRecommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })

    test("contains filter button for global top 10 genre recommendations", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const filterButton = screen.getByTestId("globalTop10GenreRecommendations")
            expect(filterButton).toBeInTheDocument()
        })
    })
})

describe("Components interact correctly", () => {

})