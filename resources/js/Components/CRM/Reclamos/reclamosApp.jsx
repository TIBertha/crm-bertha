import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import ReclamosIndex from "./reclamosIndex.jsx";
import ReclamosEdit from "./reclamosEdit.jsx";
import ReclamosNew from "./reclamosNew.jsx";

export default class ReclamosApp extends Component{
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
                            path="/reclamos"
                            element={<ReclamosIndex url={this.state.url} />}
                        />
                        <Route
                            path="/reclamos/edit/:id"
                            element={<ReclamosEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/reclamos/new"
                            element={<ReclamosNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
