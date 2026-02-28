import React, {useState} from "react";
import {isResponsive} from "../../../Functions/General.jsx";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";

export default function VerHistorialContacto({historial, trabajador}) {
    const [show, setShow] = useState(false);
    let conf = {m: '15px', title: 'Historial de contacto de ' + trabajador};
    let responsive = isResponsive();

    return(
        <>
            <li onClick={(e) => setShow(true)} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                <i className="fas fa-address-book"></i>
            </li>
            <Modal size="lg" show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    <table className={'historialContactoTable'}>
                        <tr className={'titulos'}>
                            <th>Colaborador</th>
                            <th>Fecha/Hora</th>
                            <th>Días pasados</th>
                        </tr>
                        {historial.map((h,index) => {
                            let fechaHora = h.fecha + ' ' + h.hora
                            return(
                                <tr className={'contenido'}>
                                    <td>{h.usuarioInterno}</td>
                                    <td>{fechaHora}</td>
                                    <td>{h.diasPasados}</td>
                                </tr>
                            )
                        })}

                    </table>
                </ModalBody>
            </Modal>
        </>
    )
}
