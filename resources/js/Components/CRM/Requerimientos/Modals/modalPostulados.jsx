import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalTitle,
    ModalFooter,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import CardPostulante from "../../Components/cardPostulante.jsx";
import { ajaxGetPostulaciones } from "../../../Functions/Requerimientos.jsx";
import { isResponsive } from "../../../Functions/General.jsx";

export default function ModalPostulados({
    idReq,
    empleador,
    postuladosCantidad,
}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postulados, setPostulados] = useState([]);
    const [error, setError] = useState("");

    const responsive = isResponsive();
    const cerrar = () => setShow(false);

    async function cargarPostulados() {
        setIsLoading(true);
        setError("");

        try {
            const respuesta = await ajaxGetPostulaciones(idReq, 1);

            if (respuesta.code !== 200) {
                throw new Error("No se pudieron cargar los postulantes.");
            }

            setPostulados(
                Array.isArray(respuesta.postulaciones)
                    ? respuesta.postulaciones
                    : [],
            );
        } catch {
            setError(
                "No se pudieron cargar los postulantes. Inténtalo nuevamente.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function openModal() {
        setShow(true);
        setPostulados([]);
        cargarPostulados();
    }

    return (
        <>
            <a
                className="notificacionPostulante-button"
                role="button"
                tabIndex={0}
                onClick={openModal}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openModal();
                    }
                }}
                aria-label={`Ver ${postuladosCantidad} postulantes de ${empleador}`}
                aria-haspopup="dialog"
            >
                {responsive ? (
                    <>
                        <span className="badge badge-light notificacionPostulante-mobileBadge me-1">
                            {postuladosCantidad}
                        </span>

                        Postulados

                        <i
                            className="fa-solid fa-user ms-1"
                            aria-hidden="true"
                        ></i>
                    </>
                ) : (
                    <div className="notificacionPostulanciones">
                        <span className="npBadge">
                            {postuladosCantidad}
                        </span>

                        <i
                            className="fa-solid fa-user notificacionPostulante"
                            aria-hidden="true"
                        ></i>
                    </div>
                )}
            </a>

            <Modal
                size="lg"
                show={show}
                onHide={cerrar}
                centered
                scrollable
                className="modal-postulados"
                aria-label={`Postulantes de ${empleador}`}
            >
                <ModalHeader closeButton>
                    <div className="modal-postulados__cabecera">
                        <span
                            className="modal-postulados__icono"
                            aria-hidden="true"
                        >
                            <i className="fa-solid fa-user-pen"></i>
                        </span>

                        <div className="modal-postulados__titulos">
                            <ModalTitle>Postulantes</ModalTitle>

                            <p className="modal-postulados__empleador">
                                {empleador}
                            </p>

                            <span className="modal-postulados__requerimiento">
                                Requerimiento N.º {idReq}
                            </span>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    {isLoading ? (
                        <div
                            className="modal-postulados__mensaje"
                            role="status"
                        >
                            <i
                                className="fas fa-sync fa-spin"
                                aria-hidden="true"
                            ></i>

                            <p>Cargando postulantes…</p>
                        </div>
                    ) : error ? (
                        <div
                            className="modal-postulados__mensaje"
                            role="alert"
                        >
                            <p>{error}</p>

                            <button
                                type="button"
                                className="modal-postulados__boton"
                                onClick={cargarPostulados}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="modal-postulados__cantidad">
                                {postulados.length}{" "}
                                {postulados.length === 1
                                    ? "postulante"
                                    : "postulantes"}
                            </div>

                            {postulados.length > 0 ? (
                                <section className="modal-postulados__lista">
                                    {postulados.map((data, index) => (
                                        <CardPostulante
                                            key={
                                                data.id ??
                                                data.trabajador_id ??
                                                index
                                            }
                                            data={data}
                                            modelCard={2}
                                        />
                                    ))}
                                </section>
                            ) : (
                                <div className="modal-postulados__mensaje">
                                    <p>
                                        No hay postulantes registrados
                                        para este requerimiento.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
