import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

export default function HistorialBajas({ historialbajas }) {
    return (
        <>
            {historialbajas && (
                <section className="mb-40 mx-3">
                    <Table>
                        <Thead>
                            <Tr className={"table-titulo pink-bg"}>
                                <Th className={"align-middle"} width="10%">
                                    FECHA
                                </Th>
                                <Th className={"align-middle"} width="18%">
                                    MOTIVO / TIPO BAJA
                                </Th>
                                <Th className={"align-middle"} width="10%">
                                    DURACIÓN
                                </Th>
                                <Th className={"align-middle"} width="10%">
                                    FECHA INICIO
                                </Th>
                                <Th className={"align-middle"} width="10%">
                                    FECHA FIN
                                </Th>
                                <Th className={"align-middle"} width="17%">
                                    ESTADO
                                </Th>
                                <Th className={"align-middle"} width="25%">
                                    ACCIONES
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {historialbajas.map((histBaj, key) => {
                                const [view, setView] = useState(1);
                                const [montoPagado, setMontoPagado] =
                                    useState(20);
                                const [pagado, setPagado] = useState(false);

                                let culminado = {
                                    icon: "times-circle",
                                    coloIcon: "red",
                                };

                                if (historialbajas) {
                                    culminado.color = "text-success";
                                    culminado.icon = "check-circle";
                                    culminado.coloIcon = "green-dark";
                                }

                                let fieldProps = {
                                    text: "",
                                    color: "",
                                    icon: "",
                                    tooltip: "",
                                };

                                if (histBaj.pagado) {
                                    fieldProps.color = "text-success";
                                    fieldProps.text =
                                        "PAGADO (S/. " +
                                        histBaj.monto_pagado +
                                        ")";
                                    fieldProps.icon = "fas fa-check-circle";
                                    fieldProps.tooltip =
                                        "Pago el monto respectivamente";
                                } else {
                                    if (pagado) {
                                        fieldProps.color = "text-success";
                                        fieldProps.text =
                                            "PAGADO (S/. " + montoPagado + ")";
                                        fieldProps.icon = "fas fa-check-circle";
                                        fieldProps.tooltip =
                                            "Pago el monto respectivamente";
                                    } else {
                                        fieldProps.color = "text-danger";
                                        fieldProps.text = "NO PAGADO";
                                        fieldProps.icon = "fas fa-times-circle";
                                        fieldProps.tooltip =
                                            "Debe pagar el monto";
                                    }
                                }

                                const [tbMsjText, setTbMsjText] = useState("");
                                const [tbMsjColor, setTbMsjColor] =
                                    useState("");
                                const [tbMsjIcon, setTbMsjIcon] = useState("");

                                function updatePagoBaja(e) {
                                    setView(0);
                                    ajaxUpdatePagoBaja(histBaj.id, montoPagado)
                                        .then((r) => {
                                            if (r.code === 200) {
                                                setPagado(true);
                                                setView(3);
                                                setTbMsjText(
                                                    "Transacción realizada",
                                                );
                                                setTbMsjColor("text-success");
                                                setTbMsjIcon(
                                                    "fas fa-check-circle",
                                                );

                                                setTimeout(function () {
                                                    setView(5);
                                                }, 1250);
                                            } else {
                                                setPagado(false);
                                                setView(3);
                                                setTbMsjText(
                                                    "Transacción no realizada",
                                                );
                                                setTbMsjColor("text-danger");
                                                setTbMsjIcon(
                                                    "fas fa-times-circle",
                                                );

                                                setTimeout(function () {
                                                    setView(2);
                                                }, 1250);
                                            }
                                        })
                                        .catch(function (error) {
                                            setPagado(false);
                                            setView(3);
                                            setTbMsjText(
                                                "Transacción no realizada",
                                            );
                                            setTbMsjColor("text-danger");
                                            setTbMsjIcon("fas fa-times-circle");

                                            setTimeout(function () {
                                                setView(2);
                                            }, 1250);
                                        });
                                }

                                function viewsAcciones() {
                                    function avedView(e, viewSet) {
                                        setView(0);

                                        setTimeout(function () {
                                            setView(viewSet);
                                        }, 750);
                                    }

                                    if (view == 0) {
                                        return (
                                            <div
                                                className={"w-100 text-center"}
                                            >
                                                <i className="fas fa-sync fa-spin"></i>
                                            </div>
                                        );
                                    }

                                    if (view == 1) {
                                        return (
                                            <a
                                                className={
                                                    "btn btn-sm btn-green-webexperta"
                                                }
                                                onClick={(e) => avedView(e, 2)}
                                            >
                                                COBRAR
                                            </a>
                                        );
                                    }
                                    if (view == 2) {
                                        return (
                                            <div
                                                class={"input-button-container"}
                                            >
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control fc-modal"
                                                    }
                                                    name="montoPagado"
                                                    value={montoPagado}
                                                    onChange={(e) =>
                                                        setMontoPagado(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Monto a pagar"
                                                />
                                                <a
                                                    className={
                                                        "btn btn-sm btn-green-webexperta"
                                                    }
                                                    onClick={(e) =>
                                                        updatePagoBaja(e)
                                                    }
                                                >
                                                    PAGAR
                                                </a>
                                                <a
                                                    className={
                                                        "btn btn-sm btn-warning"
                                                    }
                                                    onClick={(e) =>
                                                        avedView(e, 1)
                                                    }
                                                >
                                                    REGRESAR
                                                </a>
                                            </div>
                                        );
                                    }
                                    if (view == 3) {
                                        return (
                                            <strong className={tbMsjColor}>
                                                {tbMsjText}{" "}
                                                <i
                                                    className={
                                                        tbMsjIcon + " mr-2"
                                                    }
                                                ></i>
                                            </strong>
                                        );
                                    }
                                    if (view == 5) {
                                        return <div></div>;
                                    }
                                }

                                return (
                                    <Tr className={"table-filas hover-column"}>
                                        <Td className={"align-middle"}>
                                            {histBaj.creado_format}
                                        </Td>
                                        <Td className={"align-middle"}>
                                            {histBaj.bajanombre +
                                                " (" +
                                                histBaj.tipobajanombre +
                                                ")"}
                                        </Td>
                                        <Td className={"align-middle"}>
                                            {histBaj.penalizacion_dias == 0
                                                ? "PERMANENTE"
                                                : histBaj.penalizacion_dias +
                                                  " DIAS"}
                                        </Td>
                                        <Td className={"align-middle"}>
                                            {histBaj.fecha_inicio_sancion_format
                                                ? histBaj.fecha_inicio_sancion_format
                                                : " - "}
                                        </Td>
                                        <Td className={"align-middle"}>
                                            {histBaj.fecha_fin_sancion_format
                                                ? histBaj.fecha_fin_sancion_format
                                                : " - "}
                                        </Td>
                                        <Td className={"align-middle"}>
                                            <strong
                                                className={fieldProps.color}
                                            >
                                                {fieldProps.text}
                                            </strong>
                                        </Td>
                                        <Td className={"align-middle"}>
                                            {!histBaj.pagado && viewsAcciones()}
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </section>
            )}
        </>
    );
}
