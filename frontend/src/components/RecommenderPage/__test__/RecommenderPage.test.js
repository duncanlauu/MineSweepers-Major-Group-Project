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

    test("contains filter button for my recommendations", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const recommendationsButton = screen.getByRole('button', { name: /my recommendations/i })
            expect(recommendationsButton).toBeInTheDocument()
        })
    })

    test("contains filter button for global top 10", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const recommendationsButton = screen.getByRole('button', { name: /global top 10/i })
            expect(recommendationsButton).toBeInTheDocument()
        })
    })
})

describe("Genre-related components", () => {
    test("renders filter button for my top 10 genre recommendations when genre selected", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            fireEvent.change(comboBox, { target: { value: "one" } })
            const genreButton = screen.getByRole('button', { name: /my one recommendations/i })
            expect(genreButton).toBeInTheDocument()
        })
    })

    test("redners filter button for global top 10 genre recommendations when genre selected", async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            fireEvent.change(comboBox, { target: { value: "one" } })
            const genreButton = screen.getByRole('button', { name: /global one top 10/i })
            expect(genreButton).toBeInTheDocument()
        })
    })
})

describe('Correct recommendations are displayed when buttons are clicked', () => {

});
