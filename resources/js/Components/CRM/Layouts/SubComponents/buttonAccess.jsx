import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isResponsive } from "../../../Functions/General";

export default function ButtonAccess({ url, title, icon, buttonColor }) {
    let responsive = isResponsive();

    return (
        <a
            className={
                "bertha-" +
                buttonColor +
                "-button font-weight-bold font btn " +
                (responsive == true ? "btn-lg w-100" : "btn-sm")
            }
            data-toggle="tooltip"
            data-placement={"bottom"}
            title={title}
            href={url}
            target={"_blank"}
        >
            <i className={icon + " icon-question text-white"}></i>
            {responsive == true ? <span className={"ms-2"}>{title}</span> : ""}
        </a>
    );
}
