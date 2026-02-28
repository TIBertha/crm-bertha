import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import EmpleadoresIndex from "./empleadoresIndex.jsx";
import EmpleadoresEdit from "./empleadoresEdit.jsx";
import EmpleadoresNew from "./empleadoresNew.jsx";

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
                            path="/empleadores"
                            element={<EmpleadoresIndex url={this.state.url} />}
                        />
                        <Route
                            path="/empleadores/edit/:id"
                            element={<EmpleadoresEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/empleadores/new"
                            element={<EmpleadoresNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
