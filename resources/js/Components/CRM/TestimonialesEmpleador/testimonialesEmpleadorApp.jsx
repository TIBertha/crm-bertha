import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import TestimonialesEmpleadorIndex from "./testimonialesEmpleadorIndex.jsx";
import TestimonialesEmpleadorNew from "./testimonialesEmpleadorNew.jsx";
import TestimonialesEmpleadorEdit from "./testimonialesEmpleadorEdit.jsx";

export default class TestimonialesEmpleadorApp extends Component {
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
                            path="/testimoniales-empleador"
                            element={<TestimonialesEmpleadorIndex url={this.state.url} />}
                        />
                        <Route
                            path="/testimoniales-empleador/edit/:id"
                            element={<TestimonialesEmpleadorEdit url={url} show={false}/>}
                        />
                        <Route
                            path="/testimoniales-empleador/new"
                            element={<TestimonialesEmpleadorNew url={url}/>}
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}
