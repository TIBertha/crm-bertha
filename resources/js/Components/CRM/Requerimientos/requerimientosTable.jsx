import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import {isResponsive} from "../../Functions/General.jsx";
import NewCopyIcon from "../Components/newCopyIcon.jsx";
import TelefonoInternacional from "../Components/telefonoInternacional.jsx";
import ModalPostulados from "./Modals/modalPostulados.jsx";
import CopysRequerimiento from "./Modals/copysRequerimiento.jsx";
import CrearAnuncioRequerimiento from "./Modals/crearAnuncioRequerimiento.jsx";
import DuplicarRequerimiento from "./Modals/duplicarRequerimiento.jsx";

export default function RequerimientosTable({url, access, requerimientos, total, page, changePagination, paginationSearch, busqueda, changeEstadoRequerimiento, habilitarEntrevista, handleEliminarRequerimiento}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (total ? total : 0) / (responsive ? 15 : 15) );

    function columnTipoContrato(data) {
        const { tipocontratoid, tipocontrato, comprobanteadelanto, confirmacion_adelanto } = data;

        // Mapa de colores por tipo de contrato
        const contratoColors = {
            1: "text-success",
            2: "text-warning",
            3: "text-danger",
        };

        // Si no existe el tipo, no renderizamos nada
        if (!contratoColors[tipocontratoid]) return null;

        // Caso especial: tipo 1 (con ícono de monedas)
        if (tipocontratoid === 1) {
            const hasComprobanteCRM = Boolean(comprobanteadelanto);
            const hasComprobanteExterno = Boolean(confirmacion_adelanto);

            const colorCoinIcon = hasComprobanteCRM || hasComprobanteExterno
                ? "text-warning"
                : "text-secondary";

            const tooltipCoinIcon = hasComprobanteCRM
                ? "Ya pagó adelanto - Comprobante realizado por el CRM"
                : hasComprobanteExterno
                    ? "Ya pagó adelanto - Comprobante realizado por externo"
                    : "No pagó adelanto";

            return (
                <>
                <span className={`font-weight-bold ${contratoColors[1]}`}>
                    {tipocontrato}
                </span>

                    <i
                        className={'ml-1 fas fa-coins ' +colorCoinIcon}
                        data-toggle="tooltip"
                        data-placement="top"
                        title={tooltipCoinIcon}
                    />
                </>
            );
        }

        // Otros tipos (2 y 3)
        return (
            <span className={`font-weight-bold ${contratoColors[tipocontratoid]}`}>
            {tipocontrato}
        </span>
        );
    }


    function columnEstatus(data) {
        const badgeMap = {
            1: "text-bg-danger",
            2: "text-bg-success",
            3: "text-bg-dark",
            4: "text-bg-primary",
        };

        const cls = badgeMap[data.estadoid];
        if (!cls) return null;

        return (
            <span className={'badge ' + cls + ' badge-dt'}>
                {data.estado}
            </span>
        );
    }


    function columnAcciones(data, changeEstadoRequerimiento,habilitarEntrevista) {

        let estatusID = data.estadoid;

        let tag = [];

        tag.push(<Link to={'/requerimientos/edit/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className="fas fa-edit icon-action px-2"></i></Link>);

        tag.push(
            <CopysRequerimiento idReq={data.id} />
        );

        if (!responsive && estatusID === 1) {
            tag.push(
                <CrearAnuncioRequerimiento dataReq={data.data_anuncio} />
            );
        }

        tag.push(
            <DuplicarRequerimiento url={url} idRequerimiento={data.id} />
        );

        [1,4].includes(estatusID) ? tag.push(<a onClick={(e) => changeEstadoRequerimiento(e, data.id, 3)} ><i data-toggle="tooltip" data-placement="top" title="Desistir" className="fas fa-trash-alt icon-action px-2"></i></a>) : '';

        [3].includes(estatusID) ? (data.distrito ? (tag.push(<a onClick={(e) => changeEstadoRequerimiento(e, data.id,1)} ><i data-toggle="tooltip" data-placement="top" title="Pendiente" className="fas fa-hourglass-end icon-action px-2"></i></a>) ) : '' ) : '';

        if (data.estadoid === 1) {
            const isActive = Boolean(data.disponibleentrevista);

            tag.push(
                <a
                    className="col-auto px-0"
                    onClick={(e) => habilitarEntrevista(e, data.id, isActive)}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={(isActive ? 'Desactivar' : 'Activar') + ' publicación'}
                >
                    <i className={'fas ' + (isActive ? 'fa-toggle-on text-success' : 'fa-toggle-off text-secondary') + ' icon-action px-2'}/>
                </a>
            );
        }


        tag.push(
            <a onClick={(e) => handleEliminarRequerimiento(e, data.id)} >
                <i data-toggle="tooltip" data-placement="top" title="Eliminar" className="fas fa-times icon-action text-red px-2"></i>
            </a>
        )

        return tag;

    }

    return (
        <>
            <Table className={'table-white'}>
                <Thead>

                    <Tr className={'table-titulo pink-bg'}>
                        <Th className="vertical-align-middle" width='4%'>{responsive ? 'PROCEDENCIA DEL PEDIDO' : null}</Th>
                        <Th className="vertical-align-middle" width='6%'>{responsive ? 'DETALLES' : null}</Th>
                        <Th className="vertical-align-middle" width='6%'>ENTREVISTA</Th>

                        <Th className="vertical-align-middle" width='14%'>EMPLEADOR / TELEFONO</Th>
                        <Th className="vertical-align-middle" width='10%'>ACTIVIDAD / MODALIDAD</Th>
                        <Th className="vertical-align-middle" width='14%'>DISTRITO / NACIONALIDAD / EDADES</Th>
                        <Th className="vertical-align-middle" width='12%'>TIPO BENEFICIO / COMISION</Th>
                        <Th className="vertical-align-middle" width='8%'>SUELDO</Th>
                        <Th className="vertical-align-middle" width='8%'>TIPO CONTRATO</Th>
                        <Th className="vertical-align-middle" width='8%'>ESTADO</Th>
                        <Th className="vertical-align-middle" width='12%'>ACCIONES</Th>
                    </Tr>

                </Thead>
                <Tbody>

                    {requerimientos.map((data,index) =>{

                        let postulados = data.postulados;
                        let m = 25 + 'px';
                        let paisData = data.pais_pedido;

                        return(
                            <Tr className={'table-filas hover-column'}>
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
                                <Td className={'notificacionPostulante-badge vertical-align-middle text-center' + (responsive ? '' : ' p-0 my-auto')}>

                                    {parseInt(postulados) > 0 ?
                                        <ModalPostulados idReq={data.id} empleador={data.empleador} postuladosCantidad={postulados}/>
                                        :
                                        <>
                                            {responsive ?
                                                <div className='notificacionPostulante-button-cero'>
                                                    <span className='badge badge-light notificacionPostulante-mobileBadge mr-1'>0</span> Postulados <i className='fas fa-user ml-1'></i>
                                                </div>
                                                :
                                                <i className="fas fa-user-slash notificacionPostulante-cero"></i>
                                            }
                                        </>
                                    }

                                </Td>

                                <Td className={'vertical-align-middle'}>{data.fechaentrevista + ' ' + data.horaentrevista}</Td>

                                <Td className={'vertical-align-middle'}>
                                    <div className="row mx-0">
                                        <NewCopyIcon icon={'fas fa-user-tag'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.empleador_contact_data.nombres} tooltipText={'Copiar nombre empleador'} successMsj={'Nombre empleador copiado'}/>
                                        <NewCopyIcon icon={'fas fa-copy'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={'CL ' + data.empleador_contact_data.nombres + ' ' + data.empleador_contact_data.flag_emoji } tooltipText={'Copiar nombre en Google'} successMsj={'Nombre en google copiado'}/>
                                        <div className={"col-auto px-1 my-auto " + ((data.isdataempleador && data.estatusempleadorid == 2) ? '' : 'text-red') }>{data.empleador}</div>
                                    </div>
                                    <div className="row mx-0">
                                        <a className="col-auto px-1 my-auto" href={'tel:' + data.empleador_contact_data.telefono}><TelefonoInternacional numero={data.empleador_contact_data.telefono} paddingLeft={true} /></a>
                                        <NewCopyIcon icon={'fas fa-mobile-alt'} additonalClass={'col-auto px-1 my-auto icon-action align-self-center'} copyText={data.empleador_contact_data.telefono} tooltipText={'Copiar teléfono empleador'} successMsj={'Teléfono empleador copiado'}/>
                                    </div>
                                </Td>

                                <Td className={'vertical-align-middle'}>
                                    <p>{data.actividad}</p>
                                    <p>{data.modalidad}</p>
                                </Td>

                                <Td className={'vertical-align-middle'}>
                                    <p>{data.distrito}</p>
                                    <p>{data.nacionalidad}</p>
                                    <p>{data.edades}</p>

                                </Td>
                                <Td className={'vertical-align-middle'}><span>{data.tipobeneficio + ' / '}</span><span className={'font-weight-bold'}>{'COMISION ' + (data.tipocomision ? (data.tipocomision + ' (' + data.divisa + ' ' + data.monto_comision + ')') : 'NO TIENE')}</span></Td>
                                <Td className={'vertical-align-middle'}> <span data-toggle="tooltip" data-placement="bottom" title={data.tooltip_divisa}>{ data.divisa + ' ' + data.sueldo}</span> {data.newTerms1711 == true ? <i data-toggle="tooltip" data-placement="top" title="Nuevo requerimiento con los TC" className="fas fa-star text-warning"></i> : null} </Td>
                                <Td className={'vertical-align-middle'}>{columnTipoContrato(data)}</Td>
                                <Td className={'vertical-align-middle'}>{columnEstatus(data)}</Td>
                                <Td className={'vertical-align-middle'}>{columnAcciones(data, changeEstadoRequerimiento, habilitarEntrevista)}</Td>
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
    );

}
