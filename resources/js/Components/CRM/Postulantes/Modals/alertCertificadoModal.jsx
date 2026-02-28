import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

export default function AlertCertificadoModal({showAlertModal, alertMSJ}) {
    const [shows, setShow] = useState(false);

    function closeModal(e){
        setShow(false);
    }

    useEffect(() => {
        setShow(showAlertModal);
    }, []);

    return(
        <Modal size="md" scrollable={false} keyboard={false} show={shows} onHide={(e) => closeModal(e)} centered={true}>
            <ModalHeader className="border-0 pt-2 px-2 pb-0" closeButton>
            </ModalHeader>
            <ModalBody className="py-2">
                <h3 className={'text-center text-underline'}>⚠️</h3>
                <label className={'pt-2 m-0 label-adjunto'}>{alertMSJ}</label>
            </ModalBody>
        </Modal>
    )
}
