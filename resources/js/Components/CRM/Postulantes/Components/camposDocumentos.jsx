import React, { useState } from "react";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";
import { changeDateFormat2 } from "../../../Functions/General.jsx";
import toast from "react-hot-toast";

export default function CamposDocumentos({
    data,
    link,
    buttonText,
    showEmail,
    type = "covid",
}) {
    function openLink(e, link) {
        window.open(link, "_blank");
    }

    const [backgroundColor, setBackgroundColor] = useState("#513675");

    let iconStyleColor = {
        backgroundColor: backgroundColor,
        color: "#FFFFFF",
    };

    function handleCopy(textCopy, successMsj) {
        navigator.clipboard.writeText(textCopy);
        toast(successMsj, {
            icon: "✅",
        });

        setBackgroundColor("#FF0080FF");

        setTimeout(function () {
            setBackgroundColor("#513675");
        }, 1500);
    }

    let user = {
        mail: "opercertiunic.bertha@gmail.com",
        password: "Bertha*123456",
    };

    return (
        <div className={"camposdocumento text-dark"}>
            <div className="form-group row mx-0 mb-0 py-3 px-1">
                <label className="col-12 col-md-7 col-form-label text-center align-self-center">
                    {data.numerodocumento && (
                        <>
                            <div className="font-weight-bold">
                                Número de documento
                                <NewCopyIcon
                                    colorNeutro={"#ff007d"}
                                    colorOnCopy={"#513675"}
                                    icon={"fas fa-copy"}
                                    additonalClass={
                                        "icon-action align-self-center ms-2"
                                    }
                                    copyText={data.numerodocumento}
                                    tooltipText={"Copiar número de documento"}
                                    successMsj={"Número documento copiado"}
                                />
                            </div>
                            {type == "covid" && (
                                <>
                                    {data.fechanacimiento && (
                                        <div className="font-weight-bold">
                                            Fecha de nacimiento
                                            <NewCopyIcon
                                                colorNeutro={"#ff007d"}
                                                colorOnCopy={"#513675"}
                                                icon={"fas fa-copy"}
                                                additonalClass={
                                                    "icon-action align-self-center ms-2"
                                                }
                                                copyText={changeDateFormat2(
                                                    data.fechanacimiento,
                                                )}
                                                tooltipText={
                                                    "Copiar fecha de nacimiento"
                                                }
                                                successMsj={
                                                    "Fecha de nacimiento copiada"
                                                }
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </label>

                {data.fotodnidelantera && (
                    <div className="col-12 col-md-5 col-form-label text-center align-self-center">
                        <a
                            className="link-purple font-weight-700 finger-action"
                            onClick={(e) => openLink(e, data.fotodnidelantera)}
                        >
                            Ver documento de identidad
                        </a>
                    </div>
                )}

                {showEmail == true && (
                    <>
                        <div className="col-12 align-self-center">
                            <hr className="mb-2" />
                        </div>

                        <div className="col-12 align-self-center px-25">
                            <div className="">
                                Correo: <strong>{user.mail}</strong>
                                <NewCopyIcon
                                    colorNeutro={"#ff007d"}
                                    colorOnCopy={"#513675"}
                                    icon={"fas fa-copy"}
                                    additonalClass={
                                        "icon-action align-self-center ms-2"
                                    }
                                    copyText={user.mail}
                                    tooltipText={"Copiar correo"}
                                    successMsj={"Correo copiado"}
                                />
                            </div>
                            <div className="">
                                Contraseña: <strong>{user.password}</strong>
                                <NewCopyIcon
                                    colorNeutro={"#ff007d"}
                                    colorOnCopy={"#513675"}
                                    icon={"fas fa-copy"}
                                    additonalClass={
                                        "icon-action align-self-center ms-2"
                                    }
                                    copyText={user.password}
                                    tooltipText={"Copiar contraseña"}
                                    successMsj={"Contraseña copiada"}
                                />
                            </div>
                        </div>
                    </>
                )}

                {type == "certi" && (
                    <div className="col-12 text-center mt-2">
                        <a
                            className={
                                "btn btn-sm btn-block bertha-purple-button font-weight-bold"
                            }
                            style={iconStyleColor}
                            onClick={(e) =>
                                handleCopy("Bertha*123456", "Clave copiada")
                            }
                        >
                            {"Copiar clave"}
                        </a>
                    </div>
                )}

                <div className="col-12 text-center mt-2">
                    <a
                        className={
                            "btn btn-sm btn-block bertha-green-button font-weight-bold"
                        }
                        onClick={(e) => openLink(e, link)}
                    >
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    );
}
