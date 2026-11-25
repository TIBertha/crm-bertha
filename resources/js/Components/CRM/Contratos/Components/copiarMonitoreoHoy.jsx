import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { ajaxGetMonitoreoHoy } from "../../../Functions/Contratos.jsx";
import NewCopyButton from "../../Components/newCopyButton.jsx";

export default function CopiarMonitoreoHoy({ revision = 0 }) {
    const [copyText, setCopyText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const estadosIngreso = {
        0: "PLANTÓ",
        1: "LLEGÓ",
        2: "YENDO",
    };

    async function prepararCopy() {
        setIsLoading(true);

        try {
            const fecha = moment().format("YYYY-MM-DD");
            const r = await ajaxGetMonitoreoHoy(fecha);

            if (r.code !== 200) {
                throw new Error("Error al consultar monitoreo");
            }

            const contratos = r.contratos || [];

            if (!contratos.length) {
                setCopyText("");
                return;
            }

            const lista = contratos.map((d, index) => {
                const estado = estadosIngreso[d.verif_ingreso] ?? "";
                const hora = moment(d.hora_ingreso, "HH:mm", true);

                const horaTexto = hora.isValid()
                    ? ` - ${hora.format("h:mm")} ${hora.hour() < 12 ? "AM" : "PM"}`
                    : "";

                return `${index + 1}. CL ${d.empleador} CON PO ${d.trabajador}${horaTexto}: *${estado}*`;
            });

            const diaHoy = new Intl.DateTimeFormat("es-PE", {
                weekday: "long",
            }).format(moment(fecha, "YYYY-MM-DD").toDate()).toUpperCase();

            const texto = [
                `*MONITOREO ${diaHoy} ${moment(fecha).format("D")}:*`,
                ...lista,
            ].join("\n\n");

            setCopyText(texto);

        } catch (error) {
            setCopyText("");
            toast.error("No se pudo cargar el monitoreo");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        prepararCopy();
    }, [revision]);

    return (
        <div className="copiar-monitoreo">
            {isLoading ? (
                <button
                    type="button"
                    className="btn font-weight-bold font text-white btn-sm bertha-orange-button"
                    disabled
                >
                    <i className="fas fa-sync fa-spin"></i>
                </button>
            ) : copyText ? (
                <NewCopyButton
                    icon="fa-solid fa-clipboard-list"
                    btnColor="orange"
                    btnSize="sm"
                    //additionalClass="copiar-monitoreo__button"
                    tooltipText="Copiar monitoreo de hoy"
                    copyText={copyText}
                    successMsj="Monitoreo copiado"
                />
            ) : null}
        </div>
    );
}
