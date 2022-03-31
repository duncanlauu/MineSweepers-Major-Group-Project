/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import RecommenderPage from '../RecommenderPage';
import routerWrapper from '../../../test-helpers'
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


describe('Components exist', () => {

    test('contains heading', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Books For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test('contains combobox', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            expect(comboBox).toBeInTheDocument()
        })
    })

    test('contains filter button for my recommendations', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const recommendationsButton = screen.getByRole('button', { name: /my recommendations/i })
            expect(recommendationsButton).toBeInTheDocument()
        })
    })

    test('contains filter button for global top 10', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const recommendationsButton = screen.getByRole('button', { name: /global top 10/i })
            expect(recommendationsButton).toBeInTheDocument()
        })
    })

    test('does not contain genre related buttons when no genre is selected initially', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const genreButton = screen.queryAllByTestId('genreRecommendation')
            expect(genreButton.length).toBe(0)
        })
    })
})

describe('Genre-related components', () => {
    test('renders filter button for my top 10 genre recommendations when genre selected', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            fireEvent.change(comboBox, { target: { value: 'history' } })
            const genreButton = screen.getByRole('button', { name: /my history recommendations/i })
            expect(genreButton).toBeInTheDocument()
        })
    })

    test('renders filter button for global top 10 genre recommendations when genre selected', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            fireEvent.change(comboBox, { target: { value: 'history' } })
            const genreButton = screen.getByRole('button', { name: /global history top 10/i })
            expect(genreButton).toBeInTheDocument()
        })
    })

    test('removes genre related buttons when combobox is selected then deselected', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        await waitFor(() => {
            const comboBox = screen.getByRole('combobox')
            fireEvent.change(comboBox, { target: { value: 'history' } })
            fireEvent.change(comboBox, { target: { value: '' } })
            const genreButton = screen.queryAllByTestId('genreRecommendation')
            expect(genreButton.length).toBe(0)
        })
    })
})

describe('Correct recommendations are displayed when buttons are clicked', () => {
    test('displays my top 10 recommendations ', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        // wait for precoditions to be loaded
        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const recommendationsButton = screen.getByRole('button', { name: /my recommendations/i })
        act(() => { fireEvent.click(recommendationsButton) })

        const firstSuggestion = await screen.findByRole('link', { name: /harry potter and the chamber of secrets postcard book/i })
        expect(firstSuggestion).toBeInTheDocument()
    })

    test('displays exactly 10 recommendations when my top 10 is clicked', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const recommendationsButton = screen.getByRole('button', { name: /my recommendations/i })
        act(() => { fireEvent.click(recommendationsButton) })

        const recommendations = await screen.findAllByTestId('book-recommendation')
        expect((recommendations).length).toBe(10)
    })

    test('displays correct global top 10 recommendations', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const recommendationsButton = screen.getByRole('button', { name: /global top 10/i })
        act(() => { fireEvent.click(recommendationsButton) })

        const firstSuggestion = await screen.findByRole('link', { name: /harry potter and the sorcerer's stone \(harry potter \(paperback\)\)/i })
        expect(firstSuggestion).toBeInTheDocument()
    })

    test('displays exactly 10 recommendations when global top 10 is clicked', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const recommendationsButton = screen.getByRole('button', { name: /global top 10/i })
        act(() => { fireEvent.click(recommendationsButton) })

        const recommendations = await screen.findAllByTestId('book-recommendation')
        expect((recommendations).length).toBe(10)
    })

    test('displays correct global top 10 genre recommendations', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const comboBox = screen.getByRole('combobox')
        fireEvent.change(comboBox, { target: { value: 'history' } })

        const genreButton = screen.getByRole('button', { name: /global history top 10/i })

        await waitFor(() => {
            act(() => { fireEvent.click(genreButton) })
        })

        const firstSuggestion = await screen.findByRole('link', { name: /night/i })
        expect(firstSuggestion).toBeInTheDocument()
    })

    test('displays exactly 10 recommendations when global top 10 genre is clicked', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const comboBox = screen.getByRole('combobox')
        fireEvent.change(comboBox, { target: { value: 'history' } })

        const genreButton = screen.getByRole('button', { name: /global history top 10/i })

        await waitFor(() => {
            act(() => { fireEvent.click(genreButton) })
        })

        const recommendations = await screen.findAllByTestId('book-recommendation')
        expect((recommendations).length).toBe(10)
    })

    test('displays correct my top 10 genre recommendations', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const comboBox = screen.getByRole('combobox')
        fireEvent.change(comboBox, { target: { value: 'history' } })

        const genreButton = screen.getByRole('button', { name: /my history recommendations/i })

        await waitFor(() => {
            act(() => { fireEvent.click(genreButton) })
        })

        const firstSuggestion = await screen.findByRole('link', { name: /the devil in the white city : murder, magic, and madness at the fair that changed america \(illinois\)/i })

        expect(firstSuggestion).toBeInTheDocument()
    })

    test('displays exactly 10 recommendations when my top 10 genre is clicked', async () => {
        act(() => {
            render(routerWrapper(<RecommenderPage />))
        })

        const genreSelections = screen.findAllByTestId('genre-selection')
        expect((await genreSelections).length).toBe(10)

        const comboBox = screen.getByRole('combobox')
        fireEvent.change(comboBox, { target: { value: 'history' } })

        const genreButton = screen.getByRole('button', { name: /my history recommendations/i })

        await waitFor(() => {
            act(() => { fireEvent.click(genreButton) })
        })

        const recommendations = await screen.findAllByTestId('book-recommendation')
        expect((recommendations).length).toBe(10)
    })
});
