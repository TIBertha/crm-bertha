import React, {useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {setPasswordUser} from "../../../Functions/Usuarios.jsx";

export default function ModalSetNewPassword({id}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('1');
    const [msj, setMsj] = useState('');
    const [typeMsj, setTypeMsj] = useState('');
    const [contra, setContra] = useState('');
    let conf = {title: 'Restaurar contraseña', icon: 'fas fa-user-lock'};
    let icon = {type: 'times', color: 'muted'};
    if (typeMsj == 'exito'){
        icon.type = 'check';
        icon.color = 'success';
    }

    function openModal() {
        setShow(true);
        setLoading(false);
        setView('1');
        setContra('');
    }

    function handleChange(e, campo) {
        let valor = e.target.value;
        if (campo == 'contra'){
            setContra(valor);
        }
    }

    function resetPassword() {
        setLoading(true);
        setPasswordUser(id, contra, 'empleador').then(r => {
            setLoading(false);
            setView('2');
            setMsj(r.msj);
            setTypeMsj(r.type);
        }).catch(function (error){
            if (error.response.status == 422){
                setLoading(false);
                setView('2');
                setMsj(r.msj);
                setTypeMsj(r.type);
            }
        });
    }

    return(
        <>
            <a onClick={(e) => openModal()} >
                <i data-toggle="tooltip" data-placement="top" title={conf.title} className={conf.icon + ' icon-action px-2'}></i>
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
                            {(view == '1') &&
                                <section className="row justify-content-center">

                                    <div className={'form-group col-12' + ((contra) ? ' mb-25' : '')}>
                                        <div className="row">
                                            <label className="col-12  col-form-label align-self-center">Contraseña</label>
                                            <div className="col-12">
                                                <input className="form-control" name="contra" placeholder="Ingresar nueva contraseña" value={contra} onChange={(e) => handleChange(e, 'contra')} type="text"/>
                                            </div>
                                        </div>
                                    </div>

                                    {(contra) &&
                                        <div className="form-group col-12">
                                            <a className="btn bertha-purple-button w-100" onClick={resetPassword}>
                                                Cambiar contraseña
                                            </a>
                                        </div>
                                    }
                                </section>
                            }
                            {(view == '2') &&
                                <div className="isLoadingArea">
                                    <p><i className={'fas fa-' + icon.type + '-circle text-' + icon.color}></i></p>

                                    <h5 className="mt-1 mb-3">{msj}</h5>

                                    <div className='row justify-content-center mx-0'>
                                        <div className="col-5">
                                            <button type="button" className="btn btn-lg bertha-purple-button w-100" onClick={(e) => setShow(false)} >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>}
                </ModalBody>
            </Modal>
        </>
    );
}

