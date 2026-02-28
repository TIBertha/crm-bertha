import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import ContratosIndex from "./contratosIndex.jsx";
import ContratosEdit from "./contratosEdit.jsx";
import ContratosNew from "./contratosNew.jsx";

export default class ContratosApp extends Component {
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
                            path="/contratos"
                            element={<ContratosIndex url={this.state.url} />}
                        />
                        <Route
                            path="/contratos/edit/:id"
                            element={<ContratosEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/contratos/new"
                            element={<ContratosNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
