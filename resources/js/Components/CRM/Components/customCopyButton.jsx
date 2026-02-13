import React, { Component, useState } from "react";

export default function CustomCopyButton({
    textNeutro,
    textOnCopy,
    copyText,
    icon,
    additonalIconClass,
    colorNeutro,
    colorOnCopy,
}) {
    const [textoCopiar, setTextoCopiar] = useState(textNeutro);
    const [colorIcon, setColorIcon] = useState(colorNeutro);

    let iconStyleColor = {
        color: colorIcon,
    };

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);

        setTextoCopiar(textOnCopy);
        setColorIcon(colorOnCopy);

        setTimeout(function () {
            setTextoCopiar(textNeutro);
            setColorIcon(colorNeutro);
        }, 1500);
    }

    return (
        <div className="text-center">
            <span onClick={(e) => handleCopy(e)} className="finger-action">
                <strong>{textoCopiar}</strong>
                {icon && (
                    <>
                        <strong className="mx-2">|</strong>
                        <i
                            className={
                                icon +
                                (additonalIconClass
                                    ? " " + additonalIconClass
                                    : additonalIconClass)
                            }
                            style={iconStyleColor}
                        ></i>
                    </>
                )}
            </span>
        </div>
    );
}
