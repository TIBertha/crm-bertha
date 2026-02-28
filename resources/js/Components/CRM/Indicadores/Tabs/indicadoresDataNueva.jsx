import React from "react";
import SubCardIndicadores from "../Components/subCardIndicadores.jsx";
import SubCardIndicadoresContratos from "../Components/subCardIndicadoresContratos.jsx";

export default function IndicadoresDataNueva({dataNueva}) {
    function card(d){
        return(
            <div className={'col-12 px-1'}>
                <div className={'indicador-card-style'}>
                    <h5 className="mb-4">{d.nombreMes}</h5>

                    <div>
                        <div className="card shadow-lg rounded indicadores">
                            <div className="card-body justify-content-center text-center">

                                <div className={'row mx-0'}>
                                    <div className={'col-12 col-lg-3 p-1'}>
                                        <div className={'subCard'}>
                                            <div className={'ti1'}>TRABAJADORES</div>
                                            <SubCardIndicadores data={d.trabajadores}/>
                                        </div>
                                    </div>
                                    <div className={'col-12 col-lg-3 p-1'}>
                                        <div className={'subCard'}>
                                            <div className={'ti1'}>EMPLEADORES</div>
                                            <SubCardIndicadores data={d.empleadores}/>
                                        </div>
                                    </div>
                                    <div className={'col-12 col-lg-3 p-1'}>
                                        <div className={'subCard'}>
                                            <div className={'ti1'}>REQUERIMIENTOS</div>
                                            <SubCardIndicadores data={d.requerimientos}/>
                                        </div>
                                    </div>
                                    <div className={'col-12 col-lg-3 p-1'}>
                                        <div className={'subCard'}>
                                            <div className={'ti1'}>TIPO CONTRATOS</div>
                                            <SubCardIndicadoresContratos data={d.contratos} parte={1}/>
                                        </div>
                                    </div>
                                    <div className={'col-12 col-lg-3 p-1'}>
                                        <div className={'subCard'}>
                                            <div className={'ti1'}>COMISIONES CONTRATOS</div>
                                            <SubCardIndicadoresContratos data={d.contratos} parte={2}/>
                                        </div>
                                    </div>
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
            {dataNueva.map((data,index) => {
                return(
                    card(data)
                )
            })}
        </div>
    )
}
