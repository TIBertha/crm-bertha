import React, {useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";
import {ajaxGetPostulantesAntiguasMostradas} from "../../../Functions/Requerimientos.jsx";
import {getDisplayHeight} from "../../../Functions/General.jsx";

export default function PostulantesAntiguasMostradas({idEmpleador, idRequerimiento}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    let conf = {title: 'Postulantes pasadas'};
    let displayHeight = getDisplayHeight();

    function openModal(e){
        setShow(true);
        setLoading(true);
        ajaxGetPostulantesAntiguasMostradas(idEmpleador, idRequerimiento).then(r => {
            if (r.code === 200){
                setLoading(false);
                setData(r.data);
            }
        }).catch(function (error) {
            setLoading(false);
            setData([]);
        })
    }
    function closeModal(e){
        setShow(false);
        setLoading(false);
        setData([]);
    }


    return(
        <>
            <a role="button" onClick={(e) => openModal(e)} className={'btn font-weight-500 btn-block btn-postulantesAntiguas'}>
                {conf.title}
            </a>
            <Modal size="xl" show={show} onHide={(e) => closeModal(e)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title + ( (data != []) ?  (' (' + data.length + ')') : '')}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    {(loading == true) &&
                        <>
                            <section className="isLoadingArea">
                                <i className="fas fa-sync fa-spin"></i>
                            </section>
                        </>
                    }
                    {(loading == false) &&
                        <section className={'p-3 postulantesAntiguas addScroll'} style={{height: (displayHeight * 0.75) + 'px'}}>
                            <div className={'row mx-0'}>
                                {(data.length != 0) &&
                                    <>
                                        {data.map((d, key) => {
                                            return(
                                                <div className={'col-12 col-md-6'}>
                                                    <div className={'px-2 py-3 card'}>
                                                        <div className={'row mx-0'}>
                                                            <div className={'col-3 px-1 align-self-center'}>
                                                                <img src={d.foto} className={'img rounded-circle vertical-align-middle'} />
                                                            </div>
                                                            <div className={'col-9 px-1 text-left align-self-center'}>
                                                                <div className={'vertical-align-middle'}>
                                                                    <NewCopyIcon copyText={d.postulante} icon={'fas fa-copy'} successMsj={'Nombre copiado'} additonalClass={'me-2'} />
                                                                    <span className={'nombrePostulante'}>{d.postulante}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                }
                            </div>
                        </section>
                    }
                </ModalBody>
            </Modal>
        </>
    )

}
