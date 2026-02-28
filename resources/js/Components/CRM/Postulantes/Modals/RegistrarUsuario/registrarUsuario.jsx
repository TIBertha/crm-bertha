import React, { useState } from "react";
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {isResponsive} from "../../../../Functions/General.jsx";
import {ajaxSearchUsuarios} from "./../../../../Functions/Usuarios.jsx";
import UsariosRegistradosTable from "../RegistrarUsuario/usariosRegistradosTable.jsx";

export default function RegistrarUsuario({}) {
    let conf = {title: 'Registrar Usuario a Trabajador', icon: 'fas fa-user-plus'};
    let responsive = isResponsive();
    let celdas = {label: 'col-12 col-md-3 align-self-center text-left', input: 'col-12 col-md-9', };
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1);
    const [id, setId] = useState(null);
    const [nombres, setNombres] = useState(null);
    const [apellidos, setApellidos] = useState(null);
    const [numeroDocumento, setNumeroDocumento] = useState(null);
    const [telefono, setTelefono] = useState(null);
    const [usuarios, setUsuarios] = useState([]);

    function openModal(e){
        setShow(true);
        cleanData();
    }
    function cleanData(e){
        setId(null);
        setNombres(null);
        setApellidos(null);
        setNumeroDocumento(null);
        setTelefono(null);
        setSearch(false);
    }

    function buscar(e){
        setLoading(true);
        setSearch(true);
        ajaxSearchUsuarios(id, numeroDocumento, telefono).then(r => {
            if (r.code === 200){
                setUsuarios(r.usuarios);
                setLoading(false);
            }else{
                setLoading(false);
            }
        }).catch(function (error) {
            setLoading(false);
        });
    }

    return (
        <>
            <a className={responsive == true ? 'w-100' : ''} role="button" onClick={(e) => openModal(e)}>
                <div className={('btn bertha-pink-button font-weight-bold font btn-') + (responsive == true ? 'lg w-100' : 'sm text-white')} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                    <i className={conf.icon + ' icon-question'}></i> {responsive == true && <span className='ms-2'>{conf.title}</span>}
                </div>
            </a>
            <Modal size={'xl'} show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    <section className={'main round-bg text-dark'}>
                        <div className={'row mx-0'}>
                            <div className={'col-12 col-lg-4 px-0'}>
                                <div className={'row mx-0'}>
                                    <div className={'col-6 col-lg-12'}>
                                        <strong>ID Nº</strong>
                                    </div>
                                    <div className={'col-6 col-lg-12'}>
                                        <input
                                            type="text"
                                            className="form-control no-box-shadow"
                                            name="ID"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            placeholder={'Ingrese ID'}
                                            maxLength={18}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'col-12 col-lg-4 px-0'}>
                                <div className={'row mx-0'}>
                                    <div className={'col-6 col-lg-12'}>
                                        <strong>Nº DOCUMENTO</strong>
                                    </div>
                                    <div className={'col-6 col-lg-12'}>
                                        <input
                                            type="text"
                                            className="form-control no-box-shadow"
                                            name="numeroDocumento"
                                            value={numeroDocumento}
                                            onChange={(e) => setNumeroDocumento(e.target.value)}
                                            placeholder={'Ingrese Numero Documento'}
                                            maxLength={18}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className={'col-12 col-lg-4 px-0'}>
                                <div className={'row mx-0'}>
                                    <div className={'col-6 col-lg-12'}>
                                        <strong>TELEFONO</strong>
                                    </div>
                                    <div className={'col-6 col-lg-12'}>
                                        <input
                                            type="text"
                                            className="form-control no-box-shadow"
                                            name="numeroDocumento"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            placeholder={'IngreseTelefono'}
                                            maxLength={18}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className={'my-3'}>
                        <a className={'btn btn-lg btn-block bertha-green-button no-box-shadow'}
                           onClick={(e) => buscar(e)}>
                            <i className="fas fa-search pe-2"></i>Buscar
                        </a>
                    </div>
                    {search &&
                        <section className={'main round-bg text-dark'}>
                            {(loading == true) ?
                                <section className="isLoadingArea">
                                    <i className="fas fa-sync fa-spin"></i>
                                </section>
                                :
                                <section className={'modal-table'}>
                                    {(usuarios.length !== 0) ?
                                        <section className="mb-40">
                                            <Table>
                                                <Thead className={'custom-thead'}>
                                                    <Tr className={'table-titulo pink-bg'}>
                                                        <Th className={'align-middle'} width='75%'>USUARIOS</Th>
                                                        <Th className={'align-middle'} width='25%'>ACCIONES</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    <UsariosRegistradosTable usuarios={usuarios} />
                                                </Tbody>
                                            </Table>
                                        </section>
                                        :
                                        <strong className={'m-0'}>NO HAY COINCIDENCIAS</strong>}
                                </section>
                            }
                        </section>
                    }

                </ModalBody>
            </Modal>
        </>
    )
}
