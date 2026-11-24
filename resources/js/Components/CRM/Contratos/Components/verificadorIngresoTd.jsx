import React, { useEffect, useState } from "react";
import { Td } from "react-super-responsive-table";

export default function VerificadorIngresoTd({ data, setVerifIngreso }) {

    const [verificadorIngreso, setVerificadorIngreso] = useState(
        Number(data.verif_ingreso ?? 0)
    );

    const opciones = [
        { value: 1, label: "LLEGÓ", color: "green" },
        { value: 2, label: "YENDO", color: "yellow" },
        { value: 0, label: "PLANTÓ", color: "black" },
    ];

    useEffect(() => {
        setVerificadorIngreso(Number(data.verif_ingreso ?? 0));
    }, [data.id, data.verif_ingreso]);

    function changeEstatusAsistencia(e, condition) {
        if (verificadorIngreso === condition) return;

        setVerificadorIngreso(condition);
        setVerifIngreso(e, data.id, condition);
    }

    return (
        <Td className="vertical-align-middle align-switch">
            <div className="verificador-ingreso">

                {opciones.map((opcion) => (
                    <button
                        key={opcion.value}
                        type="button"
                        aria-pressed={verificadorIngreso === opcion.value}
                        className={
                            "verificador-ingreso__opcion" +
                            (verificadorIngreso === opcion.value
                                ? ` selected-${opcion.color}`
                                : "")
                        }
                        onClick={(e) =>
                            changeEstatusAsistencia(e, opcion.value)
                        }
                    >
                        {opcion.label}
                    </button>
                ))}

            </div>
        </Td>
    );
}
