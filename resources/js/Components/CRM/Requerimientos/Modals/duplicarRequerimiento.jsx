import React, {useState} from "react";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {ajaxDuplicarRequerimiento} from "../../../Functions/Requerimientos.jsx";
import NewCopyButton from "../../Components/newCopyButton.jsx";

export default function DuplicarRequerimiento({url, idRequerimiento}) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [msj, setMsj] = useState(null);
    const [newId, setNewId] = useState(null);
    const conf = {title: ('Duplicar requerimiento ' + idRequerimiento), icon: 'fas fa-file-import'};

    function openModal(e){
        setShow(true);
        duplicarRequerimiento();
    }

    function duplicarRequerimiento(){
        setIsLoading(true);
        ajaxDuplicarRequerimiento(idRequerimiento).then(r => {
            if (r.code === 200){
                setIsLoading(false);
                setMsj(r.msj);
                setNewId(r.idNew);
            }
        }).catch(function (error){
            setShow(false);
        })
    }

    function viewLoading(){
        return(
            <section className={'w-100 text-center'}>
                <i className="fas fa-sync fa-spin" style={{fontSize: "35px"}}></i>
            </section>
        )
    }

    function viewConfirmation(){
        return(
            <div className={'text-center'}>
                <i className={'fas fa-check-circle text-success'} style={{fontSize: '35px'}}></i>
                <p className={'py-15 h4'}>{msj}</p>
                <p className={'py-15 h4'}>
                    <span>El número de requerimiento duplicado es</span>
                    <NewCopyButton copyText={newId} successMsj={'ID copiado'} btnColor={'skblue'} btnText={newId} icon={'fa-solid fa-circle-chevron-right'} />
                </p>
                <a className='btn bertha-purple-button btn-block' href={url + '/requerimientos'}>
                    Ok
                </a>
            </div>
        )
    }

    return(
        <>
            <a role="button" onClick={(e) => openModal(e)}>
                <i data-toggle="tooltip" data-placement="top" title={conf.title} className={conf.icon + ' icon-action px-2 text-black'} style={{color: '#ab26aa'}}></i>
            </a>
            <Modal size="lg" show={show} onHide={(e) => setShow(false)} centered={true} backdrop="static">
                <ModalHeader className="border-0">
                    <ModalTitle>
                        <h6><i className={conf.icon + ' me-2' }></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    {(isLoading == true)  && viewLoading() }
                    {(isLoading == false) && viewConfirmation() }
                </ModalBody>
            </Modal>
        </>
    )

}
