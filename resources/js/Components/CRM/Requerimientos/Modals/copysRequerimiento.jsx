import React, {useState} from "react";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {ajaxGetCopysRequerimiento} from "../../../Functions/Requerimientos.jsx";
import NewCopyButtonWithLabel from "../../Components/newCopyButtonWithLabel.jsx";

export default function CopysRequerimiento({idReq}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copys, setCopys] = useState(null);
    const conf = {title: 'Copys', icon: 'fas fa-clone'};

    function openModal(e){
        setShow(true);
        setIsLoading(true);
        ajaxGetCopysRequerimiento(idReq).then(r => {
            if (r.code === 200){
                setCopys(r.copys);
                setIsLoading(false);
            }else{
                setIsLoading(false);
            }
        }).catch(function (error) {
            setIsLoading(false);
        })
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
                <i data-toggle="tooltip" data-placement="top" title={conf.title} className={conf.icon + ' icon-action px-2 text-icon-copy-bertha'}></i>
            </a>
            <Modal size="md" show={show} onHide={(e) => setShow(false)} centered={true} backdrop="static">
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.title + ' me-2' }></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    {(isLoading == true) && viewLoading()}

                    {(isLoading == false && copys) &&
                        <div>
                            <NewCopyButtonWithLabel label={'Copy para Empleador'} copyText={copys.detallesEmpleador} btnColor={'skblue'} successMsj={'Speech copiado'}/>
                            <NewCopyButtonWithLabel label={'Copy para Trabajador'} copyText={copys.detallesTrabajador} btnColor={'pink'} successMsj={'Speech copiado'}/>
                            {copys.detallesFinEntrevista &&
                                <NewCopyButtonWithLabel label={'Copy finalización de entrevista'} copyText={copys.detallesFinEntrevista} icon={'fa-solid fa-dollar-sign'} btnColor={'green'} successMsj={'Speech copiado'}/>
                            }
                            <NewCopyButtonWithLabel label={'Copy para crear Contrato'} copyText={copys.detallesContratos} icon={'fa-solid fa-list-ul'} btnColor={'yellow'} successMsj={'Speech copiado'}/>

                            {copys.comprobanteAdelanto &&
                                <>
                                    <div className="py-2">
                                        <hr className="my-0 py-0"/>
                                    </div>

                                    <NewCopyButtonWithLabel label={'Comprobante de Adelanto'} copyText={copys.comprobanteAdelanto} icon={'fa-regular fa-file'} btnColor={'purple'} successMsj={'Speech copiado'}/>
                                </>
                            }

                        </div>
                    }
                </ModalBody>
            </Modal>
        </>
    )
}
