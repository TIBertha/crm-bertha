import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import moment from "moment";

export default function DisplayLabel({ title }) {
    const year = moment().format("YYYY");

    return (
        <div className={"row mx-0 justify-content-between display-label"}>
            <div className={"col-auto px-0"}>{title}</div>
            <div className={"col-auto px-0"}>
                <i className="far fa-copyright me-1"></i>
                {year + " Bertha"}
            </div>
        </div>
    );
}
