import React from "react";
import SubCardIndicadores from "../Components/subCardIndicadores.jsx";
import SubCardIndicadoresContratos from "../Components/subCardIndicadoresContratos.jsx";

function mostrarValor(valor) {
    return valor === null || valor === undefined || valor === ""
        ? "—"
        : valor;
}

export default function IndicadoresDataNueva({ dataNueva = [] }) {
    return (
        <section className="indicadores-mensuales">

            <div className="indicadores-mensuales__lista">
                {dataNueva.map((mes, index) => {
                    const indicadores = [
                        {
                            id: "trabajadores",
                            titulo: "Trabajadores",
                            icono: "fa-solid fa-users",
                            total: mes.trabajadores?.total,
                            descripcion: "Registrados",
                            contenido: (
                                <SubCardIndicadores
                                    data={mes.trabajadores}
                                    soloDetalle
                                />
                            ),
                        },
                        {
                            id: "empleadores",
                            titulo: "Empleadores",
                            icono: "fa-solid fa-person-breastfeeding",
                            total: mes.empleadores?.total,
                            descripcion: "Registrados",
                            contenido: (
                                <SubCardIndicadores
                                    data={mes.empleadores}
                                    soloDetalle
                                />
                            ),
                        },
                        {
                            id: "requerimientos",
                            titulo: "Requerimientos",
                            icono: "fa-solid fa-clipboard-list",
                            total: mes.requerimientos?.total,
                            descripcion: "Registrados",
                            contenido: (
                                <SubCardIndicadores
                                    data={mes.requerimientos}
                                    soloDetalle
                                />
                            ),
                        },
                        {
                            id: "contratos",
                            titulo: "Contratos",
                            icono: "fa-solid fa-file-contract",
                            total: mes.contratos?.total,
                            descripcion: "Total",
                            contenido: (
                                <SubCardIndicadoresContratos
                                    data={mes.contratos}
                                    parte={1}
                                    soloDetalle
                                />
                            ),
                        },
                        {
                            id: "comisiones",
                            titulo: "Comisiones de contratos",
                            icono: "fa-solid fa-coins",
                            total: mes.contratos?.total,
                            descripcion: "Total",
                            contenido: (
                                <SubCardIndicadoresContratos
                                    data={mes.contratos}
                                    parte={2}
                                    soloDetalle
                                />
                            ),
                        },
                    ];

                    return (
                        <section
                            key={`${mes.nombreMes}-${index}`}
                            className="indicadores-mensuales__mes"
                        >
                            <h3 className="indicadores-mensuales__mes-titulo">
                                {mes.nombreMes}
                            </h3>

                            <div className="indicadores-mensuales__grid">
                                {indicadores.map((indicador) => (
                                    <article
                                        key={indicador.id}
                                        className="indicadores-mensuales__tarjeta"
                                    >
                                        <header className="indicadores-mensuales__tarjeta-cabecera">
                                            <span
                                                className="indicadores-mensuales__icono"
                                                aria-hidden="true"
                                            >
                                                <i
                                                    className={
                                                        indicador.icono
                                                    }
                                                ></i>
                                            </span>

                                            <div className="indicadores-mensuales__principal">
                                                <h4>
                                                    {indicador.titulo}
                                                </h4>

                                                <strong className="indicadores-mensuales__total">
                                                    {mostrarValor(
                                                        indicador.total,
                                                    )}
                                                </strong>

                                                <span className="indicadores-mensuales__descripcion">
                                                    {indicador.descripcion}
                                                </span>
                                            </div>
                                        </header>

                                        <div className="indicadores-mensuales__detalle">
                                            {indicador.contenido}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
}
