import React from "react";
import { IMaskInput } from "react-imask";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

export default function EmpleadoresSearchSideBar({data, sideBar, handleChange, handleOpenSideBar, buscar, limpiar}){
    return (
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
                                            placeholder="Nombre Empleador"
                                            name="empleador"
                                            value={data.empleador}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">

                                        <IMaskInput
                                            type="tel"
                                            className="form-control form-control-sm"
                                            placeholder="Teléfono"
                                            value={data.telefono}
                                            onChange={(e) => handleChange(e)}
                                            name="telefono"
                                        />

                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Documento Empleador"
                                            name="documento"
                                            value={data.documento}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <DatePicker
                                            selected={data.fechaactdesde}
                                            onChange={(e) => handleChange(e, 'time', 'fechaactdesde')}
                                            showMonthDropdown
                                            showYearDropdown
                                            selectsStart
                                            startDate={data.fechaactdesde}
                                            endDate={data.fechaacthasta}
                                            dateFormat="dd/MM/yyyy"
                                            scrollableYearDropdown
                                            locale={es}
                                            dropdownMode="select"
                                            className="form-control form-control-sm"
                                            name="fechaactdesde"
                                            placeholderText="Fecha Actualización Desde"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <DatePicker
                                            selected={data.fechaacthasta}
                                            onChange={(e) => handleChange(e, 'time', 'fechaacthasta')}
                                            selectsEnd
                                            endDate={data.fechaacthasta}
                                            minDate={data.fechaactdesde}
                                            showMonthDropdown
                                            showYearDropdown
                                            maxDate={new Date() }
                                            dateFormat="dd/MM/yyyy"
                                            scrollableYearDropdown
                                            locale={es}
                                            dropdownMode="select"
                                            className="form-control form-control-sm"
                                            name="fechaacthasta"
                                            placeholderText="Fecha Actualización Hasta"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <select className="form-control form-control-sm"  name="estado" value={data.estado} onChange={(e) => handleChange(e)} >
                                            <option key="0" value="">Seleccione Estatus</option>
                                            {data.estados.map((es, index) => {
                                                return <option key={index} value={es.id} >{ (es.nombre) }</option>
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-12 form-group">
                                        <select className="form-control form-control-sm"  name="activo" value={data.activo} onChange={(e) => handleChange(e)} >
                                            <option key="0" value="">Seleccione Estado</option>
                                            <option key="1" value="TRUE" >ACTIVO</option>
                                            <option key="2" value="FALSE" >INACTIVO</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="row mt-10">
                                    <div className="col-6">
                                        <button
                                            id="btn-buscar"
                                            className="btn font-weight-bold font text-white btn-sm bertha-pink-button full-size"
                                            type="submit"
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className="btn font-weight-bold font text-white btn-sm bertha-purple-button full-size"
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
    );
}
