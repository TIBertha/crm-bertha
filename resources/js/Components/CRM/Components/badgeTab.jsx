import React from "react";

export default function BadgeTab({ color, content }) {
    return (
        <>
            {content ? (
                <span
                    className="ms-2 badge badge-pill custom-badge"
                    style={{ backgroundColor: color }}
                >
                    {content}
                </span>
            ) : (
                ""
            )}
        </>
    );
}
