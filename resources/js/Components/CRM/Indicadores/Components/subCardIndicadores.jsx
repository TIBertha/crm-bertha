import React from "react";

export default function SubCardIndicadores({data}) {
    return(
        <>
            <div className={'py-1'}><span>Registratos (<strong>{data.total}</strong>)</span></div>
            <div className={'py-1'}><span>Con contratos (<strong>{data.totalConContratos}</strong>)</span></div>
            <div className={'py-1'}><span>Sin contratos (<strong>{data.totalSinContratos}</strong>)</span></div>
        </>
    )
}
