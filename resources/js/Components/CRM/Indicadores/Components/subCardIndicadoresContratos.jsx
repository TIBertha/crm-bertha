import React from "react";

export default function SubCardIndicadoresContratos({data, parte}) {
    return(
        <>
            <div className={'py-1'}><span><strong>{'Total (' + data.total + ')'}</strong></span></div>
            {(parte == 1) &&
                <>
                    <div className={'py-1'}><span>Aperturas (<strong>{data.apertura}</strong>)</span></div>
                    <div className={'py-1'}><span>Reposiciones (<strong>{data.reposicion}</strong>)</span></div>
                    <div className={'py-1'}><span>Cambios (<strong>{data.cambio}</strong>)</span></div>
                </>
            }
            {(parte == 2) &&
                <>
                    <div className={'py-1'}><span>Comision 1 (<strong>{data.totalComision1}</strong>)</span></div>
                    <div className={'py-1'}><span>Comision 2 (<strong>{data.totalComision2}</strong>)</span></div>
                    <div className={'py-1'}><span>Comision 3 (<strong>{data.totalComision3}</strong>)</span></div>
                </>
            }
        </>
    )
}
