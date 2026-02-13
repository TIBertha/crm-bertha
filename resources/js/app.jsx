import "./bootstrap.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import "bootstrap";

/*Due the use of Laravel 12 and ReactJSX with vite, this is the new nomenclature*/

/*---test.jsx---*/

import Test from "../js/Components/CRM/Login/test.jsx";
const testJSX = document.getElementById("test");
if (testJSX) {
    const url = testJSX.dataset.url;
    ReactDOM.createRoot(testJSX).render(<Test url={url} />);
}

/*---login.jsx---*/
import Login from "./Components/CRM/Login/login.jsx";
const loginJSX = document.getElementById("login");
if (loginJSX) {
    const url = loginJSX.dataset.url;
    ReactDOM.createRoot(loginJSX).render(<Login url={url} />);
}

/*---navbar.jsx---*/
import Navbar from "./Components/CRM/Layouts/navbar.jsx";
const navbarJSX = document.getElementById("navbar");
if (navbarJSX) {
    const url = navbarJSX.dataset.url;
    const path = navbarJSX.dataset.path;
    const profilename = navbarJSX.dataset.profilename;
    const profilepic = navbarJSX.dataset.profilepic;
    ReactDOM.createRoot(navbarJSX).render(
        <Navbar
            url={url}
            path={path}
            profilename={profilename}
            profilepic={profilepic}
        />,
    );
}

/*---displayLabel.jsx---*/
import DisplayLabel from "./Components/CRM/Layouts/SubComponents/displayLabel.jsx";
const displayLabelJSX = document.getElementById("display-label");
if (displayLabelJSX) {
    const title = displayLabelJSX.dataset.title;
    ReactDOM.createRoot(displayLabelJSX).render(<DisplayLabel title={title} />);
}

/*---postulantesApp.jsx---*/
import PostulantesApp from "./Components/CRM/Postulantes/postulantesApp.jsx";
const postulantesAppJSX = document.getElementById("postulantes-app");
if (postulantesAppJSX) {
    const props = Object.assign({}, postulantesAppJSX.dataset);
    //const url = postulanteAppJSX.dataset.url;
    ReactDOM.createRoot(postulantesAppJSX).render(
        <PostulantesApp {...props} />,
        postulantesAppJSX,
    );
}
