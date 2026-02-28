import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalTitle,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {
    ajaxGetUsuariosInternos,
    ajaxSetPasswordUsuariosInternos,
} from "../../../Functions/UsuariosInternos.jsx";
import { isResponsive } from "../../../Functions/General.jsx";

export default function ResetPasswords({}) {
    const [show, setShow] = useState(false);
    let responsive = isResponsive();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("1");
    const [msj, setMsj] = useState("");
    const [typeMsj, setTypeMsj] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState("");
    const [contra, setContra] = useState("");
    let conf = {
        title: "Restaurar contraseñas",
        icon: "fa-solid fa-user-lock",
        m: "15px",
    };
    let icon = { type: "times", color: "muted" };
    if (typeMsj == "exito") {
        icon.type = "check";
        icon.color = "success";
    }

    function openModal() {
        setShow(true);
        setUsuario("");
        setContra("");
        getUsuarios();
    }

    function handleChange(e, campo) {
        let valor = e.target.value;
        if (campo == "usuario") {
            setUsuario(valor);
        } else if (campo == "contra") {
            setContra(valor);
        }
    }

    function getUsuarios() {
        setLoading(true);
        ajaxGetUsuariosInternos()
            .then((r) => {
                setLoading(false);
                setUsuarios(r.usuarios);
                setView("1");
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    setLoading(false);
                }
            });
    }

    function resetPassword() {
        setLoading(true);

        ajaxSetPasswordUsuariosInternos(usuario, contra)
            .then((r) => {
                setLoading(false);
                setView("2");
                setMsj(r.msj);
                setTypeMsj(r.type);
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    setLoading(false);
                    setView("2");
                    setMsj(r.msj);
                    setTypeMsj(r.type);
                }
            });
    }

    return (
        <>
            <a
                className={responsive === true ? "w-100" : ""}
                role="button"
                onClick={(e) => openModal()}
            >
                <div
                    className={
                        "btn bertha-orange-button font-weight-bold font btn-" +
                        (responsive === true ? "lg w-100" : "sm text-white")
                    }
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={conf.title}
                >
                    <i className={conf.icon + " icon-question"}></i>{" "}
                    {responsive === true && (
                        <span className="ml-2">{conf.title}</span>
                    )}
                </div>
            </a>

            <Modal
                size="lg"
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>
                            <i className={conf.icon + " me-2"}></i>
                            {conf.title}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {loading == true && (
                        <section className="row mx-0 justify-content-center">
                            <div className="col-auto py-4">
                                <i className="fas fa-sync fa-spin"></i>
                            </div>
                        </section>
                    )}
                    {loading == false && (
                        <>
                            {view == "1" && (
                                <section className="row justify-content-center">
                                    <div className="form-group col-12">
                                        <div className="row">
                                            <label className="col-12  col-form-label align-self-center">
                                                Usuario
                                            </label>
                                            <div className="col-12">
                                                <select
                                                    className="form-control"
                                                    id="usuario"
                                                    name="usuario"
                                                    value={usuario}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "usuario",
                                                        )
                                                    }
                                                >
                                                    <option
                                                        key="0"
                                                        value=""
                                                        disabled
                                                    >
                                                        Seleccione
                                                    </option>
                                                    {usuarios.map(
                                                        (p, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                    value={p.id}
                                                                >
                                                                    {p.nombres +
                                                                        " " +
                                                                        p.apellidos}
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            "form-group col-12" +
                                            (usuario && contra ? " mb-25" : "")
                                        }
                                    >
                                        <div className="row">
                                            <label className="col-12  col-form-label align-self-center">
                                                Contraseña
                                            </label>
                                            <div className="col-12">
                                                <input
                                                    className="form-control"
                                                    name="contra"
                                                    placeholder="Ingresar nueva contraseña"
                                                    value={contra}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            "contra",
                                                        )
                                                    }
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {usuario && contra && (
                                        <div className="form-group col-12">
                                            <a
                                                className="btn bertha-purple-button w-100"
                                                onClick={(e) => resetPassword()}
                                            >
                                                Cambiar contraseña
                                            </a>
                                        </div>
                                    )}
                                </section>
                            )}
                            {view == "2" && (
                                <div className="isLoadingArea">
                                    <p>
                                        <i
                                            className={
                                                "fas fa-" +
                                                icon.type +
                                                "-circle text-" +
                                                icon.color
                                            }
                                        ></i>
                                    </p>

                                    <h5 className="mt-1 mb-3">{msj}</h5>

                                    <div className="row justify-content-center mx-0">
                                        <div className="col-5">
                                            <button
                                                type="button"
                                                className="btn btn-lg bertha-purple-button w-100"
                                                onClick={(e) => setShow(false)}
                                            >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}
