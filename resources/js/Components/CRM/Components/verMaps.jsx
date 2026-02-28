import React, {useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {getDisplayHeight, isResponsive} from "../../Functions/General.jsx";

export default function VerMaps({flag, name, img, imgSize}) {
    const [show, setShow] = useState(false);
    let conf = {m: '15px', title: 'Mapa metropolitano de ' + name};
    let displayHeight = getDisplayHeight();

    return(
        <>
            <a role="button" onClick={(e) => setShow(true)} className={'btn btn-sm btn-flag-mix'}>
                <span className={'flag-icon flag-icon-' + flag +' flag-icon-squared flag-style'} style={{width: conf.m,height: conf.m, backgroundSize: '' + conf.m + ' ' + conf.m + ''}} data-toggle="tooltip" data-placement="bottom" title={conf.title}> </span>
            </a>
            <Modal size={imgSize} show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    <div style={{height: (displayHeight * 0.75) + 'px'}}>
                        <img src={img} className={'h-100 100-auto'} />
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}
