import React from "react";
import PhoneInput from "react-phone-input-2";
import Tooltips from "../../Components/tooltips.jsx";
import { mayorEdadFormated } from "../../../Helpers/strings.js";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import es from "react-phone-input-2/lang/es.json";
import CheckBoxModalidad from "../Components/checkBoxModalidad.jsx";

export default function Datos({
    data,
    view,
    loadDistritoOptions,
    handleChange,
    removeContacto,
    cleanModal,
}) {
    let vacunasCovid = [
        { id: 0, nombre: "NO" },
        { id: 1, nombre: "1 DOSIS" },
        { id: 2, nombre: "2 DOSIS" },
        { id: 3, nombre: "3 DOSIS" },
        { id: 4, nombre: "4 DOSIS" },
        { id: 5, nombre: "5 DOSIS" },
    ];

    let tdChileExt = [
        { id: 2, nombre: "PASAPORTE" },
        { id: 4, nombre: "CARNE DE EXTRANJERIA (CE)" },
        { id: 6, nombre: "PARTIDA DE NACIMIENTO" },
        { id: 7, nombre: "PERMISO TEMPORAL DE PERMANENCIA (PTP)" },
        { id: 8, nombre: "CÉDULA DE IDENTIDAD (CI)" },
        { id: 9, nombre: "CARNE PERMISO PERMANENCIA (CPP)" },
        { id: 12, nombre: "CLAVE UNICA DE REGISTRO DE POBLACION" },
    ];

    let tdPeruExt = [
        { id: 4, nombre: "CARNE DE EXTRANJERIA (CE)" },
        { id: 9, nombre: "CARNE PERMISO PERMANENCIA (CPP)" },
        { id: 7, nombre: "PERMISO TEMPORAL DE PERMANENCIA (PTP)" },
    ];

    let tdMexicoExt = [
        { id: 2, nombre: "PASAPORTE" },
        { id: 4, nombre: "CARNE DE EXTRANJERIA (CE)" },
    ];

    let tdPeru = [{ id: 1, nombre: "DOCUMENTO NACIONAL DE IDENTIDAD (DNI)" }];

    let tdChile = [{ id: 10, nombre: "ROL UNICO NACIONAL (RUN)" }];

    let tdMexico = [
        { id: 12, nombre: "CLAVE UNICA DE REGISTRO DE POBLACION (CURP)" },
    ];

    const docsMap = {
        54: { phone: "pe", local: tdPeru, ext: tdPeruExt },
        11: { phone: "cl", local: tdChile, ext: tdChileExt },
        49: { phone: "mx", local: tdMexico, ext: tdMexicoExt },
    };

    const pais = parseInt(data.paisprocedencia);
    const config = docsMap[pais];

    let tiposDocumentos = tdChileExt;
    let countryPhone = "pe";
    const isLocal =
        parseInt(data.paisprocedencia) === parseInt(data.paispostulando);

    if (config) {
        countryPhone = config.phone;
        tiposDocumentos = isLocal ? config.local : config.ext;
    }

    /*if (pais == 54){
        if (pais == 54){
            tiposDocumentos = tdPeru
        }else{
            tiposDocumentos = tdPeruExt
        }
    }else if(pais == 11){
        countryPhone = 'cl';
        if (pais == 11){
            tiposDocumentos = tdChile
        }else{
            tiposDocumentos = tdChileExt
        }
    }else if(pais == 49){
        countryPhone = 'mx';
        if (pais == 49){
            tiposDocumentos = tdMexico
        }else{
            tiposDocumentos = tdMexicoExt
        }
    }else{
        tiposDocumentos = tdChileExt
    }*/

    return (
        <div className="row">
            <div className="col-sm">
                <div className="alert alert-secondary mt-45 mb-40" role="alert">
                    Para postular a una entrevista se debe llamar al postulante
                    y repasar los datos actuales.
                </div>

                <div className="row">
                    <div className={"col-12"}>
                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label font-weight-bold">
                                País donde postula
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="paispostulando"
                                    value={data.paispostulando}
                                    onChange={(e) =>
                                        handleChange(e, "paispostulando")
                                    }
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    <option key="1" value="54">
                                        PERÚ
                                    </option>
                                    <option key="2" value="49">
                                        MÉXICO
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Nombres
                            </label>
                            <div className="col-12 col-lg-7">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombres"
                                    name="nombres"
                                    value={data.nombres}
                                    onChange={handleChange}
                                    placeholder="Ingrese los nombres"
                                    disabled={Boolean(data.show)}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Apellidos
                            </label>
                            <div className="col-12 col-lg-7">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellidos"
                                    name="apellidos"
                                    value={data.apellidos}
                                    onChange={handleChange}
                                    placeholder="Ingrese los apellidos"
                                    disabled={Boolean(data.show)}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Genero
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="genero"
                                    value={data.genero}
                                    onChange={(e) => handleChange(e, "genero")}
                                    disabled={Boolean(data.show)}
                                >
                                    {data.generos.map((g, index) => {
                                        return (
                                            <option key={index} value={g.id}>
                                                {g.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Teléfono
                            </label>
                            <div
                                className="col-12 col-lg-7"
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                    view === "New" &&
                                    data.existDuplicityNumber !== 0
                                        ? data.estatusNumber
                                        : ""
                                }
                            >
                                <div className="row mx-0">
                                    <PhoneInput
                                        placeholder="Ingrese el teléfono"
                                        localization={es}
                                        country={countryPhone}
                                        value={
                                            data.telefono.indexOf(" ") >= 0
                                                ? data.telefono
                                                      .split(" ")
                                                      .join("")
                                                : data.telefono
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                "codigoTelefonico",
                                                "telefono",
                                            )
                                        }
                                        preferredCountries={[
                                            "pe",
                                            "us",
                                            "cl",
                                            "co",
                                            "ve",
                                        ]}
                                        inputClass="w-100 input-countrycode"
                                        enableLongNumbers={true}
                                        containerClass={
                                            view === "New"
                                                ? "px-0 col" +
                                                  (data.telefono.length > 0
                                                      ? " modified-border "
                                                      : "") +
                                                  (data.existDuplicityNumber ===
                                                  1
                                                      ? " red-line "
                                                      : "") +
                                                  (data.existDuplicityNumber ===
                                                  2
                                                      ? " green-line "
                                                      : "")
                                                : ""
                                        }
                                    />

                                    {view === "New" &&
                                        data.telefono.length > 0 && (
                                            <div
                                                className={
                                                    "col-auto verificador-telefono " +
                                                    (data.searchingNumber
                                                        ? "gray-bg-ver"
                                                        : "") +
                                                    (data.existDuplicityNumber ===
                                                    1
                                                        ? "red-line red-bg-ver"
                                                        : "") +
                                                    (data.existDuplicityNumber ===
                                                    2
                                                        ? "green-line green-bg-ver"
                                                        : "")
                                                }
                                            >
                                                <div className="btn px-0">
                                                    {data.searchingNumber ? (
                                                        <i className="fas fa-sync fa-spin"></i>
                                                    ) : (
                                                        <i
                                                            className={
                                                                data.iconEstatusNumber +
                                                                " "
                                                            }
                                                        ></i>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                WhatsApp
                            </label>
                            <div className="col-12 col-lg-7">
                                <PhoneInput
                                    placeholder="Ingrese WhatsApp"
                                    localization={es}
                                    country={countryPhone}
                                    value={
                                        data.telefonowhatsapp.indexOf(" ") >= 0
                                            ? data.telefonowhatsapp
                                                  .split(" ")
                                                  .join("")
                                            : data.telefonowhatsapp
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "codigoTelefonico",
                                            "telefonowhatsapp",
                                        )
                                    }
                                    preferredCountries={[
                                        "pe",
                                        "us",
                                        "cl",
                                        "co",
                                        "ve",
                                    ]}
                                    inputClass="w-100 input-countrycode"
                                    disabled={Boolean(data.show)}
                                    enableLongNumbers={true}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Tipo Documento
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="tipodocumento"
                                    value={data.tipodocumento}
                                    onChange={handleChange}
                                    disabled={
                                        parseInt(pais) === 54
                                            ? true
                                            : Boolean(data.show)
                                    }
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    {tiposDocumentos.map((td, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={td.id}
                                                disabled={
                                                    td.id === 1 &&
                                                    parseInt(pais) !== 54
                                                }
                                            >
                                                {td.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Numero Documento
                            </label>
                            <div
                                className="col-12 col-lg-7"
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                    view === "New" &&
                                    data.existDuplicityNumeroDocumento !== 0
                                        ? data.estatusNumeroDocumento
                                        : ""
                                }
                            >
                                <div className="row mx-0">
                                    <input
                                        type="text"
                                        className="form-control col"
                                        name="numerodocumento"
                                        value={data.numerodocumento}
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                "numeroDocumento",
                                                "numerodocumento",
                                            )
                                        }
                                        placeholder="Ingrese numero documento"
                                        disabled={Boolean(data.show)}
                                        maxLength={18}
                                    />

                                    {data.emptyDocumentoID &&
                                        data.numerodocumento?.length > 0 && (
                                            <div
                                                className={
                                                    "col-auto verificador-telefono " +
                                                    (data.searchingDocumentoID
                                                        ? "gray-bg-ver"
                                                        : "") +
                                                    (data.existDuplicityDocumentoID ===
                                                    1
                                                        ? "red-line red-bg-ver"
                                                        : "") +
                                                    (data.existDuplicityDocumentoID ===
                                                    2
                                                        ? "green-line green-bg-ver"
                                                        : "")
                                                }
                                            >
                                                <div className="btn px-0">
                                                    {data.searchingDocumentoID ? (
                                                        <i className="fas fa-sync fa-spin"></i>
                                                    ) : (
                                                        <i
                                                            className={
                                                                data.iconEstatusDocumentoID +
                                                                " "
                                                            }
                                                        ></i>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        {data.emptyDocumentoID &&
                            data.numerodocumento?.length > 0 && (
                                <div className="form-group row">
                                    <div className="col-12 col-form-label">
                                        {(data.searchingDocumentoID ||
                                            data.estatusDocumentoID) && (
                                            <p className="mt-2">
                                                {data.searchingDocumentoID && (
                                                    <i className="fas fa-sync fa-spin"></i>
                                                )}
                                                {data.estatusDocumentoID && (
                                                    <span>
                                                        {
                                                            data.estatusDocumentoID
                                                        }
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Estado Civil
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="estadocivil"
                                    value={data.estadocivil}
                                    onChange={handleChange}
                                    disabled={Boolean(data.show)}
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    {data.estadosciviles.map((ec, index) => {
                                        return (
                                            <option key={index} value={ec.id}>
                                                {ec.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Fecha Nacimiento{" "}
                                <Tooltips
                                    estilo={"tooltip-tc ms-2"}
                                    placement={"bottom"}
                                    text={
                                        "El trabajador no puede tener menos de 15 años"
                                    }
                                />
                            </label>
                            <div className="col-12 col-lg-7">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fechanacimiento"
                                    value={data.fechanacimiento}
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "time",
                                            "fechanacimiento",
                                        )
                                    }
                                    placeholder="dd/mm/aaaa"
                                    aria-describedby="date-format"
                                    max={mayorEdadFormated()}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Edad
                            </label>
                            <div className="col-12 col-lg-7">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="edad"
                                    value={data.edad}
                                    onChange={handleChange}
                                    placeholder=""
                                    disabled={true}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Tiene Vacuna COVID
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="tienevacuna"
                                    value={data.tienevacuna}
                                    onChange={(e) =>
                                        handleChange(e, "tienevacuna")
                                    }
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    {vacunasCovid.map((vC, index) => {
                                        return (
                                            <option
                                                key={index + 1}
                                                value={vC.id}
                                            >
                                                {vC.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Idioma
                            </label>
                            <div className="col-12 col-lg-7">
                                <Select
                                    value={data.idioma}
                                    isDisabled={Boolean(data.show)}
                                    isMulti
                                    isSearchable
                                    onChange={(e) =>
                                        handleChange(e, "evento", "idioma")
                                    }
                                    options={data.idiomas}
                                    placeholder={"Seleccionar idioma(s)"}
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
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Nº de Hijos
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="numhijos"
                                    value={data.numhijos}
                                    onChange={handleChange}
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    {data.cantidades.map((number, index) => {
                                        return (
                                            <option key={index} value={number}>
                                                {number}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {data.numhijos > 0 && (
                            <div className="form-group row">
                                <label className="col-12 col-lg-4 col-form-label">
                                    Edad de Hijos
                                </label>
                                <div className="col-12 col-lg-7">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="edadhijos"
                                        value={data.edadhijos}
                                        onChange={handleChange}
                                        placeholder="Edades de hijos"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                País de Nacimiento
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="paisprocedencia"
                                    value={data.paisprocedencia}
                                    onChange={(e) => handleChange(e, "pais")}
                                    disabled={Boolean(data.show)}
                                >
                                    <option key="0" value="">
                                        Seleccione
                                    </option>
                                    {data.paises.map((p, index) => {
                                        return (
                                            <option key={index} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                {[49].includes(pais)
                                    ? "Estado de Nacimiento"
                                    : "Lugar Nacimiento"}
                            </label>
                            <div className="col-12 col-lg-7">
                                {[
                                    4, 7, 8, 11, 13, 18, 22, 49, 53, 54, 67, 68,
                                ].includes(pais) ? (
                                    <select
                                        className="form-control"
                                        name="departamentonacimiento"
                                        value={data.departamentonacimiento}
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                "departamentonacimiento",
                                            )
                                        }
                                        disabled={Boolean(data.show)}
                                    >
                                        <option key="0" value="">
                                            Seleccione
                                        </option>
                                        {data.departamentosnacimiento.map(
                                            (dn, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={dn.id}
                                                    >
                                                        {dn.nombre}
                                                    </option>
                                                );
                                            },
                                        )}
                                    </select>
                                ) : (
                                    <div className="row mx-0">
                                        <div className="col px-0">
                                            <select
                                                className="form-control"
                                                name="departamentonacimiento"
                                                value={
                                                    data.departamentonacimiento
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        e,
                                                        "departamentonacimiento",
                                                    )
                                                }
                                            >
                                                <option key="0" value="">
                                                    Seleccione
                                                </option>
                                                {data.departamentosnacimiento.map(
                                                    (dn, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={dn.id}
                                                            >
                                                                {dn.nombre}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Lugar donde vive
                            </label>
                            <div className="col-12 col-lg-7">
                                <AsyncSelect
                                    loadOptions={loadDistritoOptions}
                                    isClearable
                                    noOptionsMessage={() => null}
                                    defaultOptions={false}
                                    onChange={(e) =>
                                        handleChange(e, "distrito")
                                    }
                                    value={data.distrito}
                                    placeholder={"Seleccione"}
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
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                <>Dirección donde vive</>
                            </label>
                            <div className="col-12 col-lg-7">
                                <textarea
                                    className="form-control"
                                    name="direccion"
                                    value={data.direccion}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Ingrese dirección"
                                    disabled={Boolean(data.show)}
                                />
                            </div>
                        </div>

                        <div className={"form-group row"}>
                            <div className={"col-12 col-form-label label-esquema-direccion"}>
                                <div>
                                    Tipo (Calle, Avenida (Av), Jirón (Jr)) +
                                    Nombre + Número + Distrito{" "}
                                    <strong>(O)</strong>
                                </div>
                                <div>
                                    Mz + Lote + (Asentamiento Humano (AAHH),
                                    Asociación (Asoc), Cooperativa (Coop),
                                    Urbanización (Urb)) + Referencia + Distrito
                                </div>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Actividad
                            </label>
                            <div className="col-12 col-lg-7">
                                <Select
                                    value={data.actividad}
                                    //isDisabled={data.show == true ? true : false }
                                    isDisabled={Boolean(data.show)}
                                    isMulti
                                    isSearchable
                                    onChange={(e) =>
                                        handleChange(e, "evento", "actividad")
                                    }
                                    options={data.actividades}
                                    placeholder={"Seleccione"}
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
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label">
                                Modalidad
                            </label>
                            <div className="col-12 col-lg-7">
                                <ul className="tipos-modalidades">
                                    {data.modalidad.map((m) => {
                                        return (
                                            <CheckBoxModalidad
                                                handleChange={handleChange}
                                                pais={data.paispostulando}
                                                m={m}
                                            />
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-lg-4 col-form-label font-weight-bold">
                                Mascotas
                            </label>
                            <div className="col-12 col-lg-7">
                                <select
                                    className="form-control"
                                    name="aceptamascotas"
                                    value={data.aceptamascotas}
                                    onChange={(e) =>
                                        handleChange(e, "aceptamascotas")
                                    }
                                >
                                    <option key="0" value={0}>
                                        NO ACEPTA
                                    </option>
                                    <option key="1" value={1}>
                                        SI ACEPTA
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />
            </div>
        </div>
    );
}
