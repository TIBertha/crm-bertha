import React, { useEffect, useState } from "react";

export default function NoDataLabel({ additionalClass, msj }) {
    return (
        <div
            className={"alert alert-secondary mt-4 " + additionalClass}
            role="alert"
        >
            {(msj ? msj : "No hay adjuntos") + "."}
        </div>
    );
}
