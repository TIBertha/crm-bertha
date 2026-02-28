import React, {useState} from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import {ajaxGetEntrevistasRequerimiento} from "../../../Functions/Requerimientos.jsx";
import NoDataLabel from "../../Components/noDatalabel.jsx";

export default function VerEntrevistasRegistradas({fecha, idSelected = null}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fechaEntrevista, setFechaEntrevista] = useState('');
    const [entrevistas, setEntrevistas] = useState([]);
    const [totalEntrevistas, setTotalEntrevistas] = useState([]);
    let conf = {title: 'Ver Enrevistas', icon: 'fas fa-calendar-alt'};

    function openModal() {
        setShow(true);
        setLoading(true);
        ajaxGetEntrevistasRequerimiento(fecha).then(r => {
            setLoading(false);
            if(r.totalEntrevistas > 0){
                setEntrevistas(r.entrevistas);
                setTotalEntrevistas(r.totalEntrevistas);
                setFechaEntrevista(r.fechaSeleccionada);
            }else{
                setTotalEntrevistas(r.totalEntrevistas);
            }
        }).catch(function (error){
            if (error.response.status == 422){
                setLoading(false);
            }
        });
    }

    return (
        <>
            <a role="button" onClick={(e) => openModal()}>
                <div className={('btn bertha-purple-button font-weight-bold font w-100')} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                    <i className={conf.icon + ' alignButtonReq mx-1'}></i>
                </div>
            </a>
            <Modal size="md" show={show} onHide={(e) => setShow(false)} centered={true} backdrop="static">
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' me-2'}></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {(loading == true) &&
                        <section className="row mx-0 justify-content-center">
                            <div className="col-auto py-4">
                                <i className="fas fa-sync fa-spin"></i>
                            </div>
                        </section>
                    }
                    {(loading == false) &&
                        <>
                            {totalEntrevistas > 0 ?
                                <>
                                    <div className="text-center">
                                        <h5 className="mb-1 font-weight-500 text-black-bertha">{fechaEntrevista}</h5>
                                        <h6 className="mb-4 font-weight-500">{'(' + totalEntrevistas + ' entrevista' + ((totalEntrevistas > 1) ? 's': '' ) + ')'}</h6>

                                        {entrevistas &&
                                            <section className='row mx-0'>
                                                {entrevistas.map((ent,index) => {
                                                    return(
                                                        <div className={'col-12 ent-card px-0'}>
                                                            <div className={'row tarjeta-entrevista mx-0 ' + ((ent.id == idSelected) ? 'isTheReq' : '')}>
                                                                <div className="col-6">
                                                                    {ent.empleador}
                                                                </div>
                                                                <div className="col-6">
                                                                    {ent.horaentrevista ? ent.horaentrevista : 'POR CONFIRMAR HORA'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </section>
                                        }
                                    </div>
                                </>
                                :
                                <NoDataLabel msj={'No hay entrevistas'}/>
                            }
                        </>
                    }
                </ModalBody>
            </Modal>
        </>
    );
}
