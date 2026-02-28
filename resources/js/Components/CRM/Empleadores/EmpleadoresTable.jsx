import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import "react-phone-input-2/lib/style.css";
import {isResponsive} from "../../Functions/General.jsx";
import NewCopyIcon from "../Components/newCopyIcon.jsx";
import TelefonoInternacional from "../Components/telefonoInternacional.jsx";
import ModalSetNewPassword from "./Components/modalSetNewPassword.jsx";
import EliminarEmpleador from "./Components/eliminarEmpleador.jsx";

export default function EmpleadoresTable({handleRefresh, url, empleadores, active, eliminar, linkFormRequerimiento, total, page, changePagination, paginationSearch, busqueda}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (total ? total : 0) / (responsive ? 10 : 10) );

    function columnEstatus(data){
        const badgeMap = {
            1: "text-bg-warning",
            2: "text-bg-success",
            3: "text-bg-danger",
        };

        return <span className={'badge ' + badgeMap[data.estatusid] + ' badge-dt'}>{data.estatus}</span>;
    }

    function columnAcciones(data, activo, eliminar, linkFormRequerimiento) {
        let linkcondiciones = 'Por transparencia y buenas prácticas siempre enviamos los términos y condiciones de nuestro servicio antes del pago, por favor léalos y dele "Acepto", cuando lo haga le saldrá nuestra cuenta bancaria.' + "\r\n" + "\r\n" + 'https://holabertha.com/condiciones/' + data.token;

        let tag = [];

        tag.push(<Link to={'/empleadores/edit/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className="fas fa-edit icon-action px-2"></i></Link>);

        if(data.historial){
            tag.push(<Link to={'/empleadores/contratos/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Historial de contratos" className="fas fa-file-alt icon-action px-2"></i></Link>);
        }

        tag.push(<a onClick={(e) => activo(e, data.id, data.activo)} ><i data-toggle="tooltip" data-placement="top" title={data.activo ? "Activo" : "Inactivo"} className={data.activo ? "fas fa-power-off icon-action px-2" : "fas fa-power-off icon-action icon-red px-2"}></i></a>);

        tag.push(<a className onClick={(e) => linkFormRequerimiento(e, data.id)} ><i data-toggle="tooltip" data-placement="top" title={"Link Requerimiento"} className={'fas fa-file-signature icon-action px-2 ' + (data.linkrequerimiento ? 'icon-green' : '')}></i></a>);

        if (data.token){
            tag.push(
                <NewCopyIcon copyText={data.linkaceptocondiciones} icon={'fas fa-user-'+ (data.aceptoterminos == 1 ? 'check green-neon' : 'times')} additonalClass={'icon-action-sm'} tooltipText={'Copiar link Términos y Condiciones'} successMsj={'Link TC copiado'} />
            )
        }

        tag.push(
            <ModalSetNewPassword id={data.id}/>
        );


        tag.push(
            <EliminarEmpleador idEmpleador={data.id} nombreEmpleador={data.nombrecorto ? data.nombrecorto : data.empleador} url={url} handleRefresh={handleRefresh}/>
        );

        return tag;
    }

    return(
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        <Th className="vertical-align-middle" width='13%'>EMPLEADOR</Th>
                        <Th className="vertical-align-middle" width='17%'>TELÉFONO</Th>
                        <Th className="vertical-align-middle" width='20%'>DOMICILIO (PRINCIPAL)</Th>
                        <Th className="vertical-align-middle" width='14%'>REFERENCIA</Th>
                        <Th className="vertical-align-middle" width='9%'>ESTATUS</Th>
                        <Th className="vertical-align-middle" width='17%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {empleadores.map((data,index) =>{

                        return(
                            <Tr className={'table-filas hover-column'}>
                                <Td className={'vertical-align-middle'}>
                                    <div className="row mx-0">
                                        <NewCopyIcon icon={'fas fa-user-tag'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.empleador} tooltipText={'Copiar nombre empleador'} successMsj={'Nombre empleador copiado'}/>
                                        <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={'CL ' + data.contact_name + ' ' + data.flag_emoji} tooltipText={'Copiar nombre en Google'} successMsj={'Nombre en Google copiado'}/>
                                        <div className={'col-auto px-1 nombre-empleador' + ((!data.domicilio || !data.contrato) ? ' text-red' : '')}>{data.nombrecorto ? data.nombrecorto : data.empleador }</div>
                                        {data.new == true ? <i data-toggle="tooltip" data-placement="top" title="Nuevo empleador con los TC" className="col-auto px-1 my-auto fas fa-star text-warning"></i> : null}
                                    </div>
                                </Td>
                                <Td className={'vertical-align-middle'}>
                                    <div className="row mx-0">
                                        <NewCopyIcon icon={'fas fa-mobile-alt'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.telefono} tooltipText={'Copiar teléfono empleador'} successMsj={'Teléfono empleador copiado'}/>
                                        <a className="col-auto px-1 my-auto" href={'tel:'+data.telefono}><TelefonoInternacional numero={data.tarjetaTelefono}/></a>
                                    </div>
                                </Td>
                                <Td className={'vertical-align-middle'}>
                                    {data.direccionDR ?
                                        <div className="row mx-0">
                                            <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.direccionDR + ' ' + data.distritoDR} tooltipText={'Copiar dirección'} successMsj={'Dirección copiada'}/>
                                            <div className={'col'}>{data.direccionDR + ' ' + data.distritoDR}</div>
                                        </div>
                                        :
                                        <p className="text-danger">SIN DOMICILIO</p>}
                                </Td>
                                <Td className={'vertical-align-middle'}>
                                    {data.refrenciaDR ?
                                        <div className="row mx-0">
                                            <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.refrenciaDR} tooltipText={'Copiar referencia'} successMsj={'Referencia copiada'}/>
                                            <div className={'col'}>{data.refrenciaDR}</div>
                                        </div>
                                        :
                                        <p className="text-danger">SIN REFERENCIA</p>}
                                </Td>
                                <Td className={'vertical-align-middle'}>{columnEstatus(data)}</Td>
                                <Td className={'vertical-align-middle alignVMiddle'}>{columnAcciones(data, active, eliminar, linkFormRequerimiento)}</Td>
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
                        onPageChange={ (page) => busqueda ? paginationSearch(page) : changePagination(page)}
                    />
                </nav>

            </div>
        </>
    )

}
