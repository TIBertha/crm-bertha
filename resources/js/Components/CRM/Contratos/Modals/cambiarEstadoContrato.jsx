import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {
    ajaxLoadDataCambioEstados,
    ajaxSaveDataCambiosEstadosContratos,
} from "../../../Functions/Contratos.jsx";

export default function CambiarEstadoContrato({ url, idContrato }) {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1);
    const [show, setShow] = useState(false);
    const [estadoCont, setEstadoCont] = useState("");
    const [estadoPost, setEstadoPost] = useState("");
    const [estadoReq, setEstadoReq] = useState("");
    const [resultIcon, setResultIcon] = useState(
        "fas fa-check-circle text-success",
    );
    const [resultMsj, setResultMsj] = useState(
        "Estados cambiados exitosamente",
    );
    let conf = {
        title: "Cambiar estado de contrato N° " + idContrato,
        icon: "fas fa-exchange-alt",
    };

    function openModal() {
        setShow(true);
        setLoading(true);
        ajaxLoadDataCambioEstados(idContrato)
            .then((r) => {
                if (r.code === 200) {
                    setEstadoCont(r.data.estadoContrato);
                    setEstadoPost(r.data.estadoPost);
                    setEstadoReq(r.data.estadoReq);
                    setView(1);
                    setLoading(false);
                }
            })
            .catch(function (error) {
                setShow(false);
                setLoading(false);
            });
    }

    function saveChanges(e) {
        setLoading(true);
        ajaxSaveDataCambiosEstadosContratos(
            idContrato,
            estadoCont,
            estadoPost,
            estadoReq,
        ).then((r) => {
            if (r.code === 200) {
                setLoading(false);
                setView(2);
                setResultIcon(r.icon);
                setResultMsj(r.msj);
            } else {
                setLoading(false);
                setView(2);
                setResultIcon(r.icon);
                setResultMsj(r.msj);
            }
        });
    }

    function changeEstadoContrato(e) {
        let nuevoEstadoCont = e.target.value;
        setEstadoCont(nuevoEstadoCont);

        if (nuevoEstadoCont == 1) {
            setEstadoPost(1);
            setEstadoReq(1);
        } else if (nuevoEstadoCont == 0) {
            setEstadoPost(2);
            setEstadoReq(2);
        }
    }

    function view1() {
        return (
            <div /*onSubmit={(e) => props.buscar(e)}*/>
                <div className="row mx-0">
                    <div className="col-12 col-md-6">Estado Contrato:</div>
                    <div className={"col-12 col-md-6 form-group"}>
                        <select
                            className="form-control form-control-sm"
                            name="Estado Contrato"
                            value={estadoCont}
                            onChange={(e) => changeEstadoContrato(e)}
                        >
                            <option value="0">VIGENTE</option>
                            <option value="1">CULMINADO</option>
                        </select>
                    </div>
                </div>

                <hr className="my-2 mx-1" />

                <div className="row mx-0">
                    <div className="col-12">Estado Postulante:</div>
                    <div className={"col-12 form-group"}>
                        <select
                            className="form-control form-control-sm"
                            name="Estado Contrato"
                            value={estadoPost}
                            disabled
                        >
                            <option value="1">POR COLOCAR</option>
                            <option value="2">COLOCADO</option>
                            <option value="3">NO DISPONIBLE</option>
                            <option value="4">DE BAJA</option>
                            <option value="5">POR CONTACTAR</option>
                            <option value="6">CONTACTADO</option>
                            <option value="7">POR COMPLETAR</option>
                            <option value="8">POR VERIFICAR</option>
                        </select>
                    </div>
                </div>

                <div className="row mx-0">
                    <div className="col-12">Estado Requerimiento:</div>
                    <div className={"col-12 form-group"}>
                        <select
                            className="form-control form-control-sm"
                            name="Estado Contrato"
                            value={estadoReq}
                            disabled
                        >
                            <option value="1">PENDIENTE</option>
                            <option value="2">ATENDIDO</option>
                            <option value="3">DESISTIDO</option>
                            <option value="4">POR COMPLETAR</option>
                        </select>
                    </div>
                </div>

                <hr className="my-2 mx-1" />

                <div className="row mx-0">
                    <div className={"col-12 form-group text-center"}>
                        <a
                            className="btn btn-lg btn-block btn-green-webexperta text-white"
                            onClick={(e) => saveChanges(e)}
                        >
                            Guardar
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    function viewExito() {
        return (
            <div className={"text-center"}>
                <i className={resultIcon} style={{ fontSize: "35px" }}></i>
                <p className={"py-15 h4"}>{resultMsj}</p>
                <a
                    className="btn bertha-purple-button text-white"
                    href={url + "/contratos"}
                >
                    Ok
                </a>
            </div>
        );
    }

    return (
        <>
            <a role="button" onClick={(e) => openModal()}>
                <i
                    data-toggle="tooltip"
                    data-placement="top"
                    title={conf.title}
                    className={conf.icon + " icon-action px-2"}
                ></i>
            </a>
            <Modal
                size="md"
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
                backdrop="static"
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>
                            <i className={conf.icon + " mr-2"}></i>
                            {conf.title}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    {loading === true ? (
                        <section className="isLoadingArea">
                            <i className="fas fa-sync fa-spin"></i>
                        </section>
                    ) : (
                        <>
                            {view === 1 && view1()}
                            {view === 2 && viewExito()}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
