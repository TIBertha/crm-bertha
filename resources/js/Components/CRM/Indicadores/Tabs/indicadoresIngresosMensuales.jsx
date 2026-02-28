import React from "react";

export default function IndicadoresIngresosMensuales({indicadores}) {
    function IndicadoresCard(data){

        let dataIndicadores = "Contratos: " + data.tiempocompleto + '\r\n' + "Sanciones:" + data.pagosanciones + '\r\n' + "Adelantos:" + data.adelantos + '\r\n' + "Liquidaciones:" + data.pagoLiquidaciones;

        return(
            <div className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1'}>
                <div className={'indicador-card-style'} data-bs-toggle="tooltip" data-bs-placement="bottom" title={dataIndicadores}>
                    <h5 className="mb-4">{data.mes}</h5>

                    <div>
                        <div className="card shadow-lg rounded indicadores">
                            <div className="card-body d-flex justify-content-center text-center">

                                <div>
                                    <div className="indicadores-title-card">{'Venta Total'}</div>
                                    <div className={'indicadores-price-card text-pink-bertha'}>S/. {data.total}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className={'mt-30 row mx-0'}>
            {indicadores.map((i, key) => {
                return (IndicadoresCard(i))
            })}
        </div>
    )
}
