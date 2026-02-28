import React from "react";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";
import CustomCopyButton from "../../Components/customCopyButton";

export default function VerPostulaciones({
    postulante,
    postulaciones,
    totalPostulaciones,
}) {
    const [show, setShow] = useState(false);

    return (
        <>
            <span
                className="badge text-bg-success"
                role="button"
                onClick={(e) => setShow(true)}
            >
                {"Tiene " +
                    totalPostulaciones +
                    (totalPostulaciones == 1
                        ? " postulación"
                        : " postulaciones")}
            </span>

            <Modal
                size="lg"
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>
                            <i className="fas fa-portrait me-2"></i>
                            {"Postulaciones de " + postulante}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    {postulaciones && (
                        <>
                            {postulaciones.map((data, key) => {
                                return (
                                    <div className="my-2 border-postulaciones">
                                        <div>
                                            {data.empleador +
                                                (data.idReq
                                                    ? " ( Req: " +
                                                      data.idReq +
                                                      ")"
                                                    : "") +
                                                (data.actividad
                                                    ? " - " + data.actividad
                                                    : "") +
                                                (data.modalidad
                                                    ? " - " + data.modalidad
                                                    : "") +
                                                (data.sueldo
                                                    ? " - S/ " + data.sueldo
                                                    : "") +
                                                (data.fechaentrevista
                                                    ? " - " +
                                                      data.fechaentrevista
                                                    : "") +
                                                (data.horaentrevista
                                                    ? " - " +
                                                      data.horaentrevista
                                                    : "")}
                                        </div>
                                        {data.copyRequerimiento && (
                                            <>
                                                <hr className="my-2" />
                                                <CustomCopyButton
                                                    textNeutro={
                                                        "Copiar requerimiento"
                                                    }
                                                    textOnCopy={
                                                        "Requerimiento copiado"
                                                    }
                                                    copyText={
                                                        data.copyRequerimiento
                                                    }
                                                    icon={"fas fa-copy"}
                                                    additonalIconClass={
                                                        "icon-action align-self-center"
                                                    }
                                                    colorNeutro={"#ff0080"}
                                                    colorOnCopy={"#9B004E"}
                                                />
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
