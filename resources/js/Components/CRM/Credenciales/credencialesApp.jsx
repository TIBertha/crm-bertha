import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import CredencialesIndex from "./credencialesIndex.jsx";
import CredencialesEdit from "./credencialesEdit.jsx";
import CredencialesNew from "./credencialesNew.jsx";

export default class CredencialesApp extends Component{
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
                            path="/credenciales"
                            element={<CredencialesIndex url={this.state.url} />}
                        />
                        <Route
                            path="/credenciales/edit/:id"
                            element={<CredencialesEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/credenciales/new"
                            element={<CredencialesNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
