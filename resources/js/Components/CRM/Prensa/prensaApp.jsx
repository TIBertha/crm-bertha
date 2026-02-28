import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import PrensaIndex from "./prensaIndex.jsx";
import PrensaEdit from "./prensaEdit.jsx";
import PrensaNew from "./prensaNew.jsx";

export default class PrensaApp extends Component{
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
        };
    }

    render() {
        let { url } = this.state;

        return (
            <BrowserRouter>
                <div>
                    <Routes>
                        <Route
                            index
                            path="/prensa"
                            element={<PrensaIndex url={this.state.url} />}
                        />
                        <Route
                            path="/prensa/edit/:id"
                            element={<PrensaEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/prensa/new"
                            element={<PrensaNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
