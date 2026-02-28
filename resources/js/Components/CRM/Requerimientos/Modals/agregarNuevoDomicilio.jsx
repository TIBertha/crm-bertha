import React from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";
import Tooltips from "../../Components/tooltips.jsx";
import FormularioAgregarDomicilioReq from "../Components/AgregarDomicilio/formularioAgregarDomicilioReq.jsx";

export default function AgregarNuevoDomicilio({
    view,
    save,
    paisPedido,
    loadingModalDomicilio,
    show,
    openModal,
    closeModal,
    setNewDomicilio,
    typeMsj,
    msj,
}) {
    let responsive = false;

    return (
        <>
            <a
                className={
                    "btn bertha-green-button" +
                    (responsive == true ? "w-100" : "")
                }
                role="button"
                onClick={openModal}
            >
                <Tooltips
                    estilo={"tooltip-tc"}
                    placement={"bottom"}
                    text={"Nuevo domicilio"}
                    icon={"fas fa-plus"}
                    additionalIconClass={"alignButtonReq"}
                />
            </a>

            <Modal
                size="lg"
                show={show}
                onHide={closeModal}
                centered={true}
                backdrop="static"
            >
                <ModalHeader className="border-0" closeButton={view === "1"}>
                    <ModalTitle>
                        <h6>
                            <i className="fas fa-user-plus me-2"></i>Agregar
                            Empleador
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {loadingModalDomicilio ? (
                        <section className="isLoadingArea">
                            <i className="fas fa-sync fa-spin"></i>
                        </section>
                    ) : (
                        <>
                            {view == "1" && (
                                <FormularioAgregarDomicilioReq
                                    setNewDomicilio={setNewDomicilio}
                                    save={save}
                                    paisPedido={paisPedido}
                                />
                            )}

                            {view == "2" && (
                                <div className="isLoadingArea">
                                    <p>
                                        <i
                                            className={
                                                "fas " +
                                                (typeMsj == "exito"
                                                    ? "fa-check-circle text-success"
                                                    : "fa-times-circle text-muted")
                                            }
                                        ></i>
                                    </p>

                                    <h5 className="mt-1 mb-3">{msj}</h5>

                                    <div className="row justify-content-center mx-0">
                                        <div className="col-5">
                                            <button
                                                type="button"
                                                className="btn btn-lg bertha-purple-button w-100"
                                                onClick={closeModal}
                                            >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
