import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReactPaginate from 'react-paginate';
import {Link} from "react-router-dom";

import {isResponsive} from "../../Functions/General.jsx";
import {getPrimerNombre} from "../../Helpers/strings.js";

export default function TestimonialesTrabajadorTable({data,changePagination, active}) {

    let access = data.access;

    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil( (data.totaltestimoniales ? data.totaltestimoniales : 0) / (responsive ? 10 : 10) );

    return (
        <>
            <Table className={'table-white'}>
                <Thead>
                    <Tr className={'table-titulo pink-bg'}>
                        {responsive ? '' : <Th className="align-middle"  width='5%'>N°</Th>}
                        <Th className="align-middle"  width='8%'>FECHA</Th>
                        <Th className="align-middle"  width='9%'>TRABAJADOR</Th>
                        <Th className="align-middle"  width='7%'>AUTOR</Th>
                        <Th className="align-middle"  width='11%'>VISIBILIDAD</Th>
                        <Th className="align-middle"  width='9%'>ESTADO</Th>
                        <Th className="align-middle"  width='11%'>ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>

                    {data.testimoniales.map((t,index) =>{
                        let activo = t.activo;
                        let estado = '';
                        let tooltipButton = '';
                        let styleButton = '';

                        if(activo == 1){
                            estado = <span className="badge text-bg-success badge-dt">ACTIVO</span>;
                            tooltipButton = 'Inactivar Testimonial';
                            styleButton = 'fas fa-power-off icon-action px-2';
                        }else{
                            estado = <span className="badge text-bg-dark badge-dt">INACTIVO</span>;
                            tooltipButton = 'Activar Testimonial';
                            styleButton = 'fas fa-power-off icon-action icon-red px-2';
                        }

                        return(
                            <Tr className={'table-filas hover-column'}>
                                {responsive ? '' : <Td className={'align-middle'}>{data.contadorDecimal + (index + 1)}</Td>}
                                <Td className={'align-middle'}>{t.fecha}</Td>
                                <Td className={'align-middle'}>{t.trabajador}</Td>
                                <Td className={'align-middle'}>{t.usuariointerno_nombres ? getPrimerNombre(t.usuariointerno_nombres) : '-'}</Td>
                                <Td className={'align-middle'}>
                                    {t.disp_pe == true ? <label className={'label-pe'}>Perú</label> : null}
                                    {t.disp_mx == true ? <label  className={'label-mx'}>México</label> : null}
                                </Td>
                                <Td className={'align-middle'}>{estado}</Td>
                                <Td className={'align-middle'}>

                                    <Link to={'/testimoniales-trabajador/edit/' + t.id} ><i data-toggle="tooltip" data-placement="top" title="Editar" className="fas fa-edit icon-action px-2"></i></Link>

                                    {(access == true) &&
                                        <a onClick={(e) => active(e, t.id, t.activo)} ><i data-toggle="tooltip" data-placement="top" title={tooltipButton} className={styleButton}></i></a>
                                    }

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
                        onPageChange={ (page) => changePagination(page)}
                    />
                </nav>

            </div>


        </>
    );

}
