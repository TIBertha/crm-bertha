import React from 'react';
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import {IMaskInput} from "react-imask";

export default function DatosReclamos({data, handleChange}) {
    return(
        <section className="row mx-0 pb-4 pt-35">

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nombres</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="nombres" name="nombres" value={data.nombres} onChange={handleChange} placeholder="Ingrese los nombres" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Apellidos</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="apellidos" name="apellidos" value={data.apellidos} onChange={handleChange} placeholder="Ingrese los apellidos" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">DNI</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="dni" name="dni" value={data.dni} onChange={handleChange} placeholder="Ingrese DNI" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Domicilio</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="domicilio" name="domicilio" value={data.domicilio} onChange={handleChange} placeholder="Ingrese el domicilio" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Correo</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="correo" name="correo" value={data.correo} onChange={handleChange} placeholder="Ingrese el correo" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Teléfono</label>
                    <div className="col-12 col-md-9">
                        <IMaskInput  type="tel" className="form-control" placeholder="Ingrese el teléfono"
                                    value={data.telefono}
                                    onChange={handleChange}
                                    name="telefono"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nombre Apoderado</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="nombreapoderado" name="nombreapoderado" value={data.nombreapoderado} onChange={handleChange} placeholder="Nombres y apellidos de la madre o padre (En caso ser menor de edad)" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Bien contratado</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="tipobien" name="tipobien" value={data.tipobien} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.tiposbienes.map((tb, index) => {
                                return <option key={index} value={tb.id} >{ (tb.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo de reclamo</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="tiporeclamo" name="tiporeclamo" value={data.tiporeclamo} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.tiposreclamos.map((tc, index) => {
                                return <option key={index} value={tc.id} >{ (tc.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha incidente</label>
                    <div className="col-12 col-md-9">
                        <DatePicker
                            selected={data.fechaincidente}
                            onChange={(e) => handleChange(e, 'fi')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            maxDate={new Date() }
                            dropdownMode="select"
                            className="form-control"
                            name="fechaincidente"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Lugar incidente</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="lugarincidente" name="lugarincidente" value={data.lugarincidente} onChange={handleChange} placeholder="Ingrese el lugar del incidente" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Detalle</label>
                    <div className="col-12 col-md-9">
                        <textarea className="form-control" rows={5} id="detalle" name="detalle" value={data.detalle} onChange={(e) => handleChange(e, 'detalle')} placeholder="Detalle" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Pedido</label>
                    <div className="col-12 col-md-9">
                        <textarea className="form-control" rows={5} id="pedido" name="pedido" value={data.pedido} onChange={(e) => handleChange(e, 'pedido')} placeholder="Pedido" />
                    </div>
                </div>
            </div>

        </section>
    )
}
