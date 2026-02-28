import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminIndex from "./adminIndex.jsx";
import AdminEdit from "./adminEdit.jsx";
import AdminNew from "./adminNew.jsx";

export default class AdminApp extends Component{
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
                            path="/usu-int"
                            element={<AdminIndex url={this.state.url} />}
                        />
                        <Route
                            path="/usu-int/edit/:id"
                            element={<AdminEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/usu-int/new"
                            element={<AdminNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
