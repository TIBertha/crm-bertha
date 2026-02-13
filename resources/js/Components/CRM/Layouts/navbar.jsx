import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import imgLogo from "../../../../../public/img/logo.png";
import SessionMenu from "./sessionMenu";
import NavbarDropdown from "./SubComponents/navbarDropdown";
import { mobileDesktop } from "../../Functions/General";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";

export default function Navbar({ url, path, profilename, profilepic }) {
    const [isClicked, setIsClicked] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    let display = mobileDesktop();

    function setClick(e) {
        setIsClicked((prev) => !prev);
        const body = document.getElementById("mc");
        if (isClicked == true) {
            body.classList.remove("sidebar-collapsed");
        } else {
            body.classList.add("sidebar-collapsed");
        }
    }

    let verticalNavbar = {
        button: "items",
        icon: " ",
        label: "nav-label ps-2",
    };

    let administradorSection = [
        { label: "Usuarios Internos", href: "/usu-int" },
        { label: "Documentos", href: "/documentos" },
    ];

    let menuList = [
        {
            label: "Indicadores",
            icon: "fa-solid fa-chart-column",
            href: "/indicadores",
            includedPath: "indicadores",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Administrador",
            icon: "fa-solid fa-user-check",
            href: "/usu-int",
            includedPath: "usu-int",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Postulantes",
            icon: "fa-solid fa-image-portrait",
            href: "/postulantes",
            includedPath: "postulantes",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Empleadores",
            icon: "fa-solid fa-user-group",
            href: "/empleadores",
            includedPath: "empleadores",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Requerimientos",
            icon: "fa-solid fa-list-ul",
            href: "/requerimientos",
            includedPath: "requerimientos",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Contratos",
            icon: "fa-solid fa-file-lines",
            href: "/contratos",
            includedPath: "contratos",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Testimoniales",
            icon: "fa-brands fa-stack-exchange",
            href: "",
            includedPath: "testimoniales",
            drowpdown: true,
            sublist: [
                { label: "Trabajadores", href: "/testimoniales-trabajador" },
                { label: "Empleadores", href: "/testimoniales-empleador" },
            ],
        },
        {
            label: "Prensa",
            icon: "fa-regular fa-newspaper",
            href: "/prensa",
            includedPath: "prensa",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Reclamos",
            icon: "fa-solid fa-book-open",
            href: "/reclamos",
            includedPath: "reclamos",
            drowpdown: false,
            sublist: [],
        },
        {
            label: "Credenciales",
            icon: "fa-solid fa-book-bookmark",
            href: "/credenciales",
            includedPath: "credenciales",
            drowpdown: false,
            sublist: [],
        },
    ];

    return (
        <>
            <nav className="bertha-top-navbar navbar navbar-inverse navbar-global navbar-fixed-top">
                <div className="row justify-content-between w-100 m-0">
                    <div className="col-auto p-0">
                        <a
                            className="menu-button"
                            onClick={(e) =>
                                display == "desktop"
                                    ? setClick(e)
                                    : setOpenMobileMenu(true)
                            }
                        >
                            <i className={"fa-solid fa-bars"}></i>
                        </a>
                        <span className="ms-2">
                            <img src={imgLogo} className="menu-logo" />
                        </span>
                    </div>
                    <div className="col-auto p-0">
                        <span className="red-circle-recording"></span>
                    </div>
                    <div className="col-auto p-0">
                        <SessionMenu
                            url={url}
                            profilename={profilename}
                            profilepic={profilepic}
                        />
                    </div>
                </div>
            </nav>

            {display == "mobile" && (
                <Modal
                    size={"xl"}
                    show={openMobileMenu}
                    onHide={(e) => setOpenMobileMenu(false)}
                    centered={true}
                    dialogClassName={"navbar-menu-modal"}
                    backdrop="static"
                >
                    <ModalBody className="py-20 text-center">
                        <div className="bertha-mobile-menu">
                            <div className="menu-title">
                                <i
                                    class="close-button fa-solid fa-xmark"
                                    onClick={(e) => setOpenMobileMenu(false)}
                                ></i>
                                <p>Menú</p>
                                <hr />
                            </div>
                            <ul className="menu-list">
                                {menuList.map((m, index) => {
                                    return (
                                        <>
                                            {m.drowpdown == true ? (
                                                <NavbarDropdown
                                                    url={url}
                                                    path={path}
                                                    label={m.label}
                                                    includedPath={
                                                        m.includedPath
                                                    }
                                                    icon={m.icon}
                                                    buttonStyle={
                                                        verticalNavbar.button
                                                    }
                                                    iconStyle={
                                                        verticalNavbar.icon
                                                    }
                                                    labelStyle={
                                                        verticalNavbar.label
                                                    }
                                                    sublist={m.sublist}
                                                />
                                            ) : (
                                                <li>
                                                    <a
                                                        href={m.href}
                                                        className={
                                                            verticalNavbar.button +
                                                            (path.includes(
                                                                m.includedPath,
                                                            )
                                                                ? " selected"
                                                                : "")
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                m.icon +
                                                                verticalNavbar.icon
                                                            }
                                                        ></i>
                                                        <span
                                                            className={
                                                                verticalNavbar.label
                                                            }
                                                        >
                                                            {m.label}
                                                        </span>
                                                    </a>
                                                </li>
                                            )}
                                        </>
                                    );
                                })}
                            </ul>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {display == "desktop" && (
                <nav
                    className={
                        "bertha-vertical-navbar navbar-primary" +
                        (isClicked == true ? " collapsed" : "")
                    }
                >
                    <ul className="navbar-primary-menu">
                        {menuList.map((m, index) => {
                            return (
                                <>
                                    {m.drowpdown == true ? (
                                        <NavbarDropdown
                                            url={url}
                                            path={path}
                                            label={m.label}
                                            includedPath={m.includedPath}
                                            icon={m.icon}
                                            buttonStyle={verticalNavbar.button}
                                            iconStyle={verticalNavbar.icon}
                                            labelStyle={verticalNavbar.label}
                                            sublist={m.sublist}
                                        />
                                    ) : (
                                        <li>
                                            <a
                                                href={m.href}
                                                className={
                                                    verticalNavbar.button +
                                                    (path.includes(
                                                        m.includedPath,
                                                    )
                                                        ? " selected"
                                                        : "")
                                                }
                                            >
                                                <i
                                                    className={
                                                        m.icon +
                                                        verticalNavbar.icon
                                                    }
                                                ></i>
                                                <span
                                                    className={
                                                        verticalNavbar.label
                                                    }
                                                >
                                                    {m.label}
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                </>
                            );
                        })}
                    </ul>
                </nav>
            )}
        </>
    );
}
