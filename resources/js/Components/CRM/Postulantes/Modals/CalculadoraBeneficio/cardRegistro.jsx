import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function formatoMonto(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "—";
    }

    // Formatea números y cadenas numéricas sin modificar otros formatos.
    const esNumero =
        typeof valor === "number" ||
        /^-?\d+(\.\d+)?$/.test(String(valor).trim());

    if (esNumero && Number.isFinite(Number(valor))) {
        return Number(valor).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    return valor;
}

export default function CardRegistro({ data }) {
    const [copiado, setCopiado] = useState({
        nueva: false,
        antigua: false,
    });

    const temporizadores = useRef({});

    useEffect(() => {
        const timers = temporizadores.current;

        return () => {
            Object.values(timers).forEach(clearTimeout);
        };
    }, []);

    async function handleCopy(tipo, texto) {
        if (!texto) {
            toast.error("No hay texto disponible para copiar.");
            return;
        }

        try {
            await navigator.clipboard.writeText(texto);

            toast.success("Texto copiado");

            setCopiado((actual) => ({
                ...actual,
                [tipo]: true,
            }));

            clearTimeout(temporizadores.current[tipo]);

            temporizadores.current[tipo] = setTimeout(() => {
                setCopiado((actual) => ({
                    ...actual,
                    [tipo]: false,
                }));
            }, 1500);
        } catch {
            toast.error("No se pudo copiar el texto.");
        }
    }

    return (
        <article className="beneficio-registro">
            <header className="beneficio-registro__cabecera">
                <span className="beneficio-registro__etiqueta">
                    Período laborado
                </span>

                <h3 className="beneficio-registro__periodo">
                    {data.fechaIngreso || "—"}
                    {" – "}
                    {data.fechaCese || "—"}
                </h3>
            </header>

            <dl className="beneficio-registro__datos">
                <div className="beneficio-registro__fila">
                    <dt>Sueldo:</dt>
                    <dd>S/ {formatoMonto(data.sueldo)}</dd>
                </div>

                <div className="beneficio-registro__fila">
                    <dt>Fecha de solicitud:</dt>
                    <dd>{data.fechaPagado || "—"}</dd>
                </div>

                <div className="beneficio-registro__fila">
                    <dt>Monto pagado:</dt>
                    <dd>S/ {formatoMonto(data.monto)}</dd>
                </div>
            </dl>

            <footer className="beneficio-registro__acciones">
                <button
                    type="button"
                    className="beneficio-registro__boton beneficio-registro__boton--principal"
                    onClick={() =>
                        handleCopy("nueva", data.copyNuevaLey)
                    }
                    aria-label="Copiar cálculo de nueva ley"
                >
                    <i
                        className={
                            copiado.nueva
                                ? "fas fa-check"
                                : "far fa-copy"
                        }
                        aria-hidden="true"
                    ></i>

                    <span>
                        {copiado.nueva ? "Copiado" : "Nueva ley"}
                    </span>
                </button>

                <button
                    type="button"
                    className="beneficio-registro__boton beneficio-registro__boton--secundario"
                    onClick={() =>
                        handleCopy("antigua", data.copyAntiguaLey)
                    }
                    aria-label="Copiar cálculo de antigua ley"
                >
                    <i
                        className={
                            copiado.antigua
                                ? "fas fa-check"
                                : "far fa-copy"
                        }
                        aria-hidden="true"
                    ></i>

                    <span>
                        {copiado.antigua ? "Copiado" : "Antigua ley"}
                    </span>
                </button>
            </footer>
        </article>
    );
}
