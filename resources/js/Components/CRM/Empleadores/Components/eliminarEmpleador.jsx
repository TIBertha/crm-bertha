import React, {useState} from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import {
    ajaxBuscarVinculosEmpleador,
    ajaxEliminarDataEmpleador,
    ajaxTransferirDataEmpleador
} from "../../../Functions/Empleadores.jsx";
import Select from "react-select";

export default function EliminarEmpleador({idEmpleador, nombreEmpleador, handleRefresh, url}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [noData, setNoData] = useState(false);
    const [view, setView] = useState(1);
    const [msj, setMsj] = useState('');
    const [listEmp, setListEmp] = useState([]);
    const [empSelected, setEmpSelected] = useState(null);
    const [vinculos, setVinculos] = useState(null);

    let modal = {title: ('Eliminar empleador ' + nombreEmpleador + ' (ID: '+ idEmpleador +')'), icon: 'fas fa-times icon-action'};
    function setNullData() {
        setView(2);
        setMsj(nombreEmpleador + ' no tiene data registrada.');
        setNoData(true);
    }

    function openModal(e) {
        setShow(true);
        setLoading(true);
        ajaxBuscarVinculosEmpleador(idEmpleador).then(r => {
            if (r.code === 200){
                setLoading(false);
                setListEmp(r.listEmp);
                setVinculos(r.data ? r.data : setNullData());
            }
        }).catch(function (error) {

        })
    }

    function closeModal() {
        setMsj('');
        setView(1);
        setShow(false);
        setDeleted(false);
    }

    function transferirData(e){
        setLoading(true);
        ajaxTransferirDataEmpleador(idEmpleador,empSelected).then(r => {
            if (r.code === 200){
                setLoading(false);
                setView(2);
                setMsj(r.msj);
                setDeleted(true);
            }
        }).catch(function (error) {
            setLoading(false);
            setMsj(r.msj);
        })
    }

    function eliminarData(e) {
        setLoading(true);
        ajaxEliminarDataEmpleador(idEmpleador).then(r => {
            if (r.code === 200){
                setLoading(false);
                setView(2);
                setMsj(r.msj);
                setDeleted(true);
                setNoData(false);
            }
        }).catch(function (error) {
            setLoading(false);
            setMsj(r.msj);
        })
    }

    function view1(){
        return(
            <>
                {(vinculos) &&
                    <div>
                        <h5>{'Se encontraron ' + (vinculos.total) + ' registros:'}</h5>
                        <div className={'pt-3 ps-2'}>
                            {vinculos.requerimientos > 0 ? <p>{'- '}<strong>{vinculos.requerimientos}</strong>{' requerimiento(s).'}</p> : null}
                            {vinculos.domicilios > 0 ? <p>{'- '}<strong>{vinculos.domicilios}</strong>{' domicilio(s).'}</p> : null}
                            {vinculos.contratos > 0 ? <p>{'- '}<strong>{vinculos.contratos}</strong>{' contrato(s).'}</p> : null}
                        </div>
                    </div>
                }

                <div className={'p-2'}>
                    <hr className={'m-0'}/>
                </div>

                <div>
                    <h6>Transferir data a nuevo registro:</h6>

                    <div className={'mt-2'}>
                        <Select
                            value={empSelected}
                            isMulti={false}
                            isSearchable
                            onChange={(e) => setEmpSelected(e)}
                            options={listEmp}
                            placeholder={'Seleccione'}
                            theme={theme => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    primary: 'black',
                                },
                            })}
                        />
                    </div>

                    {(empSelected) &&
                        <div className={'py-2'}>
                            <div className={'pt-2'}>
                                <a className={'btn btn-sm btn-block bertha-green-button font-weight-700'} onClick={(e) => transferirData(e)}>
                                    Transferir a nuevo registro
                                </a>
                            </div>
                        </div>
                    }
                </div>

                {!(empSelected) &&
                    <>
                        <div className={'p-2'}>
                            <hr className={'m-0'}/>
                        </div>
                        <div className={'py-1'}>
                            <h6>Si no quiere transferir la data, puede eliminarla:</h6>
                            <div className={'pt-2'}>
                                <a className={'btn bertha-red-button btn-sm btn-block font-weight-700'} onClick={(e) => eliminarData(e)}>
                                    Eliminar Empleador
                                </a>
                            </div>
                        </div>
                    </>
                }

            </>
        )
    }

    function view2() {
        return(
            <div className={'text-center'}>
                <div className={'py-1'}>
                    <h5>{msj}</h5>
                </div>
                {!deleted &&
                    <a className={'btn bertha-red-button btn-sm btn-block font-weight-700 my-2'} onClick={(e) => eliminarData(e)}>Eliminar Empleador</a>
                }
                {(deleted && !noData) &&
                    <a className={'btn btn-sm btn-block bertha-purple-button font-weight-700 my-2'} href={url+'/empleadores'}>Cerrar</a>
                }
            </div>
        )
    }

    return(
        <>
            <a onClick={(e) => openModal(e)}>
                <i data-toggle="tooltip" data-placement="top" title={modal.title} className={modal.icon + ' icon-action text-red px-2'}></i>
            </a>

            <Modal size="xl" scrollable={false} backdrop="static" keyboard={false} show={show} onHide={(e) => closeModal()} centered={true}>
                <ModalHeader className="border-0 pb-0" closeButton={!Boolean(loading)}>
                    <ModalTitle>
                        <h6><i className={modal.icon + ' mr-2'}></i>{modal.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-3">
                    {(loading) &&
                        <>
                            <section className="isLoadingArea">
                                <i className="fas fa-sync fa-spin"></i>
                            </section>
                        </>
                    }
                    {(!loading) &&
                        <>
                            {(view === 1) && view1() }
                            {(view === 2) && view2() }
                        </>
                    }
                </ModalBody>
            </Modal>
        </>
    )
}
