import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";
import {
    ajaxGetDataFaltantePostulante,
    ajaxSaveDataFaltantePostulante,
} from "../../../Functions/Postulantes";

export default function DataRestantePostulante({
    url,
    idPostulante,
    nombrePostulante,
}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState([]);
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [paisNacimiento, setPaisNacimiento] = useState("");
    const [paisPostulacion, setPaisPostulacion] = useState("");
    const [tiposDocumento, setTiposDocumentos] = useState([]);
    const [paises, setPaises] = useState([]);
    let modal = {
        title: "Data faltante de Postulante",
        titleModal: "Ver data faltante de " + nombrePostulante,
        icon: "fas fa-id-card",
    };

    let tdChileExt = [
        { id: 2, nombre: "PASAPORTE" },
        { id: 10, nombre: "ROL UNICO NACIONAL (RUN)" },
        { id: 11, nombre: "ROL UNICO TRIBUTARIO (RUT)" },
    ];

    let tdPeruExt = [
        { id: 4, nombre: "CARNE DE EXTRANJERIA (CE)" },
        { id: 9, nombre: "CARNE PERMISO PERMANENCIA (CPP)" },
        { id: 7, nombre: "PERMISO TEMPORAL DE PERMANENCIA (PTP)" },
    ];

    let tdPeru = [{ id: 1, nombre: "DOCUMENTO NACIONAL DE IDENTIDAD (DNI)" }];

    let tdChile = [{ id: 10, nombre: "ROL UNICO NACIONAL (RUN)" }];

    let td = [
        { id: 1, nombre: "DOCUMENTO NACIONAL DE IDENTIDAD (DNI)" },
        { id: 2, nombre: "PASAPORTE" },
        { id: 10, nombre: "ROL UNICO NACIONAL (RUN)" },
        { id: 11, nombre: "ROL UNICO TRIBUTARIO (RUT)" },
        { id: 4, nombre: "CARNE DE EXTRANJERIA (CE)" },
        { id: 9, nombre: "CARNE PERMISO PERMANENCIA (CPP)" },
        { id: 7, nombre: "PERMISO TEMPORAL DE PERMANENCIA (PTP)" },
    ];

    function setNewTiposDocumentos(inputPaisNacimiento, inputPaisPostulacion) {
        if (inputPaisNacimiento && inputPaisPostulacion) {
            if (inputPaisNacimiento == 54) {
                if (inputPaisPostulacion == 54) {
                    setTiposDocumentos(tdPeru);
                    setTipoDocumento(1);
                } else {
                    setTiposDocumentos(tdPeruExt);
                    setTipoDocumento("");
                }
            } else if (inputPaisNacimiento == 11) {
                if (inputPaisPostulacion == 11) {
                    setTiposDocumentos(tdChile);
                    setTipoDocumento(10);
                } else {
                    setTiposDocumentos(tdChileExt);
                    setTipoDocumento("");
                }
            } else {
                setTiposDocumentos(td);
            }
        } else {
            setTiposDocumentos(td);
        }
    }

    function save() {
        setLoading(true);
        ajaxSaveDataFaltantePostulante(
            idPostulante,
            paisNacimiento,
            paisPostulacion,
            tipoDocumento,
            numeroDocumento,
        )
            .then((r) => {
                setLoading(false);
                if (r.code === 200) {
                    setSuccess(true);
                }
            })
            .catch(function (error) {
                setShow(false);
            });
    }

    function openModal() {
        setShow(true);
        setLoading(true);
        ajaxGetDataFaltantePostulante(idPostulante)
            .then((r) => {
                setLoading(false);
                if (r.code === 200) {
                    setData(r.data);
                    setNumeroDocumento(r.data.numeroDocumento);
                    setTipoDocumento(r.data.tipoDocumento);
                    setPaisNacimiento(r.data.paisNacimiento);
                    setPaisPostulacion(r.data.paisPostulacion);
                    setTiposDocumentos(r.tiposDocumentos);
                    setPaises(r.paises);
                }
            })
            .catch(function (error) {
                setShow(false);
            });
    }

    function handleChange(e, campo) {
        let value = e.target.value;
        if (campo == "tipoDocumento") {
            setTipoDocumento(value);
        } else if (campo == "numeroDocumento") {
            setNumeroDocumento(value);
        } else if (campo == "paisNacimiento") {
            setPaisNacimiento(value);
            setNewTiposDocumentos(value, paisPostulacion);
        } else if (campo == "paisPostulacion") {
            setPaisPostulacion(value);
            setNewTiposDocumentos(paisNacimiento, value);
        }
    }

    return (
        <>
            <a onClick={(e) => openModal()}>
                <i
                    data-toggle="tooltip"
                    data-placement="top"
                    title={modal.title}
                    className={modal.icon + " icon-action px-2"}
                ></i>
            </a>

            <Modal
                size="xl"
                scrollable={false}
                backdrop="static"
                keyboard={false}
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
            >
                <ModalHeader
                    className="border-0 pb-0"
                    closeButton={success ? false : true}
                >
                    <ModalTitle>
                        <h6>
                            <i className={modal.icon + " me-2"}></i>
                            {modal.titleModal}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-3">
                    {loading ? (
                        <section className="isLoadingArea">
                            <i className="fas fa-sync fa-spin"></i>
                        </section>
                    ) : (
                        <section className={"mx-3"}>
                            {success == true ? (
                                <div>
                                    <div className="mb-2 font-weight-bold">
                                        Guardado exitoso
                                    </div>
                                    <div>
                                        <a
                                            className="btn btn-sm bertha-pink-button"
                                            href={url}
                                        >
                                            Listo
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <section
                                    className={"row justify-content-center"}
                                >
                                    <div className={"form-group col-12"}>
                                        <div className={"row"}>
                                            <label className="col-12  col-form-label align-self-center">
                                                País Nacimiento
                                            </label>
                                            <div className="col-12">
                                                <select
                                                    className="form-control"
                                                    id="paisNacimiento"
                                                    name="paisNacimiento"
                                                    value={paisNacimiento}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "paisNacimiento",
                                                        )
                                                    }
                                                    disabled={
                                                        data.paisNacimiento
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <option
                                                        key="0"
                                                        value=""
                                                        disabled
                                                    >
                                                        Seleccione
                                                    </option>
                                                    {paises.map((p, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={p.id}
                                                            >
                                                                {p.nombre}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"form-group col-12"}>
                                        <div className={"row"}>
                                            <label className="col-12  col-form-label align-self-center">
                                                País Postulacion
                                            </label>
                                            <div className="col-12">
                                                <select
                                                    className="form-control"
                                                    id="paisPostulacion"
                                                    name="paisPostulacion"
                                                    value={paisPostulacion}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "paisPostulacion",
                                                        )
                                                    }
                                                    disabled={
                                                        data.paisPostulacion
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <option
                                                        key="0"
                                                        value=""
                                                        disabled
                                                    >
                                                        Seleccione
                                                    </option>
                                                    <option key="1" value={11}>
                                                        CHILE
                                                    </option>
                                                    <option key="2" value={54}>
                                                        PERÚ
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"form-group col-12"}>
                                        <div className={"row"}>
                                            <label className="col-12  col-form-label align-self-center">
                                                Tipo Documento
                                            </label>
                                            <div className="col-12">
                                                <select
                                                    className="form-control"
                                                    id="tipoDocumento"
                                                    name="tipoDocumento"
                                                    value={tipoDocumento}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "tipoDocumento",
                                                        )
                                                    }
                                                    disabled={
                                                        data.tipoDocumento
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <option
                                                        key="0"
                                                        value=""
                                                        disabled
                                                    >
                                                        Seleccione
                                                    </option>
                                                    {tiposDocumento.map(
                                                        (td, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        td.id
                                                                    }
                                                                >
                                                                    {td.nombre}
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"form-group col-12"}>
                                        <div className={"row"}>
                                            <label className="col-12  col-form-label align-self-center">
                                                Número Documento
                                            </label>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name={"numeroDocumento"}
                                                    value={numeroDocumento}
                                                    className={"form-control"}
                                                    placeholder={
                                                        "Ingrese el número de documento"
                                                    }
                                                    maxLength={15}
                                                    disabled={
                                                        data.numeroDocumento
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "numeroDocumento",
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"form-group col-12"}>
                                        <a
                                            className="btn btn-lg btn-block bertha-purple-button"
                                            onClick={(e) => save(e)}
                                        >
                                            Guardar
                                        </a>
                                    </div>
                                </section>
                            )}
                        </section>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
