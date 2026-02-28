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
    ReactDOM.createRoot(postulantesAppJSX).render(
        <PostulantesApp {...props} />,
        postulantesAppJSX,
    );
}

/*---empleadoresApp.jsx---*/
import EmpleadoresApp from "./Components/CRM/Empleadores/empleadoresApp.jsx";
const empleadoresAppJSX = document.getElementById("empleadores-app");
if (empleadoresAppJSX) {
    const props = Object.assign({}, empleadoresAppJSX.dataset);
    ReactDOM.createRoot(empleadoresAppJSX).render(
        <EmpleadoresApp {...props} />,
        empleadoresAppJSX,
    );
}

/*---requerimientosApp.jsx---*/
import RequerimientosApp from "./Components/CRM/Requerimientos/requerimientosApp.jsx";
const requerimientosAppJSX = document.getElementById("requerimientos-app");
if (requerimientosAppJSX) {
    const props = Object.assign({}, requerimientosAppJSX.dataset);
    ReactDOM.createRoot(requerimientosAppJSX).render(
        <RequerimientosApp {...props} />,
        requerimientosAppJSX,
    );
}

/*---requerimientosApp.jsx---*/
import ContratosApp from "./Components/CRM/Contratos/contratosApp.jsx";
const contratosAppJSX = document.getElementById("contratos-app");
if (contratosAppJSX) {
    const props = Object.assign({}, contratosAppJSX.dataset);
    ReactDOM.createRoot(contratosAppJSX).render(
        <ContratosApp {...props} />,
        contratosAppJSX,
    );
}

/*---testimonialesEmpleadorApp.jsx---*/
import TestimonialesEmpleadorApp from "./Components/CRM/TestimonialesEmpleador/testimonialesEmpleadorApp.jsx";
const testimonialesEmpleadorApp = document.getElementById("testimoniales-empleador-app");
if (testimonialesEmpleadorApp) {
    const props = Object.assign({}, testimonialesEmpleadorApp.dataset);
    ReactDOM.createRoot(testimonialesEmpleadorApp).render(
        <TestimonialesEmpleadorApp {...props} />,
        testimonialesEmpleadorApp,
    );
}

/*---testimonialesTrabajadorApp.jsx---*/
import TestimonialesTrabajadorApp from "./Components/CRM/TestimonialesTrabajador/testimonialesTrabajadorApp.jsx";
const testimonialesTrabajadorApp = document.getElementById("testimoniales-trabajador-app");
if (testimonialesTrabajadorApp) {
    const props = Object.assign({}, testimonialesTrabajadorApp.dataset);
    ReactDOM.createRoot(testimonialesTrabajadorApp).render(
        <TestimonialesTrabajadorApp {...props} />,
        testimonialesTrabajadorApp,
    );
}

/*---indicadoresApp.jsx---*/
import IndicadoresApp from "./Components/CRM/Indicadores/indicadoresApp.jsx";
const indicadoresApp = document.getElementById("indicadores-app");
if (indicadoresApp) {
    const props = Object.assign({}, indicadoresApp.dataset);
    ReactDOM.createRoot(indicadoresApp).render(
        <IndicadoresApp {...props} />,
        indicadoresApp,
    );
}

/*---adminApp.jsx---*/
import AdminsApp from "./Components/CRM/Administradores/adminApp.jsx";
const adminApp = document.getElementById("admin-app");
if (adminApp) {
    const props = Object.assign({}, adminApp.dataset);
    ReactDOM.createRoot(adminApp).render(
        <AdminsApp {...props} />,
        adminApp,
    );
}

/*---prensaApp.jsx---*/
import PrensaApp from "./Components/CRM/Prensa/prensaApp.jsx";
const prensaApp = document.getElementById("prensa-app");
if (prensaApp) {
    const props = Object.assign({}, prensaApp.dataset);
    ReactDOM.createRoot(prensaApp).render(
        <PrensaApp {...props} />,
        prensaApp,
    );
}

/*---reclamosApp.jsx---*/
import ReclamosApp from "./Components/CRM/Reclamos/reclamosApp.jsx";
const reclamosApp = document.getElementById("reclamos-app");
if (reclamosApp) {
    const props = Object.assign({}, reclamosApp.dataset);
    ReactDOM.createRoot(reclamosApp).render(
        <ReclamosApp {...props} />,
        reclamosApp,
    );
}

/*---credencialesApp.jsx---*/
import CredencialesApp from "./Components/CRM/Credenciales/credencialesApp.jsx";
const credencialesApp = document.getElementById("credenciales-app");
if (credencialesApp) {
    const props = Object.assign({}, credencialesApp.dataset);
    ReactDOM.createRoot(credencialesApp).render(
        <CredencialesApp {...props} />,
        credencialesApp,
    );
}
