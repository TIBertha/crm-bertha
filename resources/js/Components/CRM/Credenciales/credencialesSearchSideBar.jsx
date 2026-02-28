import React from 'react';
import "react-datepicker/dist/react-datepicker.css";

export default function redencialesSearchSide({data, sideBar, handleOpenSideBar, handleChange, buscar, limpiarBusqueda}) {
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
                                            placeholder="Nombre de plataforma"
                                            name="nombrePlataforma"
                                            value={data.nombrePlataforma}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <select className="form-control form-control-sm"  name="nivelCredencial" value={data.nivelCredencial} onChange={(e) => handleChange(e)} >
                                            <option key="0" value="">Seleccione Estado</option>
                                            <option key="1" value="1">Todos</option>
                                            <option key="2" value="2">Restringido</option>
                                        </select>
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-6">
                                            <button id="btn-buscar" className="btn btn-purple-webexperta btn-block btn-sm btn-reset"  type="submit" >Buscar</button>
                                        </div>
                                        <div className="col-6">
                                            <button className="btn btn-pink-webexperta btn-block btn-sm btn-reset" onClick={(e) => limpiarBusqueda(e)}>Limpiar</button>
                                        </div>
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
    )
}
