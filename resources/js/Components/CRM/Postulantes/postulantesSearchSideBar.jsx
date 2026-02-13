import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { IMaskInput } from "react-imask";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export default function PostulantesSearchSideBar({
    data,
    sideBar,
    handleChange,
    handleOpenSideBar,
    loadDistritoOptions,
    buscar,
    limpiar,
}) {
    return (
        <div onKeyPress={(e) => handleChange(e, "keypress")}>
            <div
                className={
                    "search-sidebar" + (sideBar == true ? " collapsed" : "")
                }
            >
                <div className="slimScrollDivSearch">
                    <div className="nicescroll-bar position-relative">
                        <form method="POST" onSubmit={(e) => buscar(e)}>
                            <div className="panel">
                                <div className="title-area">
                                    <span className="title">
                                        Filtros de búsqueda
                                    </span>
                                    <span>
                                        <a
                                            onClick={(e) =>
                                                handleOpenSideBar(e, false)
                                            }
                                            className="close-button"
                                        >
                                            <i class="fa-solid fa-xmark"></i>
                                        </a>
                                    </span>
                                </div>

                                <hr />

                                <div className="layout-form-search-side">
                                    <div className="col-12 form-group">
                                        <select
                                            className="form-control form-control-sm"
                                            name="paispostulacion"
                                            value={data.paispostulacion}
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option key="0" value="">
                                                Seleccione País postulación
                                            </option>
                                            <option key="1" value={11}>
                                                CHILE
                                            </option>
                                            <option key="2" value={54}>
                                                PERÚ
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="ID Postulante"
                                            name="trabajadorid"
                                            value={data.trabajadorid}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Token Postulante"
                                            name="token"
                                            value={data.token}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Nombre Postulante"
                                            name="nombre"
                                            value={data.nombre}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <select
                                            className="form-control form-control-sm"
                                            name="nacionalidad"
                                            value={data.nacionalidad}
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option key="0" value="">
                                                Seleccione Nacionalidad
                                            </option>
                                            {data.nacionalidades.map(
                                                (n, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={n.id}
                                                        >
                                                            {n.nombre}
                                                        </option>
                                                    );
                                                },
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-12 form-group">
                                        <IMaskInput
                                            type="tel"
                                            className="form-control form-control-sm"
                                            placeholder="Teléfono/WhatsApp"
                                            value={data.telefono}
                                            onChange={(e) => handleChange(e)}
                                            name="telefono"
                                            mask="9999999999999999999999999999999999999999999999"
                                            maskChar=""
                                            maskPlaceholder=""
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <IMaskInput
                                            type="tel"
                                            className="form-control form-control-sm"
                                            placeholder="Teléfono ex empleador"
                                            value={data.telefonorecomendacion}
                                            onChange={(e) => handleChange(e)}
                                            name="telefonorecomendacion"
                                            mask="9999999999999999999999999999999999999999999999"
                                            maskChar=""
                                            maskPlaceholder=""
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <input
                                            className="form-control form-control-sm"
                                            placeholder="Documento Postulante"
                                            name="documento"
                                            value={data.documento}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <Select
                                            value={data.actividad}
                                            isMulti
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    "time",
                                                    "actividad",
                                                )
                                            }
                                            options={data.actividades}
                                            placeholder={"Seleccione Actividad"}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: "black",
                                                },
                                            })}
                                        />
                                    </div>

                                    <div className="col-12 form-group">
                                        <select
                                            className="form-control form-control-sm"
                                            name="modalidad"
                                            value={data.modalidad}
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option key="0" value="">
                                                Seleccione Modalidad
                                            </option>
                                            {data.modalidades.map(
                                                (m, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={m.id}
                                                        >
                                                            {m.nombre}
                                                        </option>
                                                    );
                                                },
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-12 form-group">
                                        <AsyncSelect
                                            loadOptions={loadDistritoOptions}
                                            isClearable
                                            isMulti
                                            noOptionsMessage={() => null}
                                            defaultOptions={false}
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    "time",
                                                    "distrito",
                                                )
                                            }
                                            value={data.distrito}
                                            placeholder={"Distrito (Dirección)"}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: "black",
                                                },
                                            })}
                                        />
                                    </div>

                                    {/*
                                        <div className="col-12 form-group">
                                            <input
                                                className="form-control form-control-sm"
                                                placeholder="Lugar Nacimiento"
                                                name="departamentonac"
                                                value={data.departamentonac}
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </div>
                                    */}

                                    <div className="col-12 form-group">
                                        <select
                                            className="form-control form-control-sm"
                                            name="estado"
                                            value={data.estado}
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option key="0" value="">
                                                Estado
                                            </option>
                                            {data.estados.map((e, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={e.id}
                                                    >
                                                        {e.nombre}
                                                    </option>
                                                );
                                            })}
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
