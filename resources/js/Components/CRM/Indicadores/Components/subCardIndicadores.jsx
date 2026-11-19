import React from "react";

function mostrarValor(valor) {
    return valor === null || valor === undefined || valor === ""
        ? "—"
        : valor;
}

export default function SubCardIndicadores({
   data = {},
   soloDetalle = false,
}) {
    if (soloDetalle) {
        return (
            <dl className="indicadores-mensuales__filas">
                <div className="indicadores-mensuales__fila">
                    <dt>Con contratos</dt>
                    <dd>{mostrarValor(data.totalConContratos)}</dd>
                </div>

                <div className="indicadores-mensuales__fila">
                    <dt>Sin contratos</dt>
                    <dd>{mostrarValor(data.totalSinContratos)}</dd>
                </div>
            </dl>
        );
    }

    return (
        <>
            <div className="py-1">
                <span>
                    Registrados (<strong>{data.total}</strong>)
                </span>
            </div>

            <div className="py-1">
                <span>
                    Con contratos (
                    <strong>{data.totalConContratos}</strong>)
                </span>
            </div>

            <div className="py-1">
                <span>
                    Sin contratos (
                    <strong>{data.totalSinContratos}</strong>)
                </span>
            </div>
        </>
    );
}
