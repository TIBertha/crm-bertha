import React from "react";
import moment from "moment";

export default function DetallesRequerimiento({data}) {
    return(
        <section>

            <>
                {data.paisPedido ? <p>{data.paisPedido}</p> : ''}
                {data.empleador ? <p>{data.empleador}</p> : ''}
                {data.actividad ? <p>{data.actividad}</p> : ''}
                {data.modalidad ? <p>{data.modalidad}</p> : ''}
                {data.nacionalidad ? <p>{data.nacionalidad}</p> : ''}
                {data.rangoedad ? <p>{data.rangoedad}</p> : ''}

                {([3].includes(parseInt(data.modalidadId))) &&
                    <>{data.sueldoPD ? <p>{data.sueldoPD}</p> : ''}</>
                }

                {data.sueldo ? <p>{data.sueldo}</p> : ''}
                {data.tipovivienda ? <p>{data.tipovivienda}</p> : ''}
                {data.numpisos ? <p>{data.numpisos}</p> : ''}
                {data.numpacientes ? <p>{data.numpacientes}</p> : ''}
                {data.edadpacientes ? <p>{data.edadpacientes}</p> : ''}
                {data.diagnostico ? <p>{data.diagnostico}</p> : ''}
                {data.numadultos ? <p>{data.numadultos}</p> : ''}
                {data.numninos ? <p>{data.numninos}</p> : ''}
                {data.edadninos ? <p>{data.edadninos}</p> : ''}
                {data.numbebes ? <p>{data.numbebes}</p> : ''}
                {data.edadbebes ? <p>{data.edadbebes}</p> : ''}
                {data.nummascotas ? <p>{data.nummascotas}</p> : ''}
                {data.distrito ? <p>{data.distrito}</p> : ''}
                {data.tipodescanso ? <p>{data.tipodescanso}</p> : ''}
            </>

            {([1].includes(parseInt(data.modalidadId))) &&
                <>
                    {data.diasalida ? <p>{data.diasalida}</p> : ''}
                    {data.horasalida ? <p>{data.horasalida}</p> : ''}
                    {data.diaretorno ? <p>{data.diaretorno}</p> : ''}
                    {data.horaretorno ? <p>{data.horaretorno}</p> : ''}
                </>
            }

            {([2,3,5].includes(parseInt(data.modalidadId))) &&
                <>
                    {data.horarios ?
                        <div>
                            <p>Horario:</p>
                            <div className="ml-3">
                                {data.horarios.map((d,index) => {
                                    return(
                                        <>
                                            {(d.isDescanso == false) &&
                                                <p>{d.dia + ': ' + ( moment(d.horaingreso, "YYYY-MM-DD HH:mm:ss").format('h:mm a') ) + ' - ' + ( moment(d.horasalida, "YYYY-MM-DD HH:mm:ss").format('h:mm a') )}</p>
                                            }
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        : ''}
                </>
            }

            {([3].includes(parseInt(data.modalidadId))) &&
                <>
                    {data.frecuencia ? <p>{data.frecuencia}</p> : ''}
                </>
            }

            {data.tipobeneficio ? <p>{data.tipobeneficio}</p> : ''}
            {data.inicioLabores ? <p>{data.inicioLabores}</p> : ''}
            {/*data.observaciones ? <p>{data.observaciones}</p> : ''*/}

        </section>
    );
}
