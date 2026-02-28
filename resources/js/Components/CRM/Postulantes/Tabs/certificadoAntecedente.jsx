import React from "react";
import { GetSpeechCerti } from "../../../Helpers/strings.js";
import LabelNombre from "../../Components/labelNombre.jsx";
import CamposDocumento from "../Components/camposDocumentos.jsx";
import NewCopyButton from "../../Components/newCopyButton.jsx";

export default function CertificadoAntecedente({
    data,
    antecedentesIcon,
    handleChange,
    handleSingularUpload,
    handleSingularDelete,
    changeEstatusCUL,
}) {
    return (
        <div className="mt-45">
            <LabelNombre
                nombres={data.nombres}
                apellidos={data.apellidos}
                contactname={data.contactname}
                flagemoji={data.flagemoji}
            />

            <div className={"row mx-0"}>
                {data.fotodnidelantera && data.numerodocumento && (
                    <div className="col-12 mb-4 px-0">
                        <CamposDocumento
                            data={data}
                            buttonText={"Solicitar certificado"}
                            link={"https://www.empleosperu.gob.pe/#/login"}
                            showEmail={false}
                            type={"certi"}
                        />
                    </div>
                )}

                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group row align-items-center">
                        <label className="col-12 col-sm-4 col-form-label label-adjunto text-center">
                            Certificado de Antecedentes
                            <i
                                className={
                                    antecedentesIcon.iconColor +
                                    " fas fa-portrait ms-1 finger-action"
                                }
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title={antecedentesIcon.tooltip}
                                onClick={(e) =>
                                    changeEstatusCUL(
                                        e,
                                        data.tienecuenta,
                                        data.certificadoantecedentepdf,
                                    )
                                }
                            ></i>
                        </label>
                        <div className="col-sm-8 col-md-3">
                            {data.loadingcertificadoantecedente ? (
                                <i className="fas fa-circle-notch fa-spin icon-upload-img"></i>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        name="certi"
                                        id="certi"
                                        className="inputfile inputfile-upload"
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                "imagenpdf",
                                                "certificadoantecedente",
                                            )
                                        }
                                        accept=".pdf"
                                    />
                                    <label htmlFor="certi">
                                        {(data.certificadoantecedentepdf
                                            ? "Actualizar"
                                            : "Subir") + " archivo"}
                                    </label>
                                    {data.certificadoantecedentepdf && (
                                        <>
                                            <i
                                                className={
                                                    "fas fa-check-circle icon-green option-action ms-1"
                                                }
                                                onClick={() =>
                                                    window.open(
                                                        data.certificadoantecedentepdf,
                                                        "_blank",
                                                    )
                                                }
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Ver Antecedente"
                                            ></i>
                                            <i
                                                className={
                                                    "fas fa-trash-alt text-secondary option-action ms-1"
                                                }
                                                onClick={(e) =>
                                                    handleSingularDelete(
                                                        e,
                                                        "certificadoantecedente",
                                                    )
                                                }
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Remover antecedente"
                                            ></i>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group row align-items-center">
                        <label className="col-12 col-sm-4 col-form-label label-adjunto text-center">
                            Fecha de Emisión
                        </label>
                        <div className="col-sm-8 col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                name="fechaemisioncertificado"
                                value={data.fechaemisioncertificado}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "time",
                                        "fechaemisioncertificado",
                                    )
                                }
                                placeholder="dd/mm/aaaa"
                                aria-describedby="date-format"
                                disabled={Boolean(data.show)}
                            />
                        </div>
                    </div>
                </div>

                {data.certificadoantecedentepdf && data.numerodocumento && (
                    <div className="col-12 col-lg-6 mb-3 align-content-center">
                        <NewCopyButton
                            copyText={GetSpeechCerti(
                                data.certificadoantecedentepdf,
                                data.numerodocumento,
                                data.passwordCERTI,
                            )}
                            successMsj={
                                "Certificado único laboral copiado exitosamente"
                            }
                            btnColor={"purple"}
                            btnText={"Copiar certificado, usuario y clave"}
                            btnSize={"block"}
                        />
                    </div>
                )}

                {data.certificadoantecedentepdf && (
                    <div className="col-12 col-lg-6 mb-3">
                        <div
                            className="alert alert-success reporte-beneficios-alert mb-0"
                            role="alert"
                        >
                            Puedes descargar el certificado de antecedente en el
                            siguiente enlace:
                            <a
                                className="link-green ms-2"
                                target="_blank"
                                href={data.certificadoantecedentepdf}
                            >
                                Descargar Certificado
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
