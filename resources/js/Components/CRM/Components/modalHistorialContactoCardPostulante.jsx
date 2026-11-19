import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalTitle,
    ModalHeader,
} from "react-bootstrap";
import { getStatusContact } from "../../Helpers/postulantes.js";

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

export default function ModalHistorialContactoCardPostulante({
                                                                 historial = [],
                                                                 trabajador,
                                                             }) {
    const [show, setShow] = useState(false);

    const historialOriginal = Array.isArray(historial)
        ? historial
        : [];

    // Ordena una copia: los contactos más recientes primero.
    const contactos = [...historialOriginal].sort((a, b) => {
        const diasA = obtenerDias(a) ?? Infinity;
        const diasB = obtenerDias(b) ?? Infinity;

        if (diasA === diasB) return 0;

        return diasA - diasB;
    });

    const lastContact = contactos[0] ?? null;

    let statusContact = getStatusContact(historialOriginal);

    if (lastContact) {
        const dias = obtenerDias(lastContact);

        if (dias !== null) {
            if (dias <= 30) {
                statusContact = "fresh";
            } else if (dias <= 60) {
                statusContact = "mid";
            } else {
                statusContact = "raw";
            }
        }
    }

    const tooltip = lastContact
        ? obtenerDias(lastContact) === null
            ? "Ver historial de contacto de la trabajadora"
            : obtenerDias(lastContact) === 0
                ? "Hoy fue contactada la trabajadora"
                : `La trabajadora fue contactada hace ${lastContact.diasPasados} día(s)`
        : "La trabajadora aún no es contactada";

    const titulo = `Historial de contacto de ${trabajador}`;
    const cerrar = () => setShow(false);

    return (
        <>
            <li className="contacto-historial-trigger">
                <button
                    type="button"
                    className={
                        "contacto-historial-trigger__boton" +
                        (lastContact ? ` es-${statusContact}` : "")
                    }
                    onClick={() => setShow(true)}
                    title={tooltip}
                    aria-label={`${tooltip}. Ver historial de contacto de ${trabajador}`}
                    aria-haspopup="dialog"
                >
                    <i
                        className="fas fa-phone-alt"
                        aria-hidden="true"
                    ></i>
                </button>
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

                        {lastContact && (
                            <span
                                className={
                                    "modal-historial-contacto__badge " +
                                    claseAntiguedad(lastContact)
                                }
                            >
                                Último contacto:{" "}
                                {textoAntiguedad(
                                    lastContact,
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
