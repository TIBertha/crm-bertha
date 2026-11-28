import React, { useEffect, useState } from "react";
import { Td } from "react-super-responsive-table";

const opciones = [
    { value: 1, label: "LLEGÓ", color: "green" },
    { value: 2, label: "YENDO", color: "yellow" },
    { value: 0, label: "PLANTÓ", color: "black" },
];

export default function VerificadorIngresoTd({ data, setVerifIngreso }) {
    const estadoGuardado = data.verif_ingreso == null
        ? null
        : Number(data.verif_ingreso);

    const [verificadorIngreso, setVerificadorIngreso] = useState(estadoGuardado);

    useEffect(() => {
        setVerificadorIngreso(estadoGuardado);
    }, [data.id, estadoGuardado]);

    function changeEstatusAsistencia(event, condition) {
        if (verificadorIngreso === condition) return;

        setVerificadorIngreso(condition);
        setVerifIngreso(event, data.id, condition);
    }

    return (
        <Td className="vertical-align-middle align-switch">
            <div className="verificador-ingreso">
                {opciones.map((opcion) => {
                    const seleccionada = verificadorIngreso === opcion.value;

                    return (
                        <button
                            key={opcion.value}
                            type="button"
                            aria-pressed={seleccionada}
                            className={
                                "verificador-ingreso__opcion" +
                                (seleccionada ? ` selected-${opcion.color}` : "")
                            }
                            onClick={(event) =>
                                changeEstatusAsistencia(event, opcion.value)
                            }
                        >
                            {opcion.label}
                        </button>
                    );
                })}
            </div>
        </Td>
    );
}
