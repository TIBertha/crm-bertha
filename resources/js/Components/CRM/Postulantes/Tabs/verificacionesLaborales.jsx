import React from "react";
import Select from "react-select";
import Upload from "../../Components/Upload/upload.jsx";
import FileList from "../../Components/FileList/fileList.jsx";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AsyncSelect from "react-select/async";
import {
    GetListAddVerificacion,
    GetSpeechDespedida2,
    getSpeechLlamadaVerificacion,
    GetSpeechVerificacion,
} from "../../../Helpers/strings.js";
import LabelNombre from "../../Components/labelNombre.jsx";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import esp from "react-phone-input-2/lang/es.json";
import Tooltips from "../../Components/tooltips.jsx";
import parse from "html-react-parser";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";

export default function VerificacionesLaborales({
    data,
    loadDistritoOptions,
    handleChange,
    addVerificacion,
    removeVerificacion,
    handleUpload,
    handleDeleteAdjunto,
    handleRenameAdjunto,
}) {
    function verifyStyle($veri, $eje, $call) {
        return {
            color:
                $veri == "si"
                    ? "#4dabf7"
                    : $call == true
                      ? "#f83f37"
                      : $eje
                        ? "#ffc107"
                        : "#000000",
        };
    }

    return (
        <div className="mt-45">
            <LabelNombre
                nombres={data.nombres}
                apellidos={data.apellidos}
                contactname={data.contactname}
                flagemoji={data.flagemoji}
                children={
                    <span className="me-1 tooltips-inside">
                        <NewCopyIcon
                            icon={"fas fa-list-ul"}
                            copyText={GetListAddVerificacion()}
                            tooltipText={
                                "Copiar requisitos - Verificaciones laborales"
                            }
                            successMsj={"Requistos copiados"}
                            additonalClass={"icon-action-sm"}
                        />
                        <i
                            className={
                                "fas fa-volume-up ms-2 icon-question link-tc"
                            }
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Entrar a MP3Cut"
                            onClick={() =>
                                window.open("https://mp3cut.net/es/", "_blank")
                            }
                        ></i>
                        <Tooltips
                            estilo={"tooltip-tc"}
                            placement={"bottom"}
                            text={parse(
                                getSpeechLlamadaVerificacion(
                                    data.nombres,
                                    data.nombreResponsable,
                                ),
                            )}
                        />
                    </span>
                }
            />

            {data.verificaciones.map((verif, key) => (
                <div key={key} className="row row-multiple verificacion-section">
                    <div className="col-12 my-3">
                        <span className="h5">
                            {"Verificación N°" + (key + 1)}
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                style={verifyStyle(
                                    verif.adjuntos.length > 0 ? "si" : "no",
                                    verif.ejecutivo,
                                    verif.llamar,
                                )}
                                title={
                                    verif.adjuntos.length > 0
                                        ? "Verificación Realizada"
                                        : verif.llamar == true
                                          ? "No tiene WhatsApp, se requiere llamar"
                                          : verif.ejecutivo
                                            ? verif.ejecutivo +
                                              " ya solicitó la verificacion"
                                            : "Aún no solicitan la verificación"
                                }
                                className="fas fa-user-check ms-2 icon-action link-tc"
                            ></i>
                        </span>

                        <div className="mt-2">
                            {verif.nombre &&
                                verif.telefono &&
                                verif.distrito &&
                                verif.inicioLabores &&
                                verif.finLabores && (
                                    <>
                                        <NewCopyIcon
                                            icon={"fas fa-mobile-alt"}
                                            additonalClass={
                                                "ms-2 icon-action-sm link-tc"
                                            }
                                            copyText={verif.telefono}
                                            tooltipText={"Copiar teléfono"}
                                            successMsj={"Teléfono copiado"}
                                        />

                                        <NewCopyIcon
                                            icon={"fas fa-id-card"}
                                            additonalClass={
                                                "ms-2 icon-action link-tc"
                                            }
                                            copyText={
                                                "CL " +
                                                verif.nombre +
                                                " " +
                                                (verif.apellidos
                                                    ? verif.apellidos
                                                    : "")
                                            }
                                            tooltipText={"Copiar contacto"}
                                            successMsj={"Contacto copiado"}
                                        />

                                        {verif.adjuntos.length == 0 && (
                                            <span
                                                onClick={(e) =>
                                                    handleChange(
                                                        e,
                                                        "verificacion",
                                                        key,
                                                        "ejecutivo",
                                                    )
                                                }
                                            >
                                                <NewCopyIcon
                                                    icon={"far fa-hand-spock"}
                                                    additonalClass={
                                                        "ms-2 icon-action-sm link-tc"
                                                    }
                                                    copyText={GetSpeechVerificacion(
                                                        verif.nombre,
                                                        data.nombres,
                                                        data.apellidos,
                                                        data.nombreResponsable,
                                                    )}
                                                    tooltipText={
                                                        "Copiar saludo"
                                                    }
                                                    successMsj={
                                                        "Saludo copiado"
                                                    }
                                                />
                                            </span>
                                        )}

                                        {verif.adjuntos.length == 0 && (
                                            <span
                                                onClick={(e) =>
                                                    handleChange(
                                                        e,
                                                        "verificacion",
                                                        key,
                                                        "llamar",
                                                    )
                                                }
                                                className={
                                                    "btn-" +
                                                    (verif.llamar == true
                                                        ? "red"
                                                        : "black") +
                                                    "-verificacion ms-2"
                                                }
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={
                                                    "No tiene WhatsApp, llamar a empleador"
                                                }
                                            >
                                                <i className="fas fa-phone-alt"></i>
                                            </span>
                                        )}

                                        <NewCopyIcon
                                            icon={"far fa-handshake"}
                                            additonalClass={
                                                "ms-2 icon-action-sm link-tc"
                                            }
                                            copyText={GetSpeechDespedida2()}
                                            tooltipText={
                                                "Copiar mensaje de despedida"
                                            }
                                            successMsj={
                                                "Mensaje de despedida copiado"
                                            }
                                            colorNeutro={"unset"}
                                        />
                                    </>
                                )}
                        </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Nombre del Ex empleador
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <input
                                    className="form-control"
                                    name="nombre"
                                    placeholder="Ingrese nombre"
                                    value={verif.nombre}
                                    onChange={(e) =>
                                        handleChange(e, "verificacion", key)
                                    }
                                    type="text"
                                    disabled={Boolean(data.show)}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Apellidos del Ex empleador
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <input
                                    className="form-control"
                                    name="apellidos"
                                    placeholder="Ingrese Apellidos"
                                    value={verif.apellidos}
                                    onChange={(e) =>
                                        handleChange(e, "verificacion", key)
                                    }
                                    type="text"
                                    disabled={Boolean(data.show)}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Teléfono del Ex empleador
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <PhoneInput
                                    placeholder="Ingrese el teléfono"
                                    localization={esp}
                                    country={"pe"}
                                    value={verif.telefono}
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "verificacion",
                                            key,
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
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Lugar de Labores
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <AsyncSelect
                                    loadOptions={loadDistritoOptions}
                                    isClearable
                                    defaultOptions={false}
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "verificacion",
                                            key,
                                            "distrito",
                                        )
                                    }
                                    value={verif.distrito}
                                    placeholder={"Seleccione"}
                                    noOptionsMessage={() => null}
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
                            <label className="col-12 col-md-4 col-form-label">
                                Actividades Realizadas
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <Select
                                    value={verif.actividad}
                                    isMulti={true}
                                    isSearchable
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "verificacion",
                                            key,
                                            "actividad",
                                        )
                                    }
                                    options={
                                        verif.actividad
                                            ? verif.actividad.length >= 3
                                                ? verif.actividad
                                                : data.actividadesverificaciones
                                            : data.actividadesverificaciones
                                    }
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
                            <label className="col-12 col-md-4 col-form-label">
                                Fecha de inicio
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <DatePicker
                                    selected={
                                        verif.inicioLabores
                                            ? moment(
                                                  verif.inicioLabores,
                                                  "YYYY-MM",
                                              ).toDate()
                                            : ""
                                    }
                                    name="inicioLabores"
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "verificacion",
                                            key,
                                            "inicioLabores",
                                        )
                                    }
                                    dateFormat="MM/yyyy"
                                    maxDate={new Date()}
                                    showMonthYearPicker
                                    placeholderText="mes/año"
                                    className="form-control"
                                    autoComplete="off"
                                    locale={es}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Fecha de fin
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <DatePicker
                                    selected={
                                        verif.finLabores
                                            ? moment(
                                                  verif.finLabores,
                                                  "YYYY-MM",
                                              ).toDate()
                                            : ""
                                    }
                                    name="finLabores"
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            "verificacion",
                                            key,
                                            "finLabores",
                                        )
                                    }
                                    dateFormat="MM/yyyy"
                                    minDate={
                                        verif.inicioLabores
                                            ? verif.inicioLabores
                                            : new Date()
                                    }
                                    maxDate={new Date()}
                                    showMonthYearPicker
                                    placeholderText="mes/año"
                                    className="form-control"
                                    autoComplete="off"
                                    locale={es}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Tiempo de Servicio
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <input
                                    className="form-control"
                                    name="tiempo"
                                    placeholder="Ingrese el tiempo"
                                    value={verif.tiempo}
                                    onChange={(e) =>
                                        handleChange(e, "verificacion", key)
                                    }
                                    type="text"
                                    disabled={true}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Motivo Retiro
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <textarea
                                    className="form-control"
                                    name="motivoretiro"
                                    value={verif.motivoretiro}
                                    onChange={(e) =>
                                        handleChange(e, "verificacion", key)
                                    }
                                    placeholder="Ingrese motivo del retiro"
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label">
                                Verificado{" "}
                                {verif.adjuntos.length ? (
                                    <i className="fas fa-check-circle icon-green"></i>
                                ) : (
                                    ""
                                )}
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <select
                                    className="form-control"
                                    name="verificado"
                                    value={verif.adjuntos.length ? "1" : "0"}
                                    onChange={(e) =>
                                        handleChange(e, "verificacion", key)
                                    }
                                    disabled={true}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="1">SI</option>
                                    <option value="0">NO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="col-12">
                            <p className="mb-3 font-weight-bold text-purple">
                                Verificaciones
                            </p>

                            <Upload
                                onUpload={(e) =>
                                    handleUpload(
                                        e,
                                        key,
                                        "verificaciones",
                                        "adjuntosverificaciones",
                                    )
                                }
                            />

                            {verif.adjuntos ? (
                                <FileList
                                    files={
                                        verif.adjuntos.length
                                            ? verif.adjuntos
                                            : []
                                    }
                                    onDelete={(e) =>
                                        handleDeleteAdjunto(
                                            e,
                                            key,
                                            "verificaciones",
                                            "adjuntosverificaciones",
                                        )
                                    }
                                    onChangeName={(e, id) =>
                                        handleRenameAdjunto(
                                            e,
                                            id,
                                            key,
                                            "verificaciones",
                                            "adjuntosverificaciones",
                                        )
                                    }
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    {data.show === false && (
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 text-end">
                            <div
                                className="form-group row add-item me-5 mt-3"
                                onClick={(e) => removeVerificacion(key)}
                            >
                                <i
                                    className="fas fa-trash-alt icon-remove-adjunto"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Eliminar"
                                ></i>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {data.show === false && (
                <div className="form-group row mx-0">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 px-3">
                        <div className="mb-4">
                            <div className="add-item" onClick={addVerificacion}>
                                <i className="fas fa-plus"></i> Adicionar nuevo
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
