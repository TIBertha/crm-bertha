import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";
import {
    ajaxGetHistorialBajas,
    ajaxSaveDataBajas,
} from "../../../Functions/Postulantes";
import HistorialBajas from "./Sections/historialBajas";

export default function BajasPostulante({
    url,
    idPostulante,
    nombrePostulante,
    estadoPostulante,
}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [historialBajas, setHistorialBajas] = useState([]);
    const [tiposBajas, setTiposBajas] = useState([]);
    const [baja, setBaja] = useState("");

    let modal = {
        title: "Ver historial de bajas",
        titleModal: "Ver historial de bajas de " + nombrePostulante,
        icon: "fas fa-search",
    };

    function openModal() {
        setShow(true);
        setLoading(true);
        ajaxGetHistorialBajas(idPostulante)
            .then((r) => {
                setLoading(false);
                if (r.code === 200) {
                    setHistorialBajas(r.historialBajas);
                    setTiposBajas(r.tiposBajas);
                }
            })
            .catch(function (error) {
                setShow(false);
            });
    }

    function aplicarSancion(e) {
        setUploading(true);
        ajaxSaveDataBajas(idPostulante, baja)
            .then((r) => {
                setUploading(false);
                if (r.code === 200) {
                    setSuccess(true);
                    ajaxGetHistorialBajas(idPostulante)
                        .then((r) => {
                            setLoading(false);
                            if (r.code === 200) {
                                setHistorialBajas(r.historialBajas);
                            }
                        })
                        .catch(function (error) {
                            setShow(false);
                        });
                } else {
                    setSuccess(false);
                }
            })
            .catch(function (error) {
                setUploading(false);
                setSuccess(false);
            });
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
                            <i className={modal.icon + " mr-2"}></i>
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
                            <h5 className="mt-10">Historial de Bajas</h5>
                            <p className="mt-10 mb-20">
                                Lista de todos los registros de bajas del
                                postulante <b>{nombrePostulante}</b>.
                            </p>

                            {![4].includes(estadoPostulante) ? (
                                <>
                                    <div
                                        className="alert alert-secondary mb-40"
                                        role="alert"
                                    >
                                        <i className="fas fa-info-circle mr-2"></i>{" "}
                                        Seleccione el motivo de baja, guarde y
                                        automaticamente el postulante pasara de
                                        baja el tiempo escogido en el motivo.
                                    </div>

                                    {!success && (
                                        <div className="form-group row mx-0">
                                            <label className="col-3 col-form-label">
                                                Motivo de Baja
                                            </label>
                                            <div className="col-5 col-form-label">
                                                <select
                                                    className="form-control no-box-shadow"
                                                    name="baja"
                                                    value={baja}
                                                    onChange={(e) =>
                                                        setBaja(e.target.value)
                                                    }
                                                >
                                                    <option value="">
                                                        Seleccione
                                                    </option>
                                                    {tiposBajas.map(
                                                        (tipBaj, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        tipBaj.id
                                                                    }
                                                                >
                                                                    {
                                                                        tipBaj.nombre
                                                                    }
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {baja && (
                                        <div className="form-group row mx-0 justify-content-center">
                                            <div
                                                className={
                                                    "col-" +
                                                    (success || uploading
                                                        ? "12"
                                                        : "7") +
                                                    " col-form-label"
                                                }
                                            >
                                                {uploading ? (
                                                    <section className="isLoadingArea">
                                                        <i className="fas fa-sync fa-spin"></i>
                                                    </section>
                                                ) : (
                                                    <>
                                                        {success ? (
                                                            <div
                                                                className="alert alert-success"
                                                                role="alert"
                                                            >
                                                                <div className="mb-2 font-weight-bold">
                                                                    Guardado
                                                                    exitoso
                                                                </div>
                                                                <div>
                                                                    <a
                                                                        className="btn btn-sm btn-pink-webexperta"
                                                                        href={
                                                                            url
                                                                        }
                                                                    >
                                                                        Listo
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <a
                                                                className="btn btn-lg btn-purple-webexperta"
                                                                onClick={(e) =>
                                                                    aplicarSancion(
                                                                        e,
                                                                    )
                                                                }
                                                            >
                                                                Aplicar sanción
                                                            </a>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <hr />
                                </>
                            ) : (
                                <div
                                    className="alert alert-danger mb-40"
                                    role="alert"
                                >
                                    <i className="fas fa-info-circle"></i> El
                                    postulante se encuentra de baja.
                                </div>
                            )}

                            {historialBajas.length > 0 ? (
                                <HistorialBajas
                                    historialbajas={historialBajas}
                                    nombrePostulante={nombrePostulante}
                                />
                            ) : (
                                <div
                                    className="alert alert-secondary"
                                    role="alert"
                                >
                                    La postulante no presenta sanciones previas
                                </div>
                            )}
                        </section>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
