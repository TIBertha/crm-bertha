import React, { useEffect, useState } from "react";

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
    const currentPath = String(path || "").split(/[?#]/)[0];

    const isSelected = (href) =>
        currentPath === href ||
        currentPath.startsWith(`${href}/`);

    const isSectionActive =
        currentPath.includes(includedPath);

    const [isOpen, setIsOpen] = useState(isSectionActive);

    useEffect(() => {
        setIsOpen(isSectionActive);
    }, [currentPath, isSectionActive]);

    return (
        <li>
            <div
                className="label-link"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
            >
                <a
                    className={buttonStyle}
                    style={{
                        fontWeight: isSectionActive ? 600 : undefined,
                    }}
                >
                    <i className={icon + iconStyle}></i>

                    <span className={labelStyle}>
                        {label}
                    </span>
                </a>

                <i
                    aria-hidden="true"
                    className={
                        "fa-solid fa-angle-down arrow" +
                        (isOpen ? " rotate" : " close")
                    }
                ></i>
            </div>

            <ul
                className={
                    "sub-menu" +
                    (isOpen ? " open" : " close")
                }
            >
                {sublist.map((item) => {
                    const selected = isSelected(item.href);

                    return (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={buttonStyle + (selected ? " selected" : "")}
                                aria-current={selected ? "page" : undefined}
                            >
                                {item.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </li>
    );
}
