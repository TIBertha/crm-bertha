import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import RequerimientosIndex from "./requerimientosIndex.jsx";
import RequerimientosEdit from "./requerimientosEdit.jsx";
import RequerimientosNew from "./requerimientosNew.jsx";

export default class EmpleadoresAppApp extends Component {
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
                            path="/requerimientos"
                            element={<RequerimientosIndex url={this.state.url} />}
                        />
                        <Route
                            path="/requerimientos/edit/:id"
                            element={<RequerimientosEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/requerimientos/new"
                            element={<RequerimientosNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
