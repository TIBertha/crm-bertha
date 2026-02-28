import React from 'react';
import {IMaskInput} from "react-imask";
import DatePicker  from 'react-datepicker';
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function ContratosSearchSideBar({data, handleChange, buscar, limpiar, sideBar, handleOpenSideBar}) {
    return(
        <div onKeyPress={(e) => handleChange(e, "keypress")}>
            <div className={"search-sidebar" + (sideBar === true ? " collapsed" : "")} >
                <div className="slimScrollDivSearch">
                    <div className="nicescroll-bar position-relative">
                        <form method="POST" onSubmit={(e) => buscar(e)}>
                            <div className="panel">

                                <div className="title-area">
                                    <span className="title">
                                        Filtros de búsqueda
                                    </span>
                                    <span>
                                        <a onClick={(e) => handleOpenSideBar(e, false) } className="close-button" >
                                            <i className="fa-solid fa-xmark"></i>
                                        </a>
                                    </span>
                                </div>

                                <hr />

                                <div className="layout-form-search-side">

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Nº Contrato"
                                            name="codigo"
                                            value={data.codigo}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Nombre Empleador"
                                            name="empleador"
                                            value={data.empleador}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <IMaskInput  type="tel" className="form-control form-control-sm"
                                                    placeholder="Teléfono Empleador"
                                                    value={data.telefonoEmpleador}
                                                    onChange={(e) => handleChange(e)}
                                                    name="telefonoEmpleador"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Nombre Trabajador"
                                            name="trabajador"
                                            value={data.trabajador}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <IMaskInput  type="tel" className="form-control form-control-sm"
                                                    placeholder="Teléfono/WhatsApp Trabajador"
                                                    value={data.telefonoTrabajador}
                                                    onChange={(e) => handleChange(e)}
                                                    name="telefonoTrabajador"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Nº Requerimiento"
                                            name="requerimiento"
                                            value={data.requerimiento}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <DatePicker
                                            selected={data.fechainiciolabores}
                                            onChange={(e) => handleChange(e, 'time', 'fechainiciolabores')}
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat="dd/MM/yyyy"
                                            scrollableYearDropdown
                                            locale={es}
                                            dropdownMode="select"
                                            className="form-control form-control-sm"
                                            name="fechainiciolabores"
                                            placeholderText="Fecha Inicio Labores"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <DatePicker
                                            selected={data.fecha}
                                            onChange={(e) => handleChange(e, 'time', 'fecha')}
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat="dd/MM/yyyy"
                                            scrollableYearDropdown
                                            locale={es}
                                            maxDate={new Date() }
                                            dropdownMode="select"
                                            className="form-control form-control-sm"
                                            name="fecha"
                                            placeholderText="Fecha Creado"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <select className="form-control form-control-sm"  name="tipocontrato" value={data.tipocontrato} onChange={(e) => handleChange(e)} >
                                            <option key="0" value="">Seleccione Tipo Contrato</option>
                                            {data.tiposcontratos.map((p, index) => {
                                                return <option key={index} value={p.id} >{ (p.nombre) }</option>
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-12 form-group">
                                        <select className="form-control form-control-sm"  name="vigente" value={data.vigente} onChange={(e) => handleChange(e)} >
                                            <option key="0" value="">Seleccione Vigencia Contrato</option>
                                            <option value="C">CULMINADO</option>
                                            <option value="V">VIGENTE</option>
                                            <option value="A">ANULADO</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="row mt-10">
                                    <div className="col-6">
                                        <button
                                            id="btn-buscar"
                                            className="btn font-weight-bold font btn-sm bertha-pink-button full-size"
                                            type="submit"
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className="btn font-weight-bold font btn-sm bertha-purple-button full-size"
                                            onClick={(e) => limpiar(e)}
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
