import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import logo from "../../../../../public/img/logo.png";
import { showAlert } from "../../Helpers/alerts.js";
import { ajaxPostLogin, ajaxPostMailGeo } from "../../Functions/Login";

export default function Test({ url }) {
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setshowPassword] = useState(false);

    let showPasswordConf = {
        able: false,
        icon: "",
        style: "btn bertha-pink-button font-weight-bold font h-100 w-100 btn-sm text-white",
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

    console.log(logo);

    function getLocation(e) {
        e.preventDefault();

        /*if(telefono){
            if ("geolocation" in navigator) {
                let geo_options = {
                    enableHighAccuracy: true
                };
                navigator.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, geo_options);
            }else{
                showAlert('error', 'El navegador que intenta utilizar es obsoleto, intente con otro');
            }

        }else{
            showAlert('error', 'El telefono es requerido');
        }*/
    }

    return (
        <div className="auth-form-wrap pt-xl-0 pt-70">
            <div className="auth-form w-xl-25 w-lg-35 w-sm-50 w-100 log-style">
                <a className="auth-brand text-center d-block mb-20" href="#">
                    <img
                        className="brand-img logo-login"
                        src={logo}
                        alt="webexperta"
                    />
                </a>

                <form method="POST" onSubmit={(e) => this.getLocation(e)}>
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
                        className="btn bertha-purple-button btn-block font-weight-bold"
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
