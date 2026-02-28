import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';

import {isResponsive} from "../../Functions/General.jsx";
import {str_limit} from "../../Helpers/strings.js";

export default function PrensaTable({url, blogs, total, page, changePagination, active, prensa, borrar, contadorDecimal}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (total ? total : 0) / (responsive ? 10 : 10) );

    return (
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        {responsive ? '' : <Th className={'align-middle'} width='5%'>N°</Th>}
                        <Th className={'align-middle'} width='10%'>FECHA</Th>
                        <Th className={'align-middle'} width='25%'>TITULO</Th>
                        <Th className={'align-middle'} width='15%'>AUTOR</Th>
                        <Th className={'align-middle'} width='12%'>MEDIO</Th>
                        <Th className={'align-middle'} width='8%'>PRENSA</Th>
                        <Th className={'align-middle'} width='10%'>ESTADO</Th>
                        <Th className={'align-middle'} width='15%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {blogs.map((data,index) =>{

                        return(
                            <Tr className={'table-filas hover-column'}>
                                {responsive ? '' : <Td className={'align-middle'}>{contadorDecimal + (index + 1)}</Td>}
                                <Td className={'align-middle'}>{data.fecha}</Td>
                                <Td className={'align-middle'}>{str_limit(data.titulo, 66)}</Td>
                                <Td className={'align-middle'}>{data.autor}</Td>
                                <Td className={'align-middle'}>{data.medio}</Td>
                                <Td className={'align-middle'}>{data.prensa ? <i className="fas fa-star icon-star"></i> : '-'}</Td>
                                <Td className={'align-middle'}>{data.activo ? <span className="badge text-bg-success badge-dt">ACTIVO</span> : <span className="badge text-bg-dark badge-dt">INACTIVO</span>}</Td>
                                <Td className={'align-middle'}>

                                    <Link to={'/prensa/edit/' + data.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className="fas fa-edit icon-action px-2"></i></Link>
                                    <a onClick={(e) => active(e, data.id)} ><i data-toggle="tooltip" data-placement="top" title="Activar/Inactivar Artículo" className="fas fa-power-off icon-action px-2"></i></a>
                                    <a onClick={(e) => prensa(e, data.id)} ><i data-toggle="tooltip" data-placement="top" title="Artículo en Prensa" className="far fa-newspaper icon-action px-2"></i></a>
                                    <a onClick={(e) => borrar(e, data.id)} ><i data-toggle="tooltip" data-placement="top" title="Borrar Artículo" className="fas fa-trash icon-action icon-red px-2"></i></a>

                                </Td>
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
                        onPageChange={ (page) => changePagination(page)}
                    />
                </nav>

            </div>


        </>
    );

}
