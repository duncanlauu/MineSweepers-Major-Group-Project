import React from "react";
import {BrowserRouter} from "react-router-dom";

const routerWrapper = (ChildComponent) => {
    return (
        <BrowserRouter>
            {ChildComponent}
        </BrowserRouter>
    )
}

export default routerWrapper
