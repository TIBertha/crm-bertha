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
    paisPedido,
}) {
    const paisCode = String(
        paisPedido?.country_code || paisPedido?.code || ""
    ).toLowerCase();

    const paisNombre = paisPedido?.nombre || paisPedido?.name || "";
    const cantidad = Number(postuladosCantidad) || 0;

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
            <button
                type="button"
                className="postulados-pais"
                onClick={openModal}
                title={`Ver postulantes${paisNombre ? ` · ${paisNombre}` : ""}`}
                aria-label={`Ver ${cantidad} postulantes de ${empleador}${
                    paisNombre ? `, pedido de ${paisNombre}` : ""
                }`}
                aria-haspopup="dialog"
            >
                {paisCode ? (
                    <span
                        className={`flag-icon flag-icon-${paisCode} postulados-pais__bandera`}
                        aria-hidden="true"
                    />
                ) : (
                    <i className="fa-solid fa-earth-americas" aria-hidden="true" />
                )}

                <span className="postulados-pais__contador" aria-hidden="true">
                    {cantidad}
                </span>
            </button>

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
