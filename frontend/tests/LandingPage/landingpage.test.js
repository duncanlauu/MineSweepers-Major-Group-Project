import React from "react"
import ReactDOM from "react-dom"
import LandingPage from "../../src/components/LandingPage/LandingPage"
import renderer from "react-test-renderer"
import { render, cleanup } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

afterEach(cleanup)

it("renders without crashing", () => {
    // const div = document.createElement("div")
    render(<LandingPage />, { wrapper: MemoryRouter })
})

it("matches snapshot", () => {
    const tree = renderer.create(<MemoryRouter><LandingPage /></MemoryRouter>).toJSON()
    expect(tree).toMatchSnapshot()
})