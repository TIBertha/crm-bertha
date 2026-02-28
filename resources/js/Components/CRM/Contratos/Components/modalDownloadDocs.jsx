import React, {useState} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {isResponsive} from "../../../Functions/General.jsx";

export default function ModalDownloadDocs({url}) {
    const [show, setShow] = useState(false);
    let conf = {title: 'Descargar Documentos', icon: 'fas fa-file', m: '15px'};
    let responsive = isResponsive();
    let buttonsList = [
        {labelB: 'Acuerdo de Confidencialidad', hrefB: '/ajax-download-acuerdo', targetB: '_self', flag: null},
        {labelB: 'Contrato Empleador/Trabajador', hrefB: '/ajax-download-contrato', targetB: '_self', flag: null},
        {labelB: 'Recibo Pago', hrefB: '/ajax-download-recibo', targetB: '_self', flag: null},
        {labelB: 'Calculadora Beneficios', hrefB: 'https://holabertha.com/servicios/calculadora', targetB: '_blank', flag: 'pe'},
    ];

    return(
        <>
            <a className={responsive === true ? 'w-100' : ''} role="button" onClick={(e) => setShow(true)}>
                <div className={('btn bertha-skblue-button font-weight-bold font btn-') + (responsive === true ? 'lg w-100' : 'sm text-white')} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                    <i className={conf.icon + ' icon-question'}></i> {responsive === true && <span className='ml-2'>{conf.title}</span>}
                </div>
            </a>

            <Modal size="lg" show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' me-2'}></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    <div className="row justify-content-center">
                        {buttonsList.map((b,index) => {
                            return(
                                <div className={'col-12 mx-1 text-center mb-2'}>
                                    <a className={'btn bertha-purple-button btn-sm font-weight-bold font'} href={b.hrefB} target={b.targetB}>
                                        {b.labelB}
                                        {(b.flag) && <span className={'flag-icon flag-icon-' + b.flag +' flag-icon-squared flag-style ms-2'} style={{width: conf.m,height: conf.m}}></span>}
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>

        </>
    )
}
