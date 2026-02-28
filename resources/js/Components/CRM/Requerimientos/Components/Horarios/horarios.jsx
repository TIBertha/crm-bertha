import React from 'react';
import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import './style.css';
import moment from "moment";
import {isHourIngresoEqualOrGreaterHourSalida} from "../../../../Helpers/helpers.js";

export default function Horarios({data, onChangeHorario, onChange, view}) {

    return (

        <div className="form-group col-12 col-md-7 mt-40 mb-20">

            <div className="row">

                <label className="col-12 col-md-3 col-form-label">{data.modalidad == 1 ? 'Salida y Retorno' : 'Horario Laboral'}</label>

                <div className="col-md-9">

                    {data.modalidad != 1 &&

                        <div className="table-responsive pb-20">

                            <div className="horarios-row">

                                <div className="column-dia font-weight-bold">Día</div>
                                <div className="column-hora font-weight-bold">Hora Inicio</div>
                                <div className="column-hora font-weight-bold">Hora Fin</div>
                                <div className="column-descanso font-weight-bold">Descanso</div>

                            </div>


                            {data.horarios.map((horario, index) => {

                                let horaingreso =  horario.horaingreso ? moment(horario.horaingreso,"YYYY-MM-DD HH:mm:ss ").toDate() : '';
                                let horasalida =  '';

                                let isHourEqualOrGreater = isHourIngresoEqualOrGreaterHourSalida(horario.horaingreso, horario.horasalida);

                                if(isHourEqualOrGreater){
                                    horasalida = horaingreso;
                                }else{
                                    horasalida =  horario.horasalida ? moment(horario.horasalida,"YYYY-MM-DD HH:mm:ss ").toDate() : '';
                                }

                                return (<div className="horarios-row" key={index}>

                                    <div className="column-dia">{horario.dia}</div>

                                    <div className="column-hora">

                                        {horario.isDescanso ?

                                            <input className="form-control form-control-sm" disabled={true} value="-" />

                                            :

                                            <DatePicker
                                                selected={horaingreso}
                                                onChange={(e) => onChangeHorario(e, horario.id, 'horaingreso') }
                                                showTimeSelect
                                                showTimeSelectOnly
                                                className="form-control form-control-sm"
                                                name="horaingreso"
                                                placeholderText="Hora Inicio"
                                                dateFormat="h:mm aa"
                                                timeCaption="Hora"
                                                minTime={setHours(setMinutes(new Date(), 0), 7)}
                                                maxTime={setHours(setMinutes(new Date(), 29), 10)}
                                                autoComplete="off"
                                            />

                                        }

                                    </div>

                                    <div className="column-hora">

                                        {horario.isDescanso ?

                                            <input className="form-control form-control-sm" disabled={true} value="-" />

                                            :

                                            <DatePicker
                                                selected={ (horasalida) }
                                                onChange={(e) => onChangeHorario(e, horario.id, 'horasalida') }
                                                showTimeSelect
                                                showTimeSelectOnly
                                                className="form-control form-control-sm"
                                                name="horasalida"
                                                placeholderText="Hora Fin"
                                                dateFormat="h:mm aa"
                                                timeCaption="Hora"
                                                //minTime={horaingreso ? horaingreso : setHours(setMinutes(new Date(), 0), 6)}
                                                minTime={setHours(setMinutes(new Date(), 0), (data.modalidad == 5 ? 12 : 15))}
                                                maxTime={setHours(setMinutes(new Date(), 29), (data.modalidad == 5 ? 14 : 19))}
                                                autoComplete="off"
                                            />

                                        }

                                    </div>

                                    <div className="column-descanso">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox"
                                                   className="custom-control-input"
                                                   id={'checkbox-' + horario.id}
                                                   checked={horario.isDescanso}
                                                   onChange={(e) => onChangeHorario(e, horario.id, 'isDescanso') }
                                            />
                                            <label className="custom-control-label" htmlFor={'checkbox-' + horario.id}></label>
                                        </div>
                                    </div>

                                </div>)
                            })
                            }

                        </div>

                    }

                    {data.modalidad == 1 &&

                        <div className="table-responsive pb-20">

                            <div className="horarios-row">

                                <div className="column-dia font-weight-bold"></div>
                                <div className="column-hora font-weight-bold">Día</div>
                                <div className="column-hora font-weight-bold">Hora</div>

                            </div>

                            <div className="horarios-row">

                                <div className="column-dia">Salida</div>

                                <div className="column-hora">
                                    <select className="form-control form-control-sm"  name="diasalida" value={data.diasalida} onChange={onChange}>
                                        <option key="0" value="">Ingrese</option>
                                        {data.diassemana.map((p, index) => {
                                            return <option key={index} value={p.id} >{ (p.nombre) }</option>
                                        })}
                                    </select>
                                </div>

                                <div className="column-hora">
                                    <DatePicker
                                        selected={data.horasalida}
                                        onChange={(e) => onChange(e, 'time', 'horasalida') }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        className="form-control form-control-sm"
                                        name="horasalida"
                                        placeholderText="Hora Salida"
                                        dateFormat="h:mm aa"
                                        timeCaption="Hora"
                                        minTime={setHours(setMinutes(new Date(), 0), 6)}
                                        maxTime={setHours(setMinutes(new Date(), 29), 22)}
                                        autoComplete="off"
                                    />
                                </div>

                            </div>

                            <div className="horarios-row">

                                <div className="column-dia">Retorno</div>

                                <div className="column-hora">
                                    <select className="form-control form-control-sm"  name="diaretorno" value={data.diaretorno} onChange={onChange}>
                                        <option key="0" value="">Ingrese</option>
                                        {data.diassemana.map((p, index) => {
                                            return <option key={index} value={p.id} >{ (p.nombre) }</option>
                                        })}
                                    </select>
                                </div>

                                <div className="column-hora">
                                    <DatePicker
                                        selected={data.horaretorno}
                                        onChange={(e) => onChange(e, 'time', 'horaretorno') }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        className="form-control form-control-sm"
                                        name="horaretorno"
                                        placeholderText="Hora Retorno"
                                        dateFormat="h:mm aa"
                                        timeCaption="Hora"
                                        minTime={setHours(setMinutes(new Date(), 0), 6)}
                                        maxTime={setHours(setMinutes(new Date(), 29), 22)}
                                        autoComplete="off"
                                    />
                                </div>

                            </div>

                        </div>

                    }

                </div>

            </div>

        </div>

    );

}
