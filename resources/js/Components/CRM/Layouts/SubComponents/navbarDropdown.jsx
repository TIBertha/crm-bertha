import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

export default function NavbarDropdown({
    url,
    path,
    label,
    includedPath,
    icon,
    buttonStyle,
    iconStyle,
    labelStyle,
    sublist,
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <li>
            <div
                className={"label-link" + (path.includes(includedPath) ? " selected" : "")}
                onClick={(e) => setIsOpen((prev) => !prev)}
            >
                <a className={buttonStyle + (path.includes(includedPath) ? " selected" : "")}>
                    <i className={icon + iconStyle}></i>
                    <span className={labelStyle}>{label}</span>
                </a>
                <i
                    className={
                        "fa-solid fa-angle-down arrow" +
                        (isOpen == true ? " rotate" : " close") +
                        (path.includes(includedPath) ? " selected" : "")
                    }
                ></i>
            </div>

            <ul className={"sub-menu" + (isOpen == true ? " open" : " close")}>
                {sublist.map((d, index) => {
                    return (
                        <li>
                            <a className={buttonStyle} href={d.href}>
                                {d.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </li>
    );
}
