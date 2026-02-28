import React, {useState} from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';

import {isResponsive} from "../../Functions/General.jsx";
import {firstNamePost} from "../../Helpers/strings.js";
import NewCopyIcon from "../Components/newCopyIcon.jsx";
import ModalContratosDetalles from "./Components/modalContratosDetalles.jsx";
import CambiarEstadoContrato from "./Modals/cambiarEstadoContrato.jsx";
import CopyContratos from "./Modals/copyContratos.jsx";

export default function ContratosTable({url, setVerifIngreso, contratos, total, page, changePagination, finalizar, reenviarMail, paginationSearch, busqueda}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (total ? total : 0) / (responsive ? 10 : 10) );

    function findColumnTrabajador(data) {

        return (
            <div className="row mx-0">
                <NewCopyIcon icon={'fas fa-user-tag'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={data.trabajador_contact_data.nombres} tooltipText={'Copiar nombre trabajador'} successMsj={'Nombre trabajador copiado'} />
                <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={'PO ' + data.trabajador_contact_data.nombres + ' ' + data.trabajador_contact_data.flag_emoji } tooltipText={'Copiar nombre trabajador en Google'} successMsj={'Nombre trabajador para Google Copiado'} />
                <div className={'col-auto px-1 my-auto ' + (data.verif_ingreso == 1 ? '' : 'text-danger')}>{data.trabajador_contact_data.short_name}</div>
                <NewCopyIcon icon={'fas fa-mobile-alt'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={data.trabajador_contact_data.telefono_whatsapp} tooltipText={'Copiar teléfono trabajador'} successMsj={'Teléfono trabajador copiado'} />
            </div>
        );
    }

    function findColumnTrabajadorBC(trabajador_contact_data, tipo) {
        if (trabajador_contact_data){
            if (trabajador_contact_data.exist == true){
                return (
                    <div className="row mx-0">
                        <NewCopyIcon icon={'fas fa-user-tag'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={trabajador_contact_data.nombres} tooltipText={'Copiar nombre trabajador ' + tipo} successMsj={'Nombre trabajador ' + tipo + ' copiado'}/>
                        <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={'PO ' + trabajador_contact_data.nombres + ' ' + trabajador_contact_data.flag_emoji } tooltipText={'Copiar nombre trabajador ' + tipo + ' en Google'} successMsj={'Nombre trabajador ' + tipo + ' en Google copiado'}/>
                        <div className={'col-auto px-1 my-auto'}>{trabajador_contact_data.short_name}</div>
                        <NewCopyIcon icon={'fas fa-mobile-alt'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={trabajador_contact_data.telefono_whatsapp} tooltipText={'Copiar teléfono trabajador ' + tipo} successMsj={'teléfono trabajador ' + tipo + ' copiado'} />
                    </div>
                );
            }else{
                return (
                    <div className={'row mx-0 text-danger'}>
                        <div className={'col-auto px-1 my-auto'}>{'El trabajador id: ' + trabajador_contact_data.id + ' fue eliminado de la base de datos'}</div>
                    </div>
                )
            }

        }else{
            return (<div>{'-'}</div>)
        }
    }

    function findColumnEstatus(data) {
        let estado = '';

        if(data.anulado){
            estado = <p className="badge badge-dark badge-dt">Anulado</p>;
        }else{
            if(data.culminado){
                estado = <p className="badge badge-danger badge-dt">Culminado {data.diasrestantes <= 0 ? <i className="fas fa-clock"></i> : ''}</p>;
            }else{
                estado = <p className="badge badge-success badge-dt">Vigente {data.diasrestantes <= 0 ? <i className="fas fa-clock"></i> : ''}</p>;
            }
        }

        return estado;
    }

    function columnAcciones(data, finalizar) {

        let anulado = data.anulado;
        let culminado = data.culminado;

        let tag = [];

        if(culminado == false && anulado == false){
            tag.push(<Link to={'/contratos/edit/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className={'fas fa-edit icon-action-sm px-2'}></i></Link>);
        }else{
            tag.push(<Link to={'/contratos/show/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className={'fas fa-edit icon-action-sm px-2'}></i></Link>);
        }

        tag.push(
            <CopyContratos idCont={data.id} />
        );

        tag.push(
            <CambiarEstadoContrato idContrato={data.id} url={url} />
        );

        if( (culminado == false && anulado == false) && data.estatus_req != 1 ){
            tag.push(<a onClick={(e) => finalizar(e, data.id)} ><i data-toggle="tooltip" data-placement="top" title="Culminar contrato" className={'fas fa-trash-alt icon-action-sm px-2'}></i></a>);
        }

        tag.push(
            <>
                {data.data_trabajador.antecedentes_pdf ?
                    <>
                        {data.data_trabajador.numeroDocumento ?
                            <i data-toggle="tooltip" data-placement="top" title={'Tiene certificado único laboral'} className="fas fa-portrait text-success px-2"></i>
                            :
                            <i data-toggle="tooltip" data-placement="top" title={'No cuenta con certificado único laboral'} className="fas fa-portrait text-secondary px-2"></i>
                        }
                    </>
                    :
                    <>
                        {data.data_trabajador.tiene_cuenta != 0 ?
                            <i data-toggle="tooltip" data-placement="top" title={(firstNamePost(data.data_trabajador.nombres) + ' tiene una cuenta registrada. Solicitar su certificado único laboral')} className="fas fa-portrait text-warning px-2"></i>
                            :
                            <>
                                {[2].includes(data.data_trabajador.certificado_antecedente) ?
                                    <i data-toggle="tooltip" data-placement="top" title={'Tiene reporte Mak Consulting'} className="fas fa-file-user text-success px-2"></i>
                                    :
                                    <i data-toggle="tooltip" data-placement="top" title={'No cuenta con antecedentes'} className="fas fa-portrait text-secondary px-2"></i>
                                }
                            </>
                        }
                    </>
                }
            </>
        )

        return tag;

    }

    return (
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        <Th className="vertical-align-middle" width='5%'>{responsive ? 'DETALLES' : null}</Th>
                        <Th className="vertical-align-middle" width='5%'>PAIS</Th>
                        <Th className="vertical-align-middle" width='8%'>FECHA</Th>
                        <Th className="vertical-align-middle" width='10%'>EMPLEADOR</Th>
                        <Th className="vertical-align-middle" width='10%'>TRABAJADOR (A)</Th>
                        <Th className="vertical-align-middle" width='9%'>TRABAJADOR (B)</Th>
                        <Th className="vertical-align-middle" width='9%'>TRABAJADOR (C)</Th>
                        <Th className="vertical-align-middle" width='12%'>INGRESO</Th>
                        <Th className="vertical-align-middle" width='8%'>INICIO LAB.</Th>
                        <Th className="vertical-align-middle" width='6%'>TIPO</Th>
                        <Th className="vertical-align-middle" width='7%'>ESTADO</Th>
                        <Th className="vertical-align-middle" width='11%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {contratos.map((data,index) =>{

                        const [verificadorIngreso, setVerificadorIngreso] = useState(data.verif_ingreso);
                        let switchClassName= 'col-12 col-md text-center option-action font-weight-bold px-2';

                        function changeEstatusAsistencia(e, condition) {
                            setVerificadorIngreso(condition);
                            setVerifIngreso(e, data.id, condition);
                        }

                        let m = 25 + 'px';
                        let paisData = data.pais_pedido;

                        return(
                            <Tr className={'table-filas hover-column'}>
                                <Td className={'vertical-align-middle text-center' + (responsive ? '' : ' p-0 my-auto ')}>
                                    <ModalContratosDetalles idCont={data.id}/>
                                </Td>
                                <Td className={'vertical-align-middle'}>
                                    {paisData ?
                                        <>
                                            {responsive ?
                                                <span className={'font-weight-700'}>{paisData.name}</span>
                                                :
                                                <span
                                                    className={'flag-icon flag-icon-' + (paisData.code) +' flag-icon-squared flag-style'}
                                                    style={{width: m,height: m, backgroundSize: '' + m + ' ' + m + ''}}
                                                    data-toggle="tooltip" data-placement="bottom" title={paisData.name}>
                                                </span>
                                            }
                                        </>
                                        :
                                        ''
                                    }
                                </Td>
                                <Td className={'vertical-align-middle'}>{data.creado}</Td>
                                <Td className={'vertical-align-middle'}>
                                    <div className="row mx-0">
                                        <NewCopyIcon icon={'fas fa-user-tag'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={data.empleador_contact_data.nombres} tooltipText={'Copiar nombre empleador'} successMsj={'Nombre empleador copiado'} />
                                        <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={'CL ' + data.empleador_contact_data.nombres + ' ' + data.empleador_contact_data.flag_emoji } tooltipText={'Copiar nombre empleador en Google'} successMsj={'Nombre empleador en Google copiado'} />
                                        <div className={"col-auto px-1 my-auto"}>{data.empleador}</div>
                                        <NewCopyIcon icon={'fas fa-mobile-alt'} additonalClass={'col-auto px-1 my-auto icon-action-sm align-self-center'} copyText={data.empleador_contact_data.telefono} tooltipText={'Copiar teléfono empleador'} successMsj={'Teléfono empleador copiado'}/>
                                    </div>
                                </Td>
                                <Td className={'vertical-align-middle'}>{findColumnTrabajador(data)}</Td>
                                <Td className={'vertical-align-middle ' + (data.trabajador_b_contact_data ? '' : 'text-center')}>{findColumnTrabajadorBC(data.trabajador_b_contact_data, 'B')}</Td>
                                <Td className={'vertical-align-middle ' + (data.trabajador_c_contact_data ? '' : 'text-center')}>{findColumnTrabajadorBC(data.trabajador_c_contact_data, 'C')}</Td>

                                <Td className={'vertical-align-middle align-switch'}>
                                    <div className={'switch-side-area-purple'}>
                                        <div className="row mx-0 justify-content-center">
                                            <div className={switchClassName + (verificadorIngreso == 1 ? ' checked-green' : '')} onClick={(e) => ( verificadorIngreso == 0 ? changeEstatusAsistencia(e, 1) : null)} >{'SI'}</div>
                                            <div className={switchClassName + (verificadorIngreso == 0 ? ' checked-purple' : '')} onClick={(e) => ( verificadorIngreso == 1 ? changeEstatusAsistencia(e, 0) : null)}>{'NO'}</div>
                                        </div>
                                    </div>
                                </Td>

                                <Td className={'vertical-align-middle'}>{data.fecha_ini_lab + ' ' + data.hora_ini_lab}</Td>
                                <Td className={'vertical-align-middle'}>{data.tipo_contrato}</Td>
                                <Td className={'vertical-align-middle'}>{findColumnEstatus(data)}</Td>
                                <Td className={'vertical-align-middle'}>{columnAcciones(data, finalizar, reenviarMail)}</Td>
                            </Tr>
                        );
                    })}

                </Tbody>
            </Table>

            <div className="pt-4">

                <nav aria-label="Page navigation">
                    <ReactPaginate
                        pageCount={cantidadPaginas}
                        initialPage={ page ? (page - 1) :  0 }
                        forcePage={page ? (page - 1) :  0}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        previousLabel={'Previo'}
                        nextLabel={'Siguiente'}
                        containerClassName="pagination pagination-sm pagination-seleccion no-box-shadow"
                        breakClassName="page-item no-box-shadow"
                        breakLinkClassName="page-link no-box-shadow"
                        pageClassName="page-item no-box-shadow"
                        previousClassName="page-item no-box-shadow"
                        nextClassName="page-item no-box-shadow"
                        pageLinkClassName="page-link no-box-shadow"
                        previousLinkClassName="page-link no-box-shadow"
                        nextLinkClassName="page-link no-box-shadow"
                        activeClassName="active no-box-shadow"
                        disableInitialCallback={true}
                        onPageChange={ (p) => busqueda ? paginationSearch(p) : changePagination(p)}
                    />
                </nav>

            </div>


        </>
    )
}
