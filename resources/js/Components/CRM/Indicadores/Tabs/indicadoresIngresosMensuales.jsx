import React from "react";

export default function IndicadoresIngresosMensuales({
     indicadores = [],
 }) {
    return (
        <section className="indicadores-ventas">

            <div className="indicadores-ventas__grid">
                {indicadores.map((item, index) => {
                    const desglose = [
                        `Contratos: ${item.tiempocompleto ?? "—"}`,
                        `Sanciones: ${item.pagosanciones ?? "—"}`,
                        `Adelantos: ${item.adelantos ?? "—"}`,
                        `Liquidaciones: ${item.pagoLiquidaciones ?? "—"}`,
                    ].join("\n");

                    return (
                        <article
                            key={`${item.mes}-${index}`}
                            className="indicadores-ventas__tarjeta"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title={desglose}
                        >
                            <h3 className="indicadores-ventas__mes">
                                {item.mes}
                            </h3>

                            <div className="indicadores-ventas__contenido">
                                <span
                                    className="indicadores-ventas__icono"
                                    aria-hidden="true"
                                >
                                    <i className="fa-solid fa-coins"></i>
                                </span>

                                <div className="indicadores-ventas__datos">
                                    <span className="indicadores-ventas__etiqueta">
                                        Venta total
                                    </span>

                                    <strong className="indicadores-ventas__monto">
                                        <span className="indicadores-ventas__moneda">
                                            S/.
                                        </span>

                                        <span>
                                            {item.total ?? "—"}
                                        </span>
                                    </strong>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
