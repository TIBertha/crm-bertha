import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";
import { getStatusContact } from "../../Helpers/postulantes.js";
import { isResponsive } from "../../Functions/General";

export default function ModalHistorialContactoCardPostulante({ historial, trabajador,}) {
    const [show, setShow] = useState(false);
    let conf = { m: "15px", title: "Historial de contacto de " + trabajador };
    let responsive = isResponsive();

    let wereContacted = historial.length != 0 ? true : false;

    let lastContact = null;
    let statusContact = getStatusContact(historial);

    if (wereContacted == true) {
        lastContact = historial[historial.length - 1];

        if (lastContact.diasPasados >= 0 && lastContact.diasPasados <= 30) {
            statusContact = "fresh";
        } else if (
            lastContact.diasPasados >= 31 &&
            lastContact.diasPasados <= 60
        ) {
            statusContact = "mid";
        } else if (lastContact.diasPasados >= 61) {
            statusContact = "raw";
        }
    }

    return (
        <>
            <li
                onClick={(e) => setShow(true)}
                className={
                    wereContacted == true ? "contacted " + statusContact : ""
                }
                data-toggle="tooltip"
                data-placement="bottom"
                title={
                    lastContact
                        ? lastContact.diasPasados === 0
                            ? "Hoy fue contactada la trabajadora"
                            : `La trabajadora fue contactada hace ${lastContact.diasPasados} día(s)`
                        : "La trabajadora aún no es contactada"
                }
            >
                <i className="fas fa-phone-alt"></i>
            </li>
            <Modal
                size="lg"
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    <table className={"historialContactoTable"}>
                        <tr className={"titulos"}>
                            <th>Colaborador</th>
                            <th>Fecha/Hora</th>
                            <th>Días pasados</th>
                        </tr>
                        {historial.map((h, index) => {
                            let fechaHora = h.fecha + " " + h.hora;
                            return (
                                <tr className={"contenido"}>
                                    <td>{h.usuarioInterno}</td>
                                    <td>{fechaHora}</td>
                                    <td>{h.diasPasados}</td>
                                </tr>
                            );
                        })}
                    </table>
                </ModalBody>
            </Modal>
        </>
    );
}
