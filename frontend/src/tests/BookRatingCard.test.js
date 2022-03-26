import {render, screen} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";
import BookRatingCard from "../components/GeneralComponents/BookRatingCard";


test("renders with clearable", async () => {
    render(<BrowserRouter>
        <BookRatingCard title={"Classical Mythology"} author={"Mark P. O. Morford"}
                        image_links_large={"http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg"}
                        id={"0195153448"} genre={"Social Science"} initial_rating={0} clearable={true}/>
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("author")).toBeInTheDocument();
    expect(screen.getByTestId("submitButton")).toBeInTheDocument();
    expect(screen.getByTestId("stars")).toBeInTheDocument();
})


test("renders with not clearable", async () => {
    render(<BrowserRouter>
        <BookRatingCard title={"Classical Mythology"} author={"Mark P. O. Morford"}
                        image_links_large={"http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg"}
                        id={"0195153448"} genre={"Social Science"} initial_rating={0} clearable={false}/>
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("author")).toBeInTheDocument();
    expect(screen.queryByTestId("submitButton")).not.toBeInTheDocument();
    expect(screen.getByTestId("stars")).toBeInTheDocument();
})