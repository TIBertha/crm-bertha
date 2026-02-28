import React, {useState} from "react";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {ajaxGetCopysContratos} from "../../../Functions/Contratos.jsx";
import NewCopyButtonWithLabel from "../../Components/newCopyButtonWithLabel.jsx";

export default function CopyContratos({idCont}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copys, setCopys] = useState(null);
    const conf = {title: 'Copys', icon: 'fas fa-clone'};

    function openModal(e) {
        setShow(true);
        setIsLoading(true);
        ajaxGetCopysContratos(idCont).then(r => {
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
                        <h6><i className={conf.title + ' mr-2' }></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    {(isLoading == true) && viewLoading()}
                    {(isLoading == false && copys) &&
                        <div>

                            <NewCopyButtonWithLabel label={'Para Empleador'} copyText={copys.detallesEmpleador} btnColor={'skblue'} successMsj={'Speech copiado'}/>
                            <NewCopyButtonWithLabel label={'Para Trabajador'} copyText={copys.detallesTrabajador} btnColor={'pink'} successMsj={'Speech copiado'}/>
                            <NewCopyButtonWithLabel label={'Opción A no responde'} copyText={copys.copy1} btnColor={'green'} successMsj={'Speech copiado'}/>
                            {copys.trabajadorB &&
                                <NewCopyButtonWithLabel label={'Opción B disponible (A no llegó) - ' +  copys.trabajadorB} copyText={copys.copyTrabajadorB} btnColor={'yellow'} successMsj={'Speech copiado'}/>
                            }
                            {copys.trabajadorC &&
                                <NewCopyButtonWithLabel label={'Opción C disponible (Ni A ni B llegaron) - ' + copys.trabajadorC} copyText={copys.copyTrabajadorC} btnColor={'purple'} successMsj={'Speech copiado'}/>
                            }
                            <NewCopyButtonWithLabel label={'Nueva entrevista'} copyText={copys.copyNuevaEntrevista} btnColor={'orange'} successMsj={'Speech copiado'}/>
                        </div>
                    }
                </ModalBody>
            </Modal>
        </>
    )
}
