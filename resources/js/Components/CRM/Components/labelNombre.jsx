import React from "react";
import { toTitleCase } from "../../Helpers/strings.js";
import NewCopyIcon from "../Components/newCopyIcon.jsx";
import CopyNombrePostulante from "../Components/copyNombrePostulante.jsx";

export default function LabelNombre({
    nombres,
    apellidos,
    children,
    contactname,
    flagemoji,
}) {
    let nombreCompleto = nombres + " " + apellidos;
    return (
        <>
            {nombres && apellidos && (
                <div
                    className="alert alert-secondary label-nombre-alert mt-35 mb-40"
                    role="alert"
                >
                    <p className={"m-0"}>
                        Postulante:
                        <strong>
                            {toTitleCase(nombreCompleto)}
                            <NewCopyIcon
                                icon={"fas fa-user-tag"}
                                additonalClass={"icon-action-sm px-0 ms-1"}
                                copyText={nombreCompleto}
                                tooltipText={"Copiar nombre postulante"}
                                successMsj={"Nombre(s) copiado"}
                            />
                            <CopyNombrePostulante
                                nombres={contactname}
                                flagEmoji={flagemoji}
                            />
                            {children ? children : ""}
                        </strong>
                    </p>
                </div>
            )}
        </>
    );
}
