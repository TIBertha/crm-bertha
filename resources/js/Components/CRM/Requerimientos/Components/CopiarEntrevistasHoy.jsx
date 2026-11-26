import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import toast from "react-hot-toast";
import { ajaxGetEntrevistasRequerimientoHoy } from "../../../Functions/Requerimientos.jsx";
import NewCopyButton from "../../Components/newCopyButton.jsx";

export default function CopiarEntrevistasHoy() {
    const [copyText, setCopyText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    async function prepararCopy() {
        setIsLoading(true);

        try {
            const fecha = moment().format("YYYY-MM-DD");
            const r = await ajaxGetEntrevistasRequerimientoHoy(fecha);

            if (r.code !== 200) {
                throw new Error("Error al consultar entrevistas");
            }

            const entrevistas = r.entrevistas || [];

            if (!entrevistas.length) {
                setCopyText("");
                return;
            }

            const lista = entrevistas.map((d, index) => {

                const seleccionadas = d.postulantesSeleccionadas || [];

                const partesNombre = d.empleador.trim().split(/\s+/);

                const empleador = partesNombre.length > 1
                    ? `${partesNombre[0]} ${partesNombre[1].charAt(0)}.`
                    : partesNombre[0];

                const postulantes = seleccionadas.map((p, i) =>
                    `${i + 1}: ${p.nombre}${p.edad != null ? ` - ${p.edad}` : ""} (${p.distrito})${p.seleccionadaWeb ? " 🫅" : p.seleccionadaWp ? " 👑" : ""}`
                );

                const comision = Number(d.tipocomision) > 0
                    ? `C${d.tipocomision}`
                    : "";

                return [
                    `*${index + 1}. ${empleador}* (${d.tipocontrato}/${comision}) - ${d.horaentrevista || "Por definir hora"}`,
                    [d.modalidad_abreviado, d.distrito].filter(Boolean).join(" | "),
                    ...postulantes,
                ].filter(Boolean).join("\n");
            });

            const diaHoy = new Intl.DateTimeFormat("es-PE", {
                weekday: "long",
            }).format(moment(fecha, "YYYY-MM-DD").toDate()).toUpperCase();

            const texto = [
                `*PEDIDOS ${diaHoy} ${moment(fecha).format("D")}*`,
                ...lista,
            ].join("\n\n");

            setCopyText(texto);

        } catch (error) {
            setCopyText("");
            toast.error("No se pudieron cargar las entrevistas");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        prepararCopy();
    }, []);

    if (isLoading) {
        return (
            <button
                type="button"
                className="btn font-weight-bold font text-white btn-sm bertha-orange-button"
                disabled
            >
                <i className="fas fa-sync fa-spin"></i>
            </button>
        );
    }

    return (
        copyText ? (
            <NewCopyButton
                icon="fa-solid fa-calendar-day"
                btnColor="orange"
                tooltipText="Copiar pedidos de hoy"
                copyText={copyText}
                btnSize={'sm'}
                successMsj="Pedidos de hoy copiados"
            />
        ) : null
    );
}
