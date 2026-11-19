import React from "react";
import { isResponsive } from "../../Functions/General";
import ModalHistorialContactoCardPostulante from "./modalHistorialContactoCardPostulante";
import {
    firstNamePost,
    GetSpeechCerti,
    str_limit,
} from "../../Helpers/strings";
import NewCopyIcon from "./newCopyIcon";
import BajasPostulante from "../Postulantes/Modals/bajasPostulante";
import DataRestantePostulante from "../Postulantes/Modals/dataRestantePostulante";
import EliminarPostulante from "../Postulantes/Modals/eliminarPostulante";
import TooltipPorDias from "./tooltipPorDias";
import fotoExample from "../../../../../public/img/user_icon.svg";
import TelefonoInternacional from "./telefonoInternacional";
import { Link } from "react-router";

export default function CardPostulante({
    url,
    data,
    access,
    modelCard,
    refreshPostulantes,
    handleContactado,
    handleNoDisponible,
    handlePorColocar,
    handlePorVerificar,
    handlePorCompletar,
    filtro,
    ascenderPostulante,
    selectWp,
    removePostulante,
    variant = "actual",
}) {
    const responsive = isResponsive();
    const esListado =
        (variant === "listado" && modelCard === 1) ||
        (variant === "postulaciones" && modelCard === 3);

    const fechaPostulacion = data.fecha_postulacion ?? null;
    const foto = data.foto || fotoExample;
    const nombrePostulante = data.contact_name;

    const estatus =
        data.por_horas === 1 &&
        data.cama_adentro === 0 &&
        data.cama_afuera === 0 &&
        data.estadoid === 1
            ? "DISPONIBLE"
            : modelCard === 1
                ? data.estado
                : data.estatus_postulante;

    const historialContacto = (() => {
        if (Array.isArray(data.historialContacto)) {
            return data.historialContacto;
        }

        if (!data.historialContacto) {
            return [];
        }

        try {
            const historial = JSON.parse(data.historialContacto);
            return Array.isArray(historial) ? historial : [];
        } catch {
            return [];
        }
    })();

    const badgeMap = {
        1: "badge-por-colocar",
        2: "badge-colocado",
        3: "badge-no-disponible",
        4: "badge-baja",
        5: "badge-por-contactar",
        6: "badge-contactado",
        7: "badge-porcompletar",
        8: "badge-porverificar",
    };

    const estado = data.estadoid || data.estatus_postulante_id;
    const badgeEstado = badgeMap[estado] || "";

    function shieldStyle(verificado, ejecutivo, llamar) {
        return {
            fontSize: "0.9rem",
            color:
                verificado === "si"
                    ? "#4dabf7"
                    : llamar === true
                        ? "#f83f37"
                        : ejecutivo
                            ? "#ffc107"
                            : "#6c757d",
        };
    }

    function rowNombreVideoAntecedentes(d, soloIndicadores = false) {
        const documento = {
            iconColor: "text-secondary",
            msj: "No ha subido la foto de sus documento de identidad",
        };

        if (d.foto_documento_delantera) {
            if (parseInt(d.documento_vigente) === 0) {
                documento.iconColor = "text-danger";
                documento.msj =
                    "Su documento de identidad NO está vigente";
            } else if (parseInt(d.documento_vigente) === 1) {
                documento.iconColor = "text-purple-bertha";
                documento.msj =
                    "Su documento de identidad SI está vigente";
            }
        }

        const antecedentesprops = {
            iconColor: "",
            tooltip: "",
            modalMsj: "",
        };

        if (d.antecedentes_pdf) {
            if (
                d.diaspasadoscertificadoantecedente &&
                d.diaspasadoscertificadoantecedente >= 0
            ) {
                if (d.diaspasadoscertificadoantecedente === 0) {
                    antecedentesprops.iconColor = "#22af47";
                    antecedentesprops.iconColorOnCopy = "#146c2f";
                    antecedentesprops.message =
                        "Vigencia restante certificado único laboral: " +
                        (90 - d.diaspasadoscertificadoantecedente) +
                        " dia(s)";
                } else if (
                    parseInt(d.diaspasadoscertificadoantecedente) >= 0 &&
                    parseInt(d.diaspasadoscertificadoantecedente) <= 84
                ) {
                    antecedentesprops.iconColor = "#22af47";
                    antecedentesprops.iconColorOnCopy = "#146c2f";
                    antecedentesprops.message =
                        "Vigencia restante certificado único laboral: " +
                        (90 - d.diaspasadoscertificadoantecedente) +
                        " dia(s)";
                } else if (
                    d.diaspasadoscertificadoantecedente >= 85 &&
                    d.diaspasadoscertificadoantecedente <= 89
                ) {
                    antecedentesprops.iconColor = "#ffbf36";
                    antecedentesprops.iconColorOnCopy = "#936d1f";
                    antecedentesprops.message =
                        "Vigencia restante certificado único laboral : " +
                        (90 - d.diaspasadoscertificadoantecedente) +
                        " dia(s)";
                } else if (
                    d.diaspasadoscertificadoantecedente >= 90
                ) {
                    antecedentesprops.iconColor = "#ff0000";
                    antecedentesprops.iconColorOnCopy = "#b60404";
                    antecedentesprops.message =
                        "Certificado único laboral VIGENCIA VENCIDA";
                }
            }
        } else if (d.tiene_cuenta !== 0) {
            antecedentesprops.iconColor = "text-warning";
            antecedentesprops.tooltip =
                "Tiene una cuenta registrada. Solicitar su certificado único laboral";
        } else {
            antecedentesprops.iconColor = "text-secondary";
            antecedentesprops.tooltip =
                "No cuenta con certificado único laboral";
        }

        return (
            <>
                {!soloIndicadores && (
                    <>
                        {d.nombres ? (
                            <>
                                {modelCard === 1
                                    ? str_limit(d.nombres, 30)
                                    : d.trabajador}
                            </>
                        ) : (
                            <span className="badge text-bg-info d-inline">
                                SIN NOMBRE
                            </span>
                        )}
                    </>
                )}

                <i
                    className={
                        "fas fa-id-card-alt ms-1 " +
                        documento.iconColor
                    }
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={documento.msj}
                ></i>

                <NewCopyIcon
                    icon="fas fa-user-tag"
                    additonalClass="icon-action-sm px-0 ms-1"
                    copyText={
                        modelCard === 1 ? d.nombres : d.trabajador
                    }
                    tooltipText="Copiar nombre postulante"
                    successMsj="Nombre(s) copiado"
                />

                <NewCopyIcon
                    icon="far fa-file"
                    additonalClass="icon-action-sm px-0 ms-1"
                    copyText={
                        "PO " +
                        nombrePostulante +
                        (d.telefono ? " " + d.telefono : "") +
                        " " +
                        d.flag_emoji
                    }
                    tooltipText="Copiar nombre en Google"
                    successMsj="Nombre(s) para Google copiado"
                />

                {d.videointroduccion &&
                    !d.video_introduccion_youtube && (
                        <i className="fas fa-video ms-1"></i>
                    )}

                {d.video_introduccion_youtube && (
                    <i
                        className="fab fa-youtube ms-1"
                        style={{ color: "red" }}
                    ></i>
                )}

                {d.antecedentes_pdf ? (
                    <>
                        {d.numeroDocumento ? (
                            <NewCopyIcon
                                icon="fas fa-portrait"
                                additonalClass="icon-action-sm align-self-center"
                                copyText={GetSpeechCerti(
                                    d.antecedentes_pdf,
                                    d.numeroDocumento,
                                )}
                                tooltipText={
                                    antecedentesprops.message
                                }
                                successMsj="Certificado copiado"
                                colorNeutro={
                                    antecedentesprops.iconColor
                                }
                                colorOnCopy={
                                    antecedentesprops.iconColorOnCopy
                                }
                            />
                        ) : (
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title="No cuenta con certificado único laboral"
                                className="fas fa-portrait text-secondary ms-1"
                            ></i>
                        )}
                    </>
                ) : (
                    <>
                        {d.tiene_cuenta !== 0 ? (
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title={
                                    firstNamePost(d.nombres) +
                                    " tiene una cuenta registrada. Solicitar su certificado único laboral"
                                }
                                className="fas fa-portrait text-warning ms-1"
                            ></i>
                        ) : (
                            <>
                                {[2].includes(
                                    d.certificado_antecedente,
                                ) ? (
                                    <i
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Tiene reporte Mak Consulting"
                                        className="fas fa-file-user text-success ms-1"
                                    ></i>
                                ) : (
                                    <i
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="No cuenta con antecedentes"
                                        className="fas fa-portrait text-secondary ms-1"
                                    ></i>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        );
    }

    function rowTelefonos(d) {
        if (d.telefono === d.telefono_whatsapp) {
            return (
                <span className="row mx-0">
                    <NewCopyIcon
                        icon="fas fa-phone"
                        additonalClass="col-auto px-1 my-auto icon-action-sm align-self-center"
                        copyText={d.telefono}
                        tooltipText="Copiar teléfono"
                        successMsj="Teléfono copiado"
                    />

                    <NewCopyIcon
                        icon="fab fa-whatsapp"
                        additonalClass="col-auto px-1 my-auto icon-action-sm align-self-center font-weight-bold"
                        copyText={d.telefono}
                        tooltipText="Copiar WhatsApp"
                        successMsj="WhatsApp copiado"
                    />

                    <a
                        className="col-auto px-1"
                        href={"tel:" + d.telefono}
                    >
                        <TelefonoInternacional
                            numero={d.telefono_tarjeta}
                            cardPostulante={true}
                        />
                    </a>
                </span>
            );
        }

        return (
            <>
                <div className="row mx-0">
                    <NewCopyIcon
                        icon="fas fa-phone"
                        additonalClass="col-auto px-1 my-auto icon-action-sm align-self-center"
                        copyText={d.telefono}
                        tooltipText="Copiar teléfono"
                        successMsj="Teléfono copiado"
                    />

                    <a
                        className="col-auto px-1"
                        href={"tel:" + d.telefono}
                    >
                        <TelefonoInternacional
                            numero={d.telefono_tarjeta}
                            cardPostulante={true}
                        />
                    </a>
                </div>

                {d.telefono_whatsapp && (
                    <div className="row mx-0">
                        <NewCopyIcon
                            icon="fab fa-whatsapp"
                            additonalClass="col-auto px-1 my-auto icon-action-sm align-self-center font-weight-bold"
                            copyText={d.telefono_whatsapp}
                            tooltipText="Copiar WhatsApp"
                            successMsj="WhatsApp copiado"
                        />

                        <a
                            className="col-auto px-1"
                            href={
                                "https://api.whatsapp.com/send?phone=" +
                                d.telefono_whatsapp
                            }
                        >
                            <TelefonoInternacional
                                numero={d.telefono_tarjeta_whatsapp}
                                cardPostulante={true}
                            />
                        </a>
                    </div>
                )}
            </>
        );
    }

    function rowVerif(d) {
        return (
            <>
                {d.verificaciones_laborales ? (
                    <>
                        {d.verificaciones_laborales.map(
                            (verif, index) => {
                                let iconVerifTitle =
                                    "No tiene verificación";

                                if (verif.adjunto === "si") {
                                    iconVerifTitle =
                                        "Tiene verificación";
                                } else if (verif.llamar === true) {
                                    iconVerifTitle =
                                        "Llamar, no cuenta con WhatsApp";
                                } else if (verif.ejecutivo) {
                                    iconVerifTitle =
                                        "Verificación pendiente, " +
                                        verif.ejecutivo +
                                        " lo acaba de solicitar";
                                }

                                return (
                                    <i
                                        key={index}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={iconVerifTitle}
                                        style={shieldStyle(
                                            verif.adjunto,
                                            verif.ejecutivo,
                                            verif.llamar,
                                        )}
                                        className="fas fa-shield-alt mx-1"
                                    ></i>
                                );
                            },
                        )}
                    </>
                ) : (
                    <>Sin Recomendaciones</>
                )}
            </>
        );
    }

    function rowBajas(d) {
        return (
            <>
                {d.vecesBajas &&
                    d.vecesBajas.map((vb, index) => {
                        const titleBaja =
                            "SANCION: " +
                            vb.bajanombre +
                            "\r\n" +
                            "ESTADO: " +
                            (vb.pagado === true
                                ? "PAGADO (S/. " +
                                vb.monto_pagado +
                                ")" +
                                "\r\n" +
                                "FECHA PAGO: " +
                                vb.fecha_pago_monto
                                : "NO PAGADO");

                        const colorIcon =
                            vb.pagado === true
                                ? "text-success"
                                : "text-danger";

                        return (
                            <i
                                key={index}
                                className={
                                    "fas fa-skull mx-1 " + colorIcon
                                }
                                data-toggle="tooltip"
                                data-placement="top"
                                title={titleBaja}
                            ></i>
                        );
                    })}
            </>
        );
    }

    function rowEducacion(d) {
        return (
            <>
                {d.educacion &&
                    d.educacion.map((ed, index) => (
                        <i
                            key={index}
                            className={
                                "fas fa-pen mx-1 text-" +
                                (ed.hasAdj === true
                                    ? "dblue"
                                    : "secondary")
                            }
                            data-toggle="tooltip"
                            data-placement="top"
                            title={ed.title + " (" + ed.time + ")"}
                        ></i>
                    ))}
            </>
        );
    }

    function optionsPostulante(d) {
        return (
            <>
                <Link to={"/postulantes/edit/" + d.id}>
                    <i
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Editar"
                        className="fas fa-edit icon-action"
                    ></i>
                </Link>

                {[1, 2, 3, 4].includes(d.estadoid) && (
                    <>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={
                                "/postulantes/ficha-postulante/" + d.id
                            }
                        >
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Ficha Completa"
                                className="fas fa-file-download icon-action"
                            ></i>
                        </a>

                        {!d.tiene_antecedentes && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={
                                    url +
                                    "/postulantes/ficha-antecedente/" +
                                    d.id
                                }
                            >
                                <i
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Antecedente Proveedor"
                                    className="fas fa-file-contract icon-action text-info"
                                ></i>
                            </a>
                        )}
                    </>
                )}

                {[5].includes(d.estadoid) && (
                    <a onClick={(e) => handleContactado(e, d.id)}>
                        <i
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Contactado"
                            className="fas fa-phone icon-action-sm icon-pink"
                        ></i>
                    </a>
                )}

                {[1, 5, 6, 7, 8].includes(d.estadoid) && (
                    <a onClick={(e) => handleNoDisponible(e, d.id)}>
                        <i
                            data-toggle="tooltip"
                            data-placement="top"
                            title="No Disponible"
                            className="fas fa-ban icon-action-sm icon-pink"
                        ></i>
                    </a>
                )}

                {modelCard === 1 && access && d.estadoid !== 1 && (
                    <a onClick={(e) => handlePorColocar(e, d.id)}>
                        <i
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Por Colocar"
                            className="far fa-thumbs-up icon-action-sm icon-pink"
                        ></i>
                    </a>
                )}

                {[3, 4].includes(d.estadoid) && (
                    <>
                        {parseInt(d.estatus_anterior) === 1 &&
                        access === false ? (
                            <a
                                onClick={(e) =>
                                    handlePorColocar(e, d.id)
                                }
                            >
                                <i
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Por Colocar"
                                    className="far fa-thumbs-up icon-action-sm icon-pink"
                                ></i>
                            </a>
                        ) : (
                            <>
                                {d.estatus_anterior ? (
                                    <a
                                        onClick={(e) =>
                                            handlePorVerificar(
                                                e,
                                                d.id,
                                            )
                                        }
                                    >
                                        <i
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Por Verificar"
                                            className="fas fa-clipboard-check icon-action-sm icon-pink"
                                        ></i>
                                    </a>
                                ) : (
                                    <a
                                        onClick={(e) =>
                                            handlePorCompletar(
                                                e,
                                                d.id,
                                            )
                                        }
                                    >
                                        <i
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Por Completar"
                                            className="fas fa-pencil-alt icon-action-sm icon-pink"
                                        ></i>
                                    </a>
                                )}
                            </>
                        )}
                    </>
                )}

                {d.link_form && d.estadoid === 7 && (
                    <NewCopyIcon
                        icon="far fa-clipboard"
                        additonalClass="icon-action-sm align-self-center"
                        copyText={d.link_form}
                        tooltipText="Enviar formulario a postulante"
                        successMsj="Link de formulario copiado"
                    />
                )}

                {d.token && [1, 2].includes(d.estadoid) && (
                    <NewCopyIcon
                        icon="fas fa-file-import"
                        additonalClass="icon-action-sm align-self-center"
                        copyText={d.token_privado}
                        tooltipText="Enviar link privado de postulante"
                        successMsj="Link copiado"
                        colorNeutro="#ffbf36"
                        colorOnCopy="#da9500"
                    />
                )}

                <BajasPostulante
                    url={url}
                    idPostulante={d.id}
                    nombrePostulante={d.nombres}
                    estadoPostulante={d.estadoid}
                />

                {!d.tipodocumento &&
                    access === true &&
                    d.estadoid === 7 && (
                        <DataRestantePostulante
                            url={url}
                            idPostulante={d.id}
                            nombrePostulante={d.nombres}
                        />
                    )}

                <EliminarPostulante
                    idPostulante={d.id}
                    nombrePostulante={d.nombres}
                    handleRefresh={refreshPostulantes}
                    url={url}
                />
            </>
        );
    }

    function optionsModalPostulados(d) {
        return (
            <NewCopyIcon
                icon="fas fa-file-import"
                additonalClass="icon-action-sm align-self-center"
                copyText={
                    "https://holabertha.com/ficha-postulante/" +
                    d.token
                }
                tooltipText="Enviar link privado de postulante"
                successMsj="Link copiado"
                colorNeutro="#ffbf36"
                colorOnCopy="#da9500"
            />
        );
    }

    function optionsPostulacionesReq(d) {
        return (
            <>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                        "/postulantes/ficha-postulante/" +
                        d.trabajador_id
                    }
                >
                    <i
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Ficha Completa"
                        className="fas fa-file-download icon-action-sm mx-1"
                    ></i>
                </a>

                <NewCopyIcon
                    icon="fas fa-file-import"
                    additonalClass="icon-action-sm align-self-center mx-1"
                    copyText={
                        "https://holabertha.com/ficha-postulante/" +
                        d.token
                    }
                    tooltipText="Enviar link privado de postulante"
                    successMsj="Link copiado"
                    colorNeutro="#ffbf36"
                    colorOnCopy="#da9500"
                />

                {filtro === "1" && (
                    <>
                        <a onClick={() => ascenderPostulante(d.id)}>
                            <i className="fas fa-check icon-action-postulaciones text-success icon-action-sm mx-1"></i>
                        </a>

                        <a onClick={() => removePostulante(d.id)}>
                            <i className="fas fa-times icon-action-postulaciones text-danger icon-action-sm mx-1"></i>
                        </a>
                    </>
                )}

                {d.select_wp === 0 && (
                    <a
                        onClick={() => selectWp(d.id)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Fue seleccionado por el empleador a traves de WhatsApp"
                    >
                        <i className="fas fa-crown icon-action-postulaciones text-success icon-action-sm mx-1"></i>
                    </a>
                )}
            </>
        );
    }

    function renderHistorialContacto(nombre) {
        return (
            <ul>
                {historialContacto.length > 0 ? (
                    <ModalHistorialContactoCardPostulante
                        historial={historialContacto}
                        trabajador={nombre}
                    />
                ) : (
                    <li
                        className="Uncontacted"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="La trabajadora aún no es contactada"
                    >
                        <i className="fas fa-phone-alt"></i>
                    </li>
                )}
            </ul>
        );
    }

    /*
     * Diseño nuevo:
     * se activa únicamente con variant="listado"
     * y modelCard={1}.
     */
    if (esListado) {
        return (
            <div className={
                modelCard === 3
                    ? "col-12 col-lg-6 col-xl-4 d-flex px-2 mb-3"
                    : "col-12 col-lg-6 col-xxl-4 d-flex px-2 mb-3"
            }>
                <article
                    className={
                        "postulantes-card" +
                        (data.select_emp === 1
                            ? " postulantes-card--seleccionada"
                            : "")
                    }
                >
                    <div className="postulantes-card__contenido">
                        <div className="postulantes-card__perfil">
                            <img
                                src={foto}
                                alt={
                                    data.nombres
                                        ? `Foto de ${data.nombres}`
                                        : "Foto de postulante"
                                }
                                className="postulantes-card__foto"
                            />

                            <div className="postulantes-card__contacto">
                                <div className="historialContacto cardPostulante">
                                    {renderHistorialContacto(
                                        data.nombres || "Postulante",
                                    )}
                                </div>
                            </div>

                            {modelCard === 3 && (
                                <div className="postulantes-card__etiquetas">
                                    {data.select_emp === 1 && (
                                        <span className="badge bg-warning text-dark">
                                            <i className="fas fa-crown me-1"></i>
                                            Cliente Web
                                        </span>
                                    )}

                                    {data.select_wp === 1 && (
                                        <span className="badge bg-success">
                                            <i className="fas fa-crown me-1"></i>
                                            Cliente WhatsApp
                                        </span>
                                    )}

                                    {data.fue_tra === 1 && (
                                        <span className="badge bg-secondary">
                                            <i className="fas fa-user-times me-1"></i>
                                            Fue Trabajadora
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="postulantes-card__datos">
                            <header className="postulantes-card__cabecera">
                                <h3 className="postulantes-card__nombre">
                                    {(modelCard === 1 ? data.nombres : data.trabajador) ||
                                        data.nombres ||
                                        "SIN NOMBRE"}
                                </h3>

                                <div className="postulantes-card__procedencia">
                                    {[
                                        data.nacionalidad,
                                        data.lugarnacimiento,
                                        data.edad
                                            ? `${data.edad} AÑOS`
                                            : null,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </div>

                                <div
                                    className="postulantes-card__indicadores"
                                    aria-label="Documentos e indicadores"
                                >
                                    {rowNombreVideoAntecedentes(
                                        data,
                                        true,
                                    )}
                                </div>
                            </header>

                            <div className="postulantes-card__campo">
                                <span className="postulantes-card__etiqueta">
                                    Actividades
                                </span>

                                <div className="postulantes-card__valor">
                                    {data.actividades ? (
                                        data.actividades
                                    ) : (
                                        <span className="badge text-bg-danger">
                                            SIN ACTIVIDADES
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="postulantes-card__campo">
                                <span className="postulantes-card__etiqueta">
                                    Modalidades
                                </span>

                                <div className="postulantes-card__valor">
                                    {data.modalidades ? (
                                        <>
                                            {data.modalidades}

                                            {data.estatus_por_dias ===
                                                1 && (
                                                    <TooltipPorDias
                                                        estilo="tooltip-gray"
                                                        placement="bottom"
                                                        text={
                                                            "COLOCADO: " +
                                                            data.dias_contratados_por_dias
                                                        }
                                                    />
                                                )}
                                        </>
                                    ) : (
                                        <span className="badge text-bg-warning">
                                            SIN MODALIDADES
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="postulantes-card__telefonos">
                                {rowTelefonos(data)}
                            </div>

                            <div className="postulantes-card__campo">
                                <span className="postulantes-card__etiqueta">
                                    Vive en
                                </span>

                                <div className="postulantes-card__valor">
                                    {data.distrito ? (
                                        data.distrito
                                    ) : (
                                        <span className="badge text-bg-dark">
                                            SIN DISTRITO
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="postulantes-card__identidad">
                                <div className="postulantes-card__campo">
                                    <span className="postulantes-card__etiqueta">
                                        Identidad
                                    </span>

                                    <div className="postulantes-card__valor">
                                        {data.tipodocumento || "—"}
                                    </div>
                                </div>

                                <div className="postulantes-card__campo">
                                    <span className="postulantes-card__etiqueta">
                                        Nació en
                                    </span>

                                    <div className="postulantes-card__valor">
                                        {data.departamentoNacimiento ||
                                            "—"}
                                    </div>
                                </div>
                            </div>

                            <div className="postulantes-card__estado">
                                <span
                                    className={
                                        "badge badge-dt " +
                                        badgeEstado
                                    }
                                >
                                    {estatus}
                                </span>
                            </div>

                            <div className="postulantes-card__verificaciones">
                                {rowVerif(data)}
                            </div>

                            {data.vecesBajas?.length > 0 && (
                                <div className="postulantes-card__bajas">
                                    {rowBajas(data)}
                                </div>
                            )}

                            {data.educacion?.length > 0 && (
                                <div className="postulantes-card__educacion">
                                    {rowEducacion(data)}
                                </div>
                            )}

                            {modelCard === 3 && fechaPostulacion && (
                                <div className="postulantes-card__fecha">
                                    <span className="postulantes-card__etiqueta">
                                        Postulación
                                    </span>
                                    <span>{fechaPostulacion}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <footer
                        className="postulantes-card__acciones"
                        aria-label="Acciones de la postulante"
                    >
                        {modelCard === 1 && optionsPostulante(data)}

                        {modelCard === 3 && optionsPostulacionesReq(data)}
                    </footer>
                </article>
            </div>
        );
    }

    /*
     * Estructura actual para los demás usos del componente.
     */
    let cardStyle = "";

    if (modelCard === 1) {
        cardStyle = "col-sm-6 col-md-4";
    } else if (modelCard === 2) {
        cardStyle = "px-3 list-group list-unstyled";
    } else if (modelCard === 3) {
        cardStyle =
            "col-sm-6 col-md-4 px-3 list-group list-unstyled";
    }

    let etiquetaSelectEmp = <br className="pt-2" />;

    if (data.select_emp === 1) {
        etiquetaSelectEmp = (
            <div className="pt-2 text-center">
                <span className="badge font-badge bg-warning white-text">
                    <i className="fas fa-crown me-2"></i>
                    Cliente Web
                </span>
            </div>
        );
    }

    let etiquetaFueTra = <br className="pt-2" />;

    if (data.fue_tra === 1) {
        etiquetaFueTra = (
            <div className="pt-2 text-center">
                <span className="badge font-badge bg-secondary white-text">
                    <i className="fas fa-user-times me-2"></i>
                    Fue Trabajadora
                </span>
            </div>
        );
    }

    let etiquetaSelectWp = <br className="pt-2" />;

    if (data.select_wp === 1) {
        etiquetaSelectWp = (
            <div className="pt-2 text-center">
                <span className="badge font-badge bg-success white-text">
                    <i className="fas fa-crown me-2"></i>
                    Cliente WhatsApp
                </span>
            </div>
        );
    }

    return (
        <div className={"col-12 card-postulante " + cardStyle}>
            <div
                className={
                    "card m-0 shadow-lg rounded" +
                    (data.select_emp === 1
                        ? " purple-border-postulado"
                        : "")
                }
            >
                <div className="row m-0">
                    {responsive === false && (
                        <div className="col-md-3 align-self-center px-0">
                            <img
                                src={foto}
                                alt="bertha"
                                className="card-img img-thumbnail rounded-circle"
                            />

                            <div className="historialContacto cardPostulante pt-4">
                                {renderHistorialContacto(
                                    (modelCard === 1 ? data.nombres : data.trabajador) ||
                                    data.nombres ||
                                    "Postulante",
                                )}
                            </div>

                            {[2, 3].includes(modelCard) && (
                                <>
                                    {etiquetaSelectEmp}
                                    {etiquetaSelectWp}
                                    {etiquetaFueTra}
                                </>
                            )}
                        </div>
                    )}

                    <div className="col-md-9 col-12">
                        <div className="card-body">
                            <div className="rowNombreVideoAntecedentes card-title h5">
                                {rowNombreVideoAntecedentes(data)}
                            </div>

                            <div className="rowProcedenciaEdad card-text ficha-text">
                                {data.nacionalidad || ""}

                                {data.lugarnacimiento
                                    ? " - " + data.lugarnacimiento
                                    : ""}

                                {data.edad
                                    ? " - " + data.edad + " AÑOS"
                                    : ""}
                            </div>

                            <div
                                className={
                                    "rowActividades card-text ficha-text" +
                                    (!data.actividades ? " mb-2" : "")
                                }
                            >
                                {data.actividades ? (
                                    <>{data.actividades}</>
                                ) : (
                                    <span className="badge badgetext-bg-danger d-inline">
                                        SIN ACTIVIDADES
                                    </span>
                                )}
                            </div>

                            <div
                                className={
                                    "rowModalidades card-text ficha-text" +
                                    (!data.modalidades ? " mb-2" : "")
                                }
                            >
                                {data.modalidades ? (
                                    <>
                                        {data.modalidades}

                                        {data.estatus_por_dias ===
                                            1 && (
                                                <TooltipPorDias
                                                    estilo="tooltip-gray"
                                                    placement="bottom"
                                                    text={
                                                        "COLOCADO: " +
                                                        data.dias_contratados_por_dias
                                                    }
                                                />
                                            )}
                                    </>
                                ) : (
                                    <span className="badge text-bg-warning d-inline">
                                        SIN MODALIDADES
                                    </span>
                                )}
                            </div>

                            <div className="rowTelefonos card-text ficha-text">
                                {rowTelefonos(data)}
                            </div>

                            <div className="rowDistrito card-text ficha-text">
                                Vive en:

                                {data.distrito ? (
                                    <strong className="text-dark ms-1">
                                        {data.distrito}
                                    </strong>
                                ) : (
                                    <span className="badge text-bg-dark d-inline">
                                        SIN DISTRITO
                                    </span>
                                )}
                            </div>

                            <div className="rowCovid card-text ficha-text">
                                Identidad:

                                {data.tipodocumento ? (
                                    <span className="font-weight-bold ms-1 text-black">
                                        {data.tipodocumento}
                                    </span>
                                ) : (
                                    <span className="ms-1">-</span>
                                )}

                                <span className="mx-1">|</span>

                                Nació en:

                                {data.departamentoNacimiento ? (
                                    <span className="font-weight-bold ms-1 text-black">
                                        {data.departamentoNacimiento}
                                    </span>
                                ) : (
                                    <span className="ms-1">-</span>
                                )}
                            </div>

                            <div className="rowEstado card-text ficha-text my-1">
                                <span
                                    className={
                                        "badge badge-dt d-inline " +
                                        badgeEstado
                                    }
                                >
                                    {estatus}
                                </span>
                            </div>

                            <div className="rowVerificaciones card-text ficha-text">
                                {rowVerif(data)}
                            </div>

                            <div className="rowBajas card-text ficha-text">
                                {rowBajas(data)}
                            </div>

                            <div className="rowEducacion card-text ficha-text">
                                {rowEducacion(data)}
                            </div>

                            {[2, 3].includes(modelCard) && (
                                <div className="rowFechaPostulacion card-text ficha-text">
                                    {fechaPostulacion}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12 col-12 px-1">
                        <hr className="my-1" />

                        <div className="d-flex mx-2 mb-1">
                            {modelCard === 1 &&
                                optionsPostulante(data)}

                            {modelCard === 2 &&
                                optionsModalPostulados(data)}

                            {modelCard === 3 &&
                                optionsPostulacionesReq(data)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
