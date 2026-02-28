import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';

import {isResponsive} from "../../Functions/General.jsx";

export default function ReclamosTable({url, reclamos, total, page, changePagination, atendido}) {
    let responsive = isResponsive();

    let cantidadPaginas = Math.ceil((total ? total : 0) / (responsive ? 10 : 10));

    return(
        <>
            <Table className={"table-white"}>
                <Thead>
                    <Tr className={"table-titulo pink-bg"}>
                        <Th className={"align-middle"} width="15%">FECHA DE QUEJA</Th>
                        <Th className={"align-middle"} width="17%">DÍAS RESTANTES</Th>
                        <Th className={"align-middle"} width="20%">NOMBRE</Th>
                        <Th className={"align-middle"} width="10%">TELEFONO</Th>
                        <Th className={"align-middle"} width="15%">CORREO</Th>
                        <Th className={"align-middle"} width="8%">ESTADO</Th>
                        <Th className={"align-middle"} width="15%">ACCIONES</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reclamos.map((data, index) => {
                        let estado = data.estado;
                        let tooltipButton = "";
                        let styleButton = "";

                        if (estado == 1) {
                            tooltipButton = "Reclamo atendido";
                            styleButton =
                                "fas fa-check icon-action icon-green px-2";
                        } else {
                            tooltipButton = "Cambiar estado a ATENDIDO";
                            styleButton =
                                "fas fa-check icon-action icon-gray px-2";
                        }

                        let estiloDiasRestantes = "";

                        if (
                            data.diasRestantes >= 18 &&
                            data.diasRestantes <= 30
                        ) {
                            estiloDiasRestantes = "text-success";
                        } else if (
                            data.diasRestantes >= 10 &&
                            data.diasRestantes <= 17
                        ) {
                            estiloDiasRestantes = "text-warning";
                        } else if (
                            data.diasRestantes >= 0 &&
                            data.diasRestantes <= 9
                        ) {
                            estiloDiasRestantes = "text-danger";
                        } else if (data.diasRestantes == "-") {
                            estiloDiasRestantes = "text-secondary";
                        } else {
                            estiloDiasRestantes = "text-dark";
                        }

                        return (
                            <Tr className={"table-filas hover-column"}>
                                <Td className={"align-middle"}>{data.fecha}</Td>

                                <Td className={"align-middle font-weight-bold"}>
                                    {data.estado == 0 ? (
                                        <label className={estiloDiasRestantes}>
                                            {data.diasRestantes != "-"
                                                ? data.diasRestantes +
                                                (data.diasRestantes != 1
                                                    ? " días"
                                                    : "día")
                                                : data.diasRestantes}
                                        </label>
                                    ) : (
                                        <label>{"-"}</label>
                                    )}
                                </Td>

                                <Td className={"align-middle"}>{data.nombre}</Td>
                                <Td className={"align-middle"}>{data.telefono}</Td>
                                <Td className={"align-middle"}>{data.correo}</Td>
                                <Td className={"align-middle"}>
                                    {data.estado ? (
                                        <span className="badge badge-success badge-dt">
                                            Atendido
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger badge-dt">
                                            Por atender
                                        </span>
                                    )}
                                </Td>
                                <Td className={"align-middle"}>
                                    <Link to={"/reclamos/edit/" + data.id}>
                                        <i
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Editar"
                                            className="fas fa-edit icon-action px-2"
                                        ></i>
                                    </Link>

                                    {data.estado == 0 && (
                                        <a onClick={(e) => atendido(e, data.id)}>
                                            <i
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={tooltipButton}
                                                className={styleButton}
                                            ></i>
                                        </a>
                                    )}

                                    {data.estado == 1 && (
                                        <i
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={tooltipButton}
                                            className={styleButton}
                                        ></i>
                                    )}
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
                        initialPage={page ? page - 1 : 0}
                        forcePage={page ? page - 1 : 0}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        previousLabel={"Previo"}
                        nextLabel={"Siguiente"}
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
                        onPageChange={(page) => changePagination(page)}
                    />
                </nav>
            </div>
        </>
    )
}
