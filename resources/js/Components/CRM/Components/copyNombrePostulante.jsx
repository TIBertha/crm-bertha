import React, { Component, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CopyNombrePostulante({ nombres, flagEmoji }) {
    const [iconCopy, setIconCopy] = useState("far fa-file");
    let copyText = "PO " + nombres + " " + flagEmoji;

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);
        toast("Nombre(s) para Google copiado", {
            icon: "✅",
        });

        setIconCopy("fas fa-file");

        setTimeout(function () {
            setIconCopy("far fa-file");
        }, 1500);
    }

    return (
        <>
            <i
                onClick={(e) => handleCopy(e)}
                data-toggle="tooltip"
                data-placement="top"
                title={"Copiar nombre en Google"}
                className={iconCopy + " icon-action-sm ms-1"}
            ></i>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
