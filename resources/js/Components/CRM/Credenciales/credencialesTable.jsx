import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';

import {isResponsive} from "../../Functions/General.jsx";

import CopyCredencial from "./Components/copyCredencial.jsx";

function columnAcciones(c, eliminar, access){
    return <>

        <a href={c.link_plataforma} target={'_blank'} className={'px-2'} >
            <span className="badge badge-purple-bertha-p text-white">
                <i data-toggle="tooltip" data-placement="top" title="Ingresar a plataforma" className="fas fa-sign-in-alt mr-2"></i>Ir
            </span>
        </a>

        {access == true &&
            <>
                <Link to={'/credenciales/edit/' + c.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className="fas fa-edit icon-action px-2"></i></Link>

                <a onClick={(e) => eliminar(e, c.id)} ><i data-toggle="tooltip" data-placement="top" title="Eliminar" className="fas fa-times icon-action text-red"></i></a>
            </>
        }
    </>;
}

export default function CredencialesTable({data, paginationSearch, changePagination, eliminar}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (data.totalcredenciales ? data.totalcredenciales : 0) / (responsive ? 10 : 10) );

    return(
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        <Th className="align-middle" width='20%'>PLATAFORMA</Th>
                        <Th className="align-middle" width='25%'>USUARIO</Th>
                        <Th className="align-middle" width='25%'>CONTRASEÑA</Th>
                        <Th className="align-middle" width='15%'>VISUALIZACIÓN</Th>
                        <Th className="align-middle" width='15%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.credenciales.map((c, key) =>{
                        let icon = {access: '', tooltip: ''};

                        if (c.nivel_credencial == 1){
                            icon.access = 'fas fa-users text-success';
                            icon.tooltip = 'Todos pueden visualizarlo';
                        }else{
                            icon.access = 'fas fa-user text-secondary';
                            icon.tooltip = 'Restringido';
                        }

                        return(
                            <Tr className={'table-filas hover-column'}>
                                <Td className={'align-middle'}><strong>{c.nombre_plataforma}</strong></Td>
                                <Td className={'align-middle'}><CopyCredencial copyText={c.usuario} colorStyle={'purple'} /></Td>
                                <Td className={'align-middle'}><CopyCredencial copyText={c.contra} colorStyle={'pink'} /></Td>
                                <Td className={'align-middle text-center'}>{<i className={'icon-action ' + icon.access} data-toggle="tooltip" data-placement="top" title={icon.tooltip}></i>}</Td>
                                <Td className={'align-middle'}>{columnAcciones(c, eliminar, data.access)}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <div className="pt-4">
                <nav aria-label="Page navigation">
                    <ReactPaginate
                        pageCount={cantidadPaginas}
                        initialPage={data.page ? (data.page - 1) :  0 }
                        forcePage={data.page ? (data.page - 1) :  0}
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
                        onPageChange={ (p) => data.busqueda ? paginationSearch(p) : changePagination(p)}
                    />
                </nav>
            </div>
        </>
    );
}

