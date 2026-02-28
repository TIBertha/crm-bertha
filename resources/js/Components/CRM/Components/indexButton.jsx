import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isResponsive } from "../../Functions/General";

export default function IndexButton({
    type,
    route,
    urlPrint,
    handleClickFunction,
    handleOpenSideBar,
}) {
    let responsive = isResponsive();

    let conf = {
        div: "col-12 col-md-auto px-1 my-2 my-md-0",
        buttonSize:
            "btn font-weight-bold font text-white btn-" +
            (responsive ? "lg btn-block" : "sm"),
        searchIcon: "fas fa-search me-2",
        createIcon: "fas fa-plus me-2",
        downloadIcon: "fas fa-file-download me-2",
    };

    if (type === "search") {
        return (
            <div className={conf.div}>
                <a
                    className={conf.buttonSize + " bertha-pink-button"}
                    onClick={(e) => handleOpenSideBar(e, true)}
                >
                    <i className={conf.searchIcon}></i>Buscar
                </a>
            </div>
        );
    }

    if (type === "create") {
        return (
            <div className={conf.div}>
                <Link
                    className={conf.buttonSize + " bertha-purple-button"}
                    to={route}
                >
                    <i className={conf.createIcon}></i>Nuevo
                </Link>
            </div>
        );
    }

    if (type === "handleSearch") {
        return (
            <div className={conf.div}>
                <a
                    className={conf.buttonSize + " bertha-pink-button"}
                    onClick={handleClickFunction}
                >
                    <i className={conf.searchIcon}></i>Buscar
                </a>
            </div>
        );
    }

    if (type === "handleCreate") {
        return (
            <div className={conf.div}>
                <a
                    className={conf.buttonSize + " bertha-purple-button"}
                    onClick={handleClickFunction}
                >
                    <i className={conf.createIcon}></i>Nuevo
                </a>
            </div>
        );
    }

    if (type === "print") {
        return (
            <div className={conf.div}>
                <a
                    href={urlPrint}
                    target="_blank"
                    className={conf.buttonSize + " bertha-green-button"}
                >
                    <i className={conf.downloadIcon}></i>Imprimir
                </a>
            </div>
        );
    }
}
