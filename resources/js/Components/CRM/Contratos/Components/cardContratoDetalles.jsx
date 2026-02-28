import React from 'react';

export default function CardContratoDetalles({data, actual}) {
    return (
        <div className="card-contrato-historial">
            <div className={'card shadow-lg rounded ' + (actual ? 'border-purple-card-select' : '')}>
                <div className="card-body">
                    <a target="_blank" href={'/contratos/impresion/' + data.id}>{data.id}</a> - {data.fecha} - <a target="_blank" href={'/postulantes/ficha-postulante/' + data.trabajadorid} >{data.trabajador}</a> - <a href={'tel:'+data.trabajadortelefono}>{data.trabajadortelefono}</a> -  {data.tipocontrato} - {data.codigo_iso_divisa} {(data.sueldo)}
                </div>
            </div>
        </div>
    );
}
