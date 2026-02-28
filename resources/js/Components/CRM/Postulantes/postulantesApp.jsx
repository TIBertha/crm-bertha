import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import PostulantesIndex from "./postulantesIndex";
import PostulantesEdit from "./postulantesEdit";
import PostulantesNew from "./postulantesNew";

export default class PostulantesApp extends Component {
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
                            path="/postulantes"
                            element={<PostulantesIndex url={this.state.url} />}
                        />
                        <Route
                            path="/postulantes/edit/:id"
                            element={<PostulantesEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/postulantes/new"
                            element={<PostulantesNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
