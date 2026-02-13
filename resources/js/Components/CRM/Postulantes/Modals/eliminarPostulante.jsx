import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";
import Select from "react-select";
import {
    ajaxBuscarVinculosPostulante,
    ajaxEliminarDataPostulante,
    ajaxTransferirDataPostulante,
} from "../../../Functions/Postulantes";

export default function EliminarPostulante({
    idPostulante,
    nombrePostulante,
    handleRefresh,
    url,
}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [noData, setNoData] = useState(false);
    const [view, setView] = useState(1);
    const [msj, setMsj] = useState("");
    const [listPost, setListPost] = useState([]);
    const [postSelected, setPostSelected] = useState(null);
    const [vinculos, setVinculos] = useState(null);

    let modal = {
        title:
            "Eliminar postulante " +
            nombrePostulante +
            " (ID: " +
            idPostulante +
            ")",
        icon: "fas fa-times icon-action",
    };

    function setNullData() {
        setView(2);
        setMsj(nombrePostulante + " no tiene data registrada.");
        setNoData(true);
    }

    function openModal() {
        setShow(true);
        setLoading(true);
        ajaxBuscarVinculosPostulante(idPostulante)
            .then((r) => {
                if (r.code === 200) {
                    setLoading(false);
                    setListPost(r.listPost);
                    setVinculos(r.data ? r.data : setNullData());
                    setDeleted(true);
                }
            })
            .catch(function (error) {});
    }

    function closeModal() {
        setMsj("");
        setView(1);
        setShow(false);
        setDeleted(false);
    }

    function transferirData(e) {
        setLoading(true);
        ajaxTransferirDataPostulante(idPostulante, postSelected)
            .then((r) => {
                if (r.code === 200) {
                    setLoading(false);
                    setView(2);
                    setMsj(r.msj);
                    setDeleted(true);
                }
            })
            .catch(function (error) {
                setLoading(false);
                setMsj(r.msj);
            });
    }

    function eliminarData(e) {
        setLoading(true);
        ajaxEliminarDataPostulante(idPostulante)
            .then((r) => {
                if (r.code === 200) {
                    setLoading(false);
                    setView(2);
                    setMsj(r.msj);
                    setDeleted(true);
                }
            })
            .catch(function (error) {
                setLoading(false);
                setMsj(r.msj);
            });
    }

    function view1() {
        return (
            <>
                {vinculos && (
                    <div className={"py-1"}>
                        <h5>
                            {"Se encontraron " + vinculos.total + " registros:"}
                        </h5>
                        <div className={"pt-3 pl-2"}>
                            {vinculos.antecedentes != 0 ? (
                                <p>
                                    {"- "}
                                    <strong>{vinculos.antecedentes}</strong>
                                    {" antecedente(s)."}
                                </p>
                            ) : null}
                            {vinculos.antecedentesTemporales != 0 ? (
                                <p>
                                    {"- "}
                                    <strong>
                                        {vinculos.antecedentesTemporales}
                                    </strong>
                                    {" antecedente(s) temporal(es)."}
                                </p>
                            ) : null}
                            {vinculos.contratos != 0 ? (
                                <p>
                                    {"- "}
                                    <strong>{vinculos.contratos}</strong>
                                    {" contrato(s)."}
                                </p>
                            ) : null}
                            {vinculos.estatus != 0 ? (
                                <p>
                                    {"- "}
                                    <strong>{vinculos.estatus}</strong>
                                    {" cambio(s) de estado(s)."}
                                </p>
                            ) : null}
                            {vinculos.postulaciones != 0 ? (
                                <strong>
                                    {"- "}
                                    <b>{vinculos.postulaciones}</b>
                                    {" postulaciones."}
                                </strong>
                            ) : null}
                            {vinculos.sanciones != 0 ? (
                                <p>
                                    {"- "}
                                    <strong>{vinculos.sanciones}</strong>
                                    {" sancion(es)."}
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}

                <div className={"p-2"}>
                    <hr className={"m-0"} />
                </div>

                <div>
                    <h6>Transferir data a nuevo registro:</h6>
                    <div className={"mt-2"}>
                        <Select
                            value={postSelected}
                            isMulti={false}
                            isSearchable
                            onChange={(e) => setPostSelected(e)}
                            options={listPost}
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
                    {postSelected && (
                        <div className={"py-2"}>
                            <div className={""}>
                                <hr className={"m-0"} />
                                <div className={"p-2"}>
                                    <div className={"row mx-0"}>
                                        <div
                                            className={
                                                "col-2 px-1 align-self-center"
                                            }
                                        >
                                            {postSelected.id}
                                        </div>
                                        <div
                                            className={
                                                "col-6 px-1 align-self-center"
                                            }
                                        >
                                            {postSelected.name}
                                        </div>
                                        <div
                                            className={"col-4 px-1 text-center"}
                                        >
                                            <img
                                                className={"img-post"}
                                                src={
                                                    postSelected.photo
                                                        ? postSelected.photo
                                                        : fotoExample
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className={"m-0"} />
                            </div>
                            <div className={"pt-2"}>
                                <a
                                    className={
                                        "btn btn-sm btn-block btn-green font-weight-700"
                                    }
                                    onClick={(e) => transferirData(e)}
                                >
                                    Transferir a nuevo registro
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {!postSelected && (
                    <>
                        <div className={"p-2"}>
                            <hr className={"m-0"} />
                        </div>
                        <div className={"py-1"}>
                            <h6>
                                Si no quiere transferir la data, puede
                                eliminarla:
                            </h6>
                            <div className={"pt-2"}>
                                <a
                                    className={
                                        "btn btn-red btn-sm btn-block font-weight-700"
                                    }
                                    onClick={(e) => eliminarData(e)}
                                >
                                    Eliminar Postulante
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </>
        );
    }

    function view2() {
        return (
            <div className={"text-center"}>
                <div className={"py-1"}>
                    <h5>{msj}</h5>
                </div>
                {noData == true && (
                    <a
                        className={
                            "btn btn-red btn-sm btn-block font-weight-700 my-2"
                        }
                        onClick={(e) => eliminarData(e)}
                    >
                        Eliminar Postulante
                    </a>
                )}
                {deleted == true && noData == false && (
                    <a
                        className={
                            "btn btn-sm btn-block btn-purple-webexperta font-weight-700 my-2"
                        }
                        href={url + "/postulantes"}
                    >
                        Cerrar
                    </a>
                )}
            </div>
        );
    }

    return (
        <>
            <a onClick={(e) => openModal()}>
                <i
                    data-toggle="tooltip"
                    data-placement="top"
                    title={modal.title}
                    className={modal.icon + " icon-action text-red px-2"}
                ></i>
            </a>

            <Modal
                size="xl"
                scrollable={false}
                backdrop="static"
                keyboard={false}
                show={show}
                onHide={(e) => closeModal()}
                centered={true}
            >
                <ModalHeader
                    className="border-0 pb-0"
                    closeButton={loading == true ? false : true}
                >
                    <ModalTitle>
                        <h6>
                            <i className={modal.icon + " mr-2"}></i>
                            {modal.title}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-3">
                    {loading == true && (
                        <>
                            <section className="isLoadingArea">
                                <i className="fas fa-sync fa-spin"></i>
                            </section>
                        </>
                    )}
                    {loading == false && (
                        <>
                            {view == 1 && view1()}
                            {view == 2 && view2()}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
