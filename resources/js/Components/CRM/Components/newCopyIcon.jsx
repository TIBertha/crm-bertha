import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewCopyIcon({
    icon = "fas fa-copy",
    additonalClass,
    copyText,
    successMsj = "Texto copiado",
    tooltipText,
    colorNeutro = "#000000",
    colorOnCopy = "#4dabf7",
    textSize = null,
}) {
    const [colorIcon, setColorIcon] = useState(colorNeutro);

    let iconStyleColor = {
        color: colorIcon,
    };

    if (textSize) {
        iconStyleColor = {
            color: colorIcon,
            fontSize: textSize,
        };
    }

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);
        toast(successMsj, {
            icon: "✅",
        });

        setColorIcon(colorOnCopy);

        setTimeout(function () {
            setColorIcon(colorNeutro);
        }, 1500);
    }

    return (
        <>
            <i
                onClick={(e) => handleCopy(e)}
                data-toggle="tooltip"
                data-placement="top"
                title={tooltipText}
                className={icon + (additonalClass ? " " + additonalClass : "")}
                style={iconStyleColor}
            ></i>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
