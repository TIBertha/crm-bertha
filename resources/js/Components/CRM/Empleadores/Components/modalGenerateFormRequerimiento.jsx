import React, {useState} from 'react';
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import NewCopyButton from "../../Components/newCopyButton.jsx";

export default function ModalGenerateFormRequerimiento({changeViewModal, view, show, close, generate, linkFormRequerimiento, exist}) {

    const [textoCopiar, setTextoCopiar] = useState('Copiar');

    function copyLink(e){

        changeViewModal();

        setTextoCopiar('Copiado');

        setTimeout(function () {
            setTextoCopiar('Copiar');
        }, 1500);
    }

    return (

        <div>

            <Modal size="md" scrollable={false} show={show} onHide={(e) => close(e)} centered={true} backdrop="static" keyboard={false}>
                <ModalHeader className="bertha-content-aviso" closeButton>
                    <ModalTitle>
                        <h6>Link Formulario Requerimiento</h6>
                    </ModalTitle>
                </ModalHeader>

                <form method="POST" >

                    <ModalBody>

                        <div className="layout-form-search-side">

                            {linkFormRequerimiento ?

                                <>
                                    <p>{exist ? 'Generaste el siguiente link:' : 'El empleador tiene el siguiente link activo:'}</p>

                                    <div className="mt-10 text-center mb-10">

                                        <div className={'mb-3'}>
                                            <i className="fas fa-check-circle icon-green"></i> {linkFormRequerimiento}
                                        </div>

                                        <NewCopyButton btnText={textoCopiar} copyText={linkFormRequerimiento} btnColor={'skblue'} successMsj={'Link copiado'}/>
                                    </div>
                                </>

                                :

                                <>
                                    <div className="col-12 form-group mt-4">
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <button className="btn bertha-purple-button btn-sm btn-reset font-weight-bold" type="button" onClick={ (e) => generate(e) } >Generar Link</button>
                                            </div>
                                        </div>
                                    </div>
                                </>

                            }

                        </div>

                    </ModalBody>

                </form>

            </Modal>

        </div>

    );

}
