import React from "react";

export default function VisualizacionesWeb({vistasWeb}) {

    function VisualizacionesCard(data){

        let linkName = '';

        if (data.id == 14){
            linkName = 'TOTAL VISTAS';
        }else if(data.id == 1){
            linkName = 'holabertha.com'
        }else{
            linkName = 'holabertha.com' + data.url_name;
        }

        return(
            <div className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1'}>
                <div className={'indicador-card-style'}>
                    <h5 className="mb-4">{linkName}</h5>

                    <div>
                        <div className="card shadow-lg rounded indicadores">
                            <div className="card-body d-flex justify-content-center text-center">

                                <div>
                                    <div className="indicadores-title-card">{'Visitas'}</div>
                                    <div className={'indicadores-price-card text-pink-bertha'}>{data.num_vistas}</div>
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
            {vistasWeb.map((v,index) => {
                return(
                    VisualizacionesCard(v)
                )
            })}
        </div>
    )
}
