import React, { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { ajaxGetMonitoreoHoy } from "../../../Functions/Contratos.jsx";

const estadosIngreso = {
    0: "PLANTÓ",
    1: "LLEGÓ",
    2: "YENDO",
};

export default function CopiarMonitoreoHoy() {
    const [isLoading, setIsLoading] = useState(false);

    async function copiarMonitoreo() {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const fecha = moment().format("YYYY-MM-DD");
            const r = await ajaxGetMonitoreoHoy(fecha);

            if (r.code !== 200) {
                throw new Error("Error al consultar monitoreo");
            }

            const contratos = r.contratos || [];

            if (!contratos.length) {
                toast("No hay contratos para monitorear hoy");
                return;
            }

            const lista = contratos.map((d, index) => {
                const estado = estadosIngreso[d.verif_ingreso] ?? "";
                const hora = moment(d.hora_ingreso, "HH:mm", true);

                const horaTexto = hora.isValid()
                    ? ` - ${hora.format("h:mm")} ${hora.hour() < 12 ? "AM" : "PM"}`
                    : "";

                const estadoTexto = estado ? `: *${estado}*` : "";

                return `${index + 1}. CL ${d.empleador} CON PO ${d.trabajador}${horaTexto}${estadoTexto}`;
            });

            const diaHoy = new Intl.DateTimeFormat("es-PE", {
                weekday: "long",
            })
                .format(moment(fecha, "YYYY-MM-DD").toDate())
                .toUpperCase();

            const texto = [
                `*MONITOREO ${diaHoy} ${moment(fecha).format("D")}:*`,
                ...lista,
            ].join("\n\n");

            await navigator.clipboard.writeText(texto);
            toast.success("Monitoreo copiado");
        } catch (error) {
            console.error("Error al copiar el monitoreo", error);
            toast.error("No se pudo copiar el monitoreo");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="copiar-monitoreo">
            <button
                type="button"
                className="btn font-weight-bold font text-white btn-sm bertha-orange-button"
                onClick={copiarMonitoreo}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label="Copiar monitoreo de hoy"
                title="Copiar monitoreo de hoy"
            >
                <i
                    className={
                        isLoading
                            ? "fas fa-sync fa-spin"
                            : "fa-solid fa-clipboard-list"
                    }
                    aria-hidden="true"
                />
            </button>
        </div>
    );
}
