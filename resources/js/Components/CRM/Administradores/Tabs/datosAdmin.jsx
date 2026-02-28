import React from 'react';
import {IMaskInput} from "react-imask";
import es from "date-fns/locale/es";
import DatePicker from "react-datepicker";

import {mayorEdad} from "../../../Helpers/helpers.js";

import fotoExample from "../../../../../../public/img/user_icon.svg";

export default function DatosAdmin({data, view, handleChange}) {

    let sueldoNombre = 'Sueldo (S/.)';

    if (data.rol == 1){
        sueldoNombre = 'Sueldo (S/.)';
    }else if (data.rol == 2){
        sueldoNombre = 'Pago (S/.)';
    }else if (data.rol == 3){
        sueldoNombre = 'Honorarios';
    }else if (data.rol == 4){
        sueldoNombre = 'Sueldo (S/.)';
    }else if (data.rol == 5){
        sueldoNombre = 'Subvención (S/.)';
    }

    return(
        <section className={'row mx-0 pb-4 pt-35'}>
            <div className="form-group col-12">
                <div>
                    <div className="main__block__profile">
                        <img src={data.foto ? data.foto : fotoExample} className="main__block__image avatar" />
                        <i className="icon fas fa-camera"></i>
                    </div>
                    <div className="text-center mb-4">
                        <input type="file" name="foto" id="foto" className="inputfile" accept=".jpg,.png" onChange={(e) => handleChange(e, 'foto', 'foto')} />
                        <label htmlFor="foto">{(data.foto ? 'Actualizar' : 'Subir') + ' foto'}</label>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nombres</label>
                    <div className="col-md-9">
                        <input type="text" className="form-control" id="nombres" name="nombres" value={data.nombres} onChange={handleChange} placeholder="Ingrese los nombres" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Apellidos</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="apellidos" name="apellidos" value={data.apellidos} onChange={handleChange} placeholder="Ingrese los apellidos" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha de nacimiento</label>
                    <div className="col-12 col-md-9">
                        <DatePicker
                            selected={data.fechaNacimiento}
                            onChange={(e) => handleChange(e, 'time', 'fechaNacimiento')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            maxDate={mayorEdad()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechaNacimiento"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">País Nacimiento</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="paisNacimiento" name="paisNacimiento" value={data.paisNacimiento} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.paises.map((p, index) => {
                                return <option key={index} value={p.id} >{ (p.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nacionalidad</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="nacionalidad" name="nacionalidad" value={data.nacionalidad} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.nacionalidades.map((n, index) => {
                                return <option key={index} value={n.id} >{ (n.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo Documento</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="tipoDocumento" name="tipoDocumento" value={data.tipoDocumento} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.tiposDocumento.map((td, index) => {
                                return <option key={index} value={td.id} >{ (td.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Número Documento</label>
                    <div className="col-12 col-md-9">
                        <IMaskInput  type="tel" className="form-control" placeholder="Ingrese número de documento"
                                    value={data.numeroDocumento}
                                    onChange={handleChange}
                                    name="numeroDocumento"
                        />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Correo</label>
                    <div className="col-12 col-md-9">
                        <input type="text" className="form-control" id="correo" name="correo" value={data.correo} onChange={handleChange} placeholder="Ingrese el correo" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
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

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Domicilio</label>
                    <div className="col-md-9">
                        <input type="text" className="form-control" id="domicilio" name="domicilio" value={data.domicilio} onChange={handleChange} placeholder="Ingrese su domicilio" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Ubicación</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="ubicacion" name="ubicacion" value={data.ubicacion} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.ubicaciones.map((u, index) => {
                                return <option key={index} value={u.id} >{ (u.distritostres) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-6">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Cargo</label>
                    <div className="col-12 col-md-9">
                        <select className="form-control" id="cargo" name="cargo" value={data.cargo} onChange={handleChange} >
                            <option key="0" value="">Seleccione</option>
                            {data.cargos.map((c, index) => {
                                return <option key={index} value={c.id} >{ (c.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            {!([2].includes(parseInt(data.rol))) &&
                <div className="form-group col-12 col-md-6">
                    <div className="row">
                        <label className="col-12 col-md-3 col-form-label align-self-center">{sueldoNombre}</label>
                        <div className="col-12 col-md-9">
                            <IMaskInput  type="text" className="form-control" placeholder="Ingrese el sueldo"
                                        value={data.sueldo}
                                        onChange={handleChange}
                                        name="sueldo"
                            />
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}
