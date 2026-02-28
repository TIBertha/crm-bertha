import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CardRegistro({data}) {

    const [backgroundColorNL, setBackgroundColorNL] = useState("#00acf0");
    const [backgroundColorAL, setBackgroundColorAL] = useState("#ffc107");

    let iconStyleColorNL = {
        backgroundColor: backgroundColorNL,
        color: "#FFFFFF",
    };
    let iconStyleColorAL = {
        backgroundColor: backgroundColorAL,
        color: "#FFFFFF",
    };

    function handleCopyNL(textCopy, successMsj) {
        navigator.clipboard.writeText(textCopy);
        toast(successMsj, {
            icon: "✅",
        });

        setBackgroundColorNL("#037eab");

        setTimeout(function () {
            setBackgroundColorNL("#00acf0");
        }, 1500);
    }

    function handleCopyAL(textCopy, successMsj) {
        navigator.clipboard.writeText(textCopy);
        toast(successMsj, {
            icon: "✅",
        });

        setBackgroundColorAL("#9d7701");

        setTimeout(function () {
            setBackgroundColorAL("#ffc107");
        }, 1500);
    }


    return(
        <div className={"beneficioCardData"} >
            <p>
                <strong>Fecha Laborada:{" "}</strong>{" "}
                {data.fechaIngreso + " - " + data.fechaCese}
            </p>
            <p className={"px-1"}>
                <strong>Sueldo: </strong>
                {"S/ " + data.sueldo}
            </p>
            <p className={"px-1"}>
                <strong>Fecha Solicitud: </strong>
                {data.fechaPagado}
            </p>
            <p className={"px-1"} >
                <strong>Monto Pagado:</strong>{" "}
                {"S/ " + data.monto}
            </p>

            <div className={"text-center mt-2"}>
                <a className={"btn btn-lg btn-block font-weight-bold"}
                   style={iconStyleColorNL}
                   onClick={(e) => handleCopyNL(data.copyNuevaLey, "Texto copiado")}
                >
                    <i className={"fas fa-copy me-2"}></i>
                    COPY NUEVA LEY
                </a>
            </div>

            <div
                className={
                    "text-center mt-2"
                }
            >
                <a
                    className={"btn btn-lg btn-block font-weight-bold"}
                    style={iconStyleColorAL}
                    onClick={(e) => handleCopyAL(data.copyAntiguaLey, "Texto copiado")
                    }
                >
                    <i className={"fas fa-copy me-2"}></i>
                    COPY ANTIGUA LEY
                </a>
            </div>
        </div>
    )
}
