import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';

import {isResponsive} from "../../Functions/General.jsx";
import fotoEmpty from "../../../../../public/img/user_icon.svg"

export default function AdminTable({data, access, changePagination, activar, reset, eliminarUsuario}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (data.totalusuarios ? data.totalusuarios : 0) / (10) );

    function columnAcciones(userData, activar, reset) {

        let nombreUsuario = userData.nombres + ' ' + userData.apellidos;
        return (
            <>
                <Link to={'/usu-int/edit/' + userData.id} >
                    <i data-toggle="tooltip" data-placement="top" title="Editar usuario" className="fas fa-edit icon-action px-2"></i>
                </Link>
                <a onClick={(e) => activar(e, userData.id)} >
                    <i data-toggle="tooltip" data-placement="top" title="Activar/Inactivar usuario" className="fas fa-power-off icon-action px-2"></i>
                </a>

                {(access == true) &&
                    <a onClick={(e) => eliminarUsuario(e, userData.id, nombreUsuario)} >
                        <i data-toggle="tooltip" data-placement="top" title="Eliminar usuario" className="fas fa-times icon-action text-red px-2"></i>
                    </a>
                }
            </>
        );
    }

    return(
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        {responsive ? '' : <Th className="align-middle" width='6%'>N°</Th> }
                        {responsive ? '' : <Th className="align-middle" width='6%'>FOTO</Th> }
                        <Th className="align-middle" width='20%'>NOMBRE</Th>
                        <Th className="align-middle" width='16%'>TELEFONO</Th>
                        <Th className="align-middle" width='15%'>CARGO</Th>
                        <Th className="align-middle" width='10%'>ESTADO</Th>
                        <Th className="align-middle" width='10%'>ONLINE</Th>
                        <Th className="align-middle" width='17%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.usuarios.map((u,index) => {
                        return(
                            <Tr className={'table-filas hover-column'}>
                                {responsive ? '' :  <Td className={'align-middle'}>{index+1}</Td> }
                                {responsive ? '' : <Td className={'align-middle'}>{<img className="rounded" src={u.foto ? u.foto : fotoEmpty} width={40} height={40} alt={'Foto perfil usuario'}/>}</Td> }
                                <Td className={'align-middle'}>{u.nombres + ' ' + u.apellidos}</Td>
                                <Td className={'align-middle'}>{u.telefono}</Td>
                                <Td className={'align-middle'}>{u.cargo}</Td>
                                <Td className={'align-middle'}>{u.activo ? <span className="badge text-bg-success badge-dt">ACTIVO</span> : <span className="badge text-bg-dark badge-dt">INACTIVO</span>}</Td>
                                <Td className={'align-middle'}>{u.online ? <i className="fas fa-user-check icon-user-online"></i> : <i className="fas fa-user-times icon-user-offline"></i>}</Td>
                                <Td className={'align-middle'}>{columnAcciones(u, activar, reset)}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
            <div className="pt-4">
                <nav aria-label="Page navigation">
                    <ReactPaginate
                        pageCount={cantidadPaginas}
                        initialPage={ data.page ? (data.page - 1) :  0 }
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
                        onPageChange={ (p) => changePagination(p)}
                    />
                </nav>
            </div>
        </>
    )
}
