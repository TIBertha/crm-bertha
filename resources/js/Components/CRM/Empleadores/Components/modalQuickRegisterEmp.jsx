import React, {useState} from 'react';
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import NewCopyButton from "../../Components/newCopyButton.jsx";
import RegFormEmp from "./regFormEmp.jsx";

export default function ModalQuickRegisterEmp({typeMsj = 'exito', save, handleChange, show, close, isLoading, successView, nombres, apellidos, telefono, token, rMsj}) {

    let newToken = 'Por transparencia y buenas prácticas siempre enviamos los términos y condiciones de nuestro servicio antes del pago, por favor léalos y dele "Acepto", cuando lo haga le saldrá nuestra cuenta bancaria.' + "\r\n" + "\r\n" + token;

    return(
        <>
            <Modal size="sm" scrollable={false} show={show} onHide={(e) => close(e, ((successView == true) ? true : false) )} centered={true} backdrop="static" keyboard={false}>

                <ModalHeader className="bertha-content-aviso" closeButton>
                    <ModalTitle>
                        <h6>Nuevo empleador</h6>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    {(successView == true) &&
                        <div className="isLoadingArea">

                            <section className="row justify-content-center mx-0">

                                <div className="col-12">
                                    <p><i className={'fas ' + (typeMsj === 'exito' ? 'fa-check-circle text-success' : 'fa-times-circle text-muted')}></i></p>
                                    <h5 className="mt-1 mb-3">{rMsj}</h5>
                                </div>

                                <div className="col-12 col-md-8">
                                    <NewCopyButton copyText={newToken} btnColor={'green'} successMsj={'Token Copiado'} btnText={textoCopiar}/>
                                </div>

                                <span className="col-12 my-1"></span>

                                <div className="col-12 col-md-8">
                                    <a className="btn bertha-purple-button font-weight-500 w-100" onClick={(e) => close(e, true)}>Cerrar</a>
                                </div>

                            </section>

                        </div>
                    }
                    {!successView &&
                        <>
                            {isLoading &&
                                <section className="isLoadingArea">
                                    <i className="fas fa-sync fa-spin"></i>
                                </section>
                            }

                            {!isLoading &&
                                <RegFormEmp
                                    handleChange={handleChange}
                                    save={save}
                                    close={close}
                                    nombres={nombres}
                                    apellidos={apellidos}
                                    telefono={telefono}
                                />
                            }
                        </>
                    }

                </ModalBody>

            </Modal>
        </>
    )
}
