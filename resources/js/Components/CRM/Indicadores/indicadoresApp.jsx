import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import IndicadoresIndex from "./indicadoresIndex.jsx";

export default class IndicadoresApp extends Component{
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
        };
    }

    render() {
        return(
            <BrowserRouter>
                <div>
                    <Routes>
                        <Route
                            index
                            path="/indicadores"
                            element={<IndicadoresIndex url={this.state.url} />}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        )
    }
}
