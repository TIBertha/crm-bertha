import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import logo from "../../../../../public/img/logo.png";
import { showAlert } from "../../Helpers/alerts";
import { ajaxPostLogin, ajaxPostMailGeo } from "../../Functions/Login";

export default function Login({ url }) {
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setshowPassword] = useState(false);

    let showPasswordConf = {
        able: false,
        icon: "",
        style: "btn bertha-pink-button h-100 w-100 btn-sm align-content-center",
        toolTip: "",
        type: "",
    };

    if (showPassword == true) {
        showPasswordConf.icon = "-slash";
        showPasswordConf.type = "text";
        showPasswordConf.toolTip = "Ocultar contraseña";
    } else {
        showPasswordConf.icon = "";
        showPasswordConf.type = "password";
        showPasswordConf.toolTip = "Mostrar contraseña";
    }

    function handleLogin(e) {
        setIsLoading(true);

        e.preventDefault();

        ajaxPostLogin(url, telefono, password)
            .then((r) => {
                if (r.code === 200) {
                    setIsLoading(false);
                    window.location.href = url + "/postulantes";
                } else if (r.code === 600) {
                    setIsLoading(false);
                    showAlert("error", r.msj);
                }
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    this.setLoading(false);
                    showAlert("error", error.response.data);
                }
            });
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-lg-3 login-div">
                <div className="logo mb-20">
                    <img src={logo} alt="webexperta" />
                </div>

                <form method="POST" onSubmit={(e) => handleLogin(e)}>
                    <p className="text-center mb-20 font-weight-700 text-dark">
                        Panel de Administración
                    </p>

                    <div className="alert alert-warning" role="alert">
                        <i className="fa fa-info-circle"></i> Para ingresar al
                        CRM debes aceptar los permisos de ubicación.
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="telefono"
                            name="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ingrese su teléfono"
                        />
                    </div>

                    <div className={"form-group row mx-0"}>
                        <div className={"col ps-0 pe-1"}>
                            <div className="input-group">
                                <input
                                    type={showPasswordConf.type}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Ingrese su contraseña"
                                />
                            </div>
                        </div>
                        <div className="col-auto px-0">
                            <a
                                role="button"
                                className={showPasswordConf.style}
                                onClick={(e) =>
                                    setshowPassword(
                                        showPassword == true ? false : true,
                                    )
                                }
                            >
                                <i
                                    className={
                                        "alignButtonReq fas fa-eye" +
                                        showPasswordConf.icon
                                    }
                                ></i>
                            </a>
                        </div>
                    </div>

                    <button
                        className="btn bertha-purple-button full-size btn-block font-weight-bold"
                        type="submit"
                    >
                        {isLoading && (
                            <i className="fas fa-sync fa-spin me-2"></i>
                        )}
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
