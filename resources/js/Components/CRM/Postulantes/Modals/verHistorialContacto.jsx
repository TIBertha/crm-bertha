import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalTitle,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

function obtenerDias(contacto) {
    const valor = contacto?.diasPasados;

    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    const dias = Number(valor);
    return Number.isFinite(dias) && dias >= 0 ? dias : null;
}

function textoAntiguedad(contacto) {
    const dias = obtenerDias(contacto);

    if (dias === null) return "Sin fecha";
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Hace 1 día";

    return `Hace ${dias} días`;
}

function claseAntiguedad(contacto) {
    const dias = obtenerDias(contacto);

    if (dias === null) return "";
    if (dias <= 30) return "es-fresh";
    if (dias <= 60) return "es-mid";

    return "es-raw";
}

export default function VerHistorialContacto({
     historial = [],
     trabajador,
}) {
    const [show, setShow] = useState(false);

    // Ordena una copia para conservar intacto el arreglo recibido.
    const contactos = (
        Array.isArray(historial) ? [...historial] : []
    ).sort((a, b) => {
        const diasA = obtenerDias(a) ?? Infinity;
        const diasB = obtenerDias(b) ?? Infinity;

        if (diasA === diasB) return 0;

        return diasA - diasB;
    });

    const ultimoContacto = contactos[0];
    const cerrar = () => setShow(false);
    const titulo = `Historial de contacto de ${trabajador}`;

    return (
        <>
            <li
                onClick={() => setShow(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setShow(true);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={titulo}
                aria-haspopup="dialog"
                data-toggle="tooltip"
                data-placement="bottom"
                title={titulo}
            >
                <i
                    className="fas fa-address-book"
                    aria-hidden="true"
                ></i>
            </li>

            <Modal
                show={show}
                onHide={cerrar}
                centered
                scrollable
                className="modal-historial-contacto"
                aria-label={titulo}
            >
                <ModalHeader closeButton>
                    <div className="modal-historial-contacto__cabecera">
                        <span
                            className="modal-historial-contacto__icono"
                            aria-hidden="true"
                        >
                            <i className="fas fa-history"></i>
                        </span>

                        <div className="modal-historial-contacto__titulos">
                            <ModalTitle>
                                Historial de contacto
                            </ModalTitle>

                            <p>{trabajador}</p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="modal-historial-contacto__resumen">
                        <span className="modal-historial-contacto__cantidad">
                            {contactos.length}{" "}
                            {contactos.length === 1
                                ? "contacto registrado"
                                : "contactos registrados"}
                        </span>

                        {ultimoContacto && (
                            <span
                                className={
                                    "modal-historial-contacto__badge " +
                                    claseAntiguedad(ultimoContacto)
                                }
                            >
                                Último contacto:{" "}
                                {textoAntiguedad(
                                    ultimoContacto,
                                ).toLowerCase()}
                            </span>
                        )}
                    </div>

                    {contactos.length > 0 ? (
                        <ul className="modal-historial-contacto__lista">
                            {contactos.map((contacto, index) => (
                                <li
                                    key={index}
                                    className="modal-historial-contacto__registro"
                                >
                                    <div className="modal-historial-contacto__datos">
                                        <p className="modal-historial-contacto__colaborador">
                                            {contacto.usuarioInterno ||
                                                "Sin colaborador"}
                                        </p>

                                        <div className="modal-historial-contacto__fecha">
                                            <i
                                                className="far fa-calendar-alt"
                                                aria-hidden="true"
                                            ></i>

                                            <span>
                                                {contacto.fecha || "—"}

                                                {contacto.hora && (
                                                    <>
                                                        {" · "}
                                                        {contacto.hora}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={
                                            "modal-historial-contacto__badge " +
                                            claseAntiguedad(contacto)
                                        }
                                    >
                                        {textoAntiguedad(contacto)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="modal-historial-contacto__vacio">
                            No hay contactos registrados.
                        </p>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
