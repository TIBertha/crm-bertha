import React, {useState} from "react";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import NewCanvas from "../Components/Canvas/newCanvas.jsx";

export default function CrearAnuncioRequerimiento({dataReq}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const conf = {title: 'Generar anuncio', icon: 'fas fa-image'};

    function openModal(){
        setShow(true);
    }

    function viewLoading(){
        return(
            <section className={'w-100 text-center'}>
                <i className="fas fa-sync fa-spin" style={{fontSize: "35px"}}></i>
            </section>
        )
    }

    return(
        <>
            <a role="button" onClick={(e) => openModal(e)}>
                <i data-toggle="tooltip" data-placement="top" title={conf.title} className={conf.icon + ' icon-action px-2 text-success'}></i>
            </a>
            <Modal size="lg" show={show} onHide={() => setShow(false)} centered={true} backdrop="static">
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' me-2' }></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    {(isLoading === true) ?
                        viewLoading()
                        :
                        <NewCanvas dataReq={dataReq} />
                    }
                </ModalBody>
            </Modal>
        </>
    )
}
