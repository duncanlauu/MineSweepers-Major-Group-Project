import React from "react"
import ReactDOM from "react-dom"
import LandingPage from "../../src/components/LandingPage/LandingPage"
import renderer from "react-test-renderer"
import { render, screen, cleanup } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

afterEach(cleanup)

it("renders without crashing", () => {
    render(<LandingPage />, { wrapper: MemoryRouter })
})

it("displays the required links", () => {
    render(<LandingPage />, { wrapper: MemoryRouter })
    const login_link = screen.getByTestId('login_link')

})

it("matches snapshot", () => {
    const tree = renderer.create(<MemoryRouter><LandingPage /></MemoryRouter>).toJSON()
    expect(tree).toMatchSnapshot()
})