import React, {useState} from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import DetallesRequerimiento from "../Components/detallesRequerimiento.jsx";

export default function VerDetallesRequerimiento({data, responsive = false}) {

    const [show, setShow] = useState(false);
    let conf = {title: 'Ver detalles del requerimiento', icon: 'fas fa-info'};

    return(
        <>
            <a className={responsive === true ? 'w-100' : ''} role="button" onClick={(e) => setShow(true)}>
                <div className={('btn bertha-purple-button font-weight-bold font btn-') + (responsive === true ? 'lg w-100' : 'sm text-white')} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                    <i className={conf.icon + ' icon-question'}></i> {responsive === true && <span className='ml-2'>{conf.title}</span>}
                </div>
            </a>

            <Modal size="lg" show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' mr-2'}></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    <DetallesRequerimiento data={data}/>
                </ModalBody>
            </Modal>

        </>
    );
}
