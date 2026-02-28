import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import LabelNombre from "../../Components/labelNombre.jsx";
import { GetListAddEstudios } from "../../../Helpers/strings.js";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";

export default function Educacion({
    data,
    handleChange,
    handleUpload,
    handleRenameAdjunto,
    handleDeleteAdjunto,
    addEducacion,
    removeEducacion,
}) {
    let nivelesEducativos = data.niveleseducativos;

    if (parseInt(data.paispostulando) == 49) {
        nivelesEducativos = data.niveleseducativos_mx;
    }

    return (
        <div className="mt-45">
            <LabelNombre
                nombres={data.nombres}
                apellidos={data.apellidos}
                children={
                    <span className="me-1 tooltips-inside">
                        <NewCopyIcon
                            icon={"fas fa-list-ul"}
                            additonalClass={"icon-action-sm"}
                            copyText={GetListAddEstudios()}
                            tooltipText={"Copiar requisitos - Estudios"}
                            successMsj={"Requisitos copiados"}
                        />
                    </span>
                }
                contactname={data.contactname}
                flagemoji={data.flagemoji}
            />

            <div className="row mx-0">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group row mx-0 align-items-center">
                        <label className="col-12 col-md-4 col-form-label label-adjunto ">
                            Nivel Educativo
                        </label>
                        <div className="col-sm-8 col-md-7">
                            <select
                                className="form-control"
                                name="niveleducativo"
                                value={data.niveleducativo}
                                onChange={handleChange}
                            >
                                <option key="0" value="">
                                    Seleccione
                                </option>
                                {nivelesEducativos.map((nivEd, index) => {
                                    return (
                                        <option key={index} value={nivEd.id}>
                                            {parseInt(data.paispostulando) ===
                                            49
                                                ? nivEd.nombre_mx
                                                : nivEd.nombre}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            {data.adjuntoeducacion.map((educ, key) => (
                <div key={key} className="row mx-0 row-multiple">
                    <div className="col-12 col-md-7">
                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label label-adjunto ">
                                Tipo de Certificado
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <select
                                    className="form-control"
                                    name="tipocertificado"
                                    value={educ.tipocertificado}
                                    onChange={(e) =>
                                        handleChange(e, "educacion", key)
                                    }
                                >
                                    <option value="">Seleccione</option>
                                    {data.tiposcertificados.map(
                                        (tipCert, key) => (
                                            <option value={tipCert.id}>
                                                {tipCert.nombre}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label label-adjunto ">
                                Centro de Estudios
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <input
                                    className="form-control"
                                    name="centro"
                                    placeholder="Ingrese el centro de estudio"
                                    value={educ.centro}
                                    onChange={(e) =>
                                        handleChange(e, "educacion", key)
                                    }
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-12 col-md-4 col-form-label label-adjunto ">
                                Título
                            </label>
                            <div className="col-sm-8 col-md-7">
                                <input
                                    className="form-control"
                                    name="titulo"
                                    placeholder="Ingrese el título"
                                    value={educ.titulo}
                                    onChange={(e) =>
                                        handleChange(e, "educacion", key)
                                    }
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>

                    {data.show === false && (
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 text-end">
                            <div
                                className="form-group row add-item me-5 mt-3"
                                onClick={(e) => removeEducacion(key)}
                            >
                                <i
                                    className="fas fa-trash-alt icon-remove-adjunto"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Eliminar"
                                ></i>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {data.show === false && (
                <div className="form-group row mx-0">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 px-3">
                        <div className="mb-4">
                            <div className="add-item" onClick={addEducacion}>
                                <i className="fas fa-plus"></i> Adicionar nuevo
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
