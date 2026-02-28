import React from "react";
import {IMaskInput} from "react-imask";

export default function RangoBusqueda({data, label, handleChange}) {

    let isLessThan20 = ( (data.rangomaximo && data.rangominimo) && ((data.rangomaximo - data.rangominimo) < 20) );

    return(
        <div className={'form-group col-12 col-md-7'}>
            <div className={'row'}>
                <label className="col-12 col-md-3 col-form-label align-self-center">{label}</label>
                <div className="col-md-9">
                    <div className="row">
                        <div className="col-6">
                            <div className="text-left">Mínimo</div>
                            <div>
                                <IMaskInput  type="text"
                                            className={'form-control ' + ( (isLessThan20 == true) ? 'sueldoMenorInput' : '' )}
                                            placeholder="Ingrese edad mínima"
                                            value={data.rangominimo}
                                            onChange={(e) => handleChange(e, 'data.rangominimo', '')}
                                            name="rangominimo"
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="text-left">Máximo</div>
                            <div>
                                <IMaskInput  type="text"
                                            className={'form-control ' + ( (isLessThan20 == true) ? 'sueldoMenorInput' : '' )}
                                            placeholder="Ingrese edad máxima"
                                            value={data.rangomaximo}
                                            onChange={(e) => handleChange(e, 'data.rangomaximo', '')}
                                            name="rangomaximo"
                                />
                            </div>
                        </div>
                        <div className={'col-12 text-left bajorango sueldo-menor'}>
                            {(isLessThan20 == true) && <>El rango debe ser mayor a 20</>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
