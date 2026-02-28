import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import TestimonialesTrabajadorIndex from "./testimonialesTrabajadorIndex.jsx";
import TestimonialesTrabajadorEdit from "./testimonialesTrabajadorEdit.jsx";
import TestimonialesTrabajadorNew from "./testimonialesTrabajadorNew.jsx";

export default class TestimonialesTrabajadorApp extends Component {
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
                            path="/testimoniales-trabajador"
                            element={<TestimonialesTrabajadorIndex url={this.state.url} />}
                        />
                        <Route
                            path="/testimoniales-trabajador/edit/:id"
                            element={<TestimonialesTrabajadorEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/testimoniales-trabajador/new"
                            element={<TestimonialesTrabajadorNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
