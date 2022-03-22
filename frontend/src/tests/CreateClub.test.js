import CreateClub from "../components/CreateClub/CreateClub";
import {render, screen, cleanup} from '@testing-library/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import React from "react";

import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';




  test("renders", () => {
    render(<BrowserRouter>
            <CreateClub/>
            </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  })

  test("successful club creation", async() => {

    render(<BrowserRouter>
            <CreateClub/>
            </BrowserRouter>) 



    const name = screen.getByTestId("name")
    const description = screen.getByTestId("description")
   
    const submit = screen.getByRole("button")
    userEvent.type(name, "John's club")
    userEvent.type(description, 'I am a test description')
   

    expect(name.value).toBe("John's club")
    expect(description.value).toBe("I am a test description")

    userEvent.click(submit)
    
    



  })

test("unsuccesful sign up", () => {
    render(<BrowserRouter>
            <CreateClub/>
            </BrowserRouter>) 

   const name = screen.getByTestId("name")
   const description = screen.getByTestId("description")
  
   const submit = screen.getByRole("button")
   userEvent.type(name, "")
   userEvent.type(description, 'I am a test description')
  

   expect(name.value).toBe("")
   expect(description.value).toBe("I am a test description")

   userEvent.click(submit)
   

})

