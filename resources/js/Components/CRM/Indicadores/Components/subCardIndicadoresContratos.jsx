import React from "react";

function mostrarValor(valor) {
    return valor === null || valor === undefined || valor === ""
        ? "—"
        : valor;
}

export default function SubCardIndicadoresContratos({
    data = {},
    parte,
    soloDetalle = false,
}) {
    const filas =
        Number(parte) === 1
            ? [
                { etiqueta: "Aperturas", valor: data.apertura },
                { etiqueta: "Reposiciones", valor: data.reposicion },
                { etiqueta: "Cambios", valor: data.cambio },
            ]
            : Number(parte) === 2
                ? [
                    {
                        etiqueta: "Comisión 1",
                        valor: data.totalComision1,
                    },
                    {
                        etiqueta: "Comisión 2",
                        valor: data.totalComision2,
                    },
                    {
                        etiqueta: "Comisión 3",
                        valor: data.totalComision3,
                    },
                ]
                : [];

    if (soloDetalle) {
        return (
            <dl className="indicadores-mensuales__filas">
                {filas.map((fila) => (
                    <div
                        key={fila.etiqueta}
                        className="indicadores-mensuales__fila"
                    >
                        <dt>{fila.etiqueta}</dt>
                        <dd>{mostrarValor(fila.valor)}</dd>
                    </div>
                ))}
            </dl>
        );
    }

    return (
        <>
            <div className="py-1">
                <strong>Total ({data.total})</strong>
            </div>

            {filas.map((fila) => (
                <div key={fila.etiqueta} className="py-1">
                    <span>
                        {fila.etiqueta} (
                        <strong>{fila.valor}</strong>)
                    </span>
                </div>
            ))}
        </>
    );
}
