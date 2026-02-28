import React, {useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import CardPostulante from "../../Components/cardPostulante.jsx";
import {
    ajaxGetPostulaciones,
    getModalidadName,
} from "../../../Functions/Requerimientos.jsx"
import {isResponsive} from "../../../Functions/General.jsx";

export default function ModalPostulados({idReq, empleador, postuladosCantidad}) {

    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postulados, setPostulados] = useState([]);
    let conf = {icon: 'fas fa-user'};
    let responsive = isResponsive();

    function viewLoading(){
        return(
            <section className={'w-100 text-center'}>
                <i className="fas fa-sync fa-spin" style={{fontSize: "35px"}}></i>
            </section>
        )
    }

    function openModal(e){
        setShow(true);
        setIsLoading(true);
        ajaxGetPostulaciones(idReq, 1).then(r => {
            if (r.code === 200){
                setPostulados(r.postulaciones);
                setIsLoading(false);
            }
        }).catch(function(error){
            setIsLoading(false);

        });

    }

    return (

        <>
            <a className="notificacionPostulante-button" role="button" onClick={(e) => openModal(e)}>
                {responsive
                    ?
                    <>
                        <span className='badge badge-light notificacionPostulante-mobileBadge me-1'>{postuladosCantidad}</span> Postulados <i className={conf.icon + '  ml-1'}></i>
                    </>
                    :
                    <div>
                        <i className={conf.icon + '-plus notificacionPostulante'}></i>
                        <span className={'notification-badge'}>{postuladosCantidad}</span>
                    </div>
                }
            </a>

            <Modal size="md" show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <div className={'row mx-0 align-items-center'}>
                            <h6 className={'col-auto px-1'}>
                                <i className={conf.icon}></i>
                            </h6>
                            <h6 className={'col px-1'}>
                                <p>{'Postulante' + (postuladosCantidad == 1 ? '' : 's') + ' para empleador '}<strong>{empleador}</strong></p>
                                <p>{'ID: ' + idReq}</p>
                            </h6>
                        </div>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">

                    {(isLoading == true) && viewLoading()}

                    {(isLoading == false) &&
                        <section className="row justify-content-center section-information-modal">
                            {postulados.map((data,index) => {
                                return(
                                    <CardPostulante data={data} modelCard={2} />
                                );
                            })}
                        </section>
                    }

                </ModalBody>
            </Modal>
        </>
    );
};
