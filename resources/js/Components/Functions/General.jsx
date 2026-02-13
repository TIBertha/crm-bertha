import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

export function ajaxVerificarNumero(numero, tipo) {
    return axios
        .post("/ajax-verificar-numero", { numero, tipo })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxUploadFile(file, campo, tipoarchivo) {
    return axios
        .post("/ajax-upload-file", { file, campo, tipoarchivo })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchDistrito(search, paisPostulando) {
    return axios
        .post("/ajax-search-distrito", { search, paisPostulando })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchDistritoExperiencia(search) {
    return axios
        .post("/ajax-search-distrito-experiencia", { search })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetDistritosByProvincia(provincia) {
    return axios
        .post("/ajax-get-distritos-by-provincia", { provincia })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetProvinciasByDepartamento(departamento) {
    return axios
        .post("/ajax-get-provincias-by-departamento", { departamento })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPagosTransaccion(transacciones, trabajadorid) {
    return axios
        .post("/ajax-get-provincias-by-departamento", {
            transacciones,
            trabajadorid,
        })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPagosReferidosTransaccion(transacciones, referenteid) {
    return axios
        .post("/ajax-get-provincias-by-departamento", {
            transacciones,
            referenteid,
        })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetAccessFunctions(allowedUsers) {
    return axios
        .post("/ajax-get-access-functions", { allowedUsers })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetDomicilioData(domicilioid) {
    return axios
        .post("/ajax-get-domicilio-data", { domicilioid })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetDepartamentosByNacionalidad(paisNacimiento) {
    return axios
        .post("/ajax-get-departamentos-by-nacionalidad", { paisNacimiento })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchUser(search) {
    return axios.post("/ajax-search-user", { search }).then((res) => {
        let r = res.data;
        return r;
    });
}

export function isResponsive(width) {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return windowSize.innerWidth <= (width ? width : 768) ? true : false;
}

export function mobileDesktop() {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return windowSize.innerWidth <= 1200 ? "mobile" : "desktop";
}

export function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}

export function formButtons(
    isLoading,
    submitButton,
    handleCancelar,
    route,
    contratoID = null,
) {
    return (
        <div className="form-group row mb-0 mt-30">
            {contratoID && (
                <div className={"col-12 py-2"}>
                    <div
                        className="alert alert-success alert-report-beneficios"
                        role="alert"
                    >
                        El documento fue generado con exito. Puedes descargarlo
                        en el siguiente enlace:{" "}
                        <a
                            className="link-reporte"
                            href={"/contratos/impresion/" + contratoID}
                            target="_blank"
                        >
                            Ver documento
                        </a>
                    </div>
                </div>
            )}

            <div className="col-sm-10 offset-sm-2">
                {!contratoID && (
                    <button
                        type="submit"
                        className="btn btn-purple-webexperta btn-action"
                    >
                        {isLoading && (
                            <i className="fas fa-sync fa-spin ms-1"></i>
                        )}
                        {submitButton == "new" && "Guardar"}
                        {submitButton == "edit" && "Actualizar"}
                    </button>
                )}

                {contratoID && submitButton == "edit" && (
                    <button
                        type="submit"
                        className="btn btn-purple-webexperta btn-action"
                    >
                        {isLoading && (
                            <i className="fas fa-sync fa-spin ms-1"></i>
                        )}
                        {submitButton == "edit" && "Actualizar"}
                    </button>
                )}

                {handleCancelar && (
                    <a
                        className="btn btn-purple-webexperta btn-action text-white"
                        onClick={handleCancelar}
                    >
                        {"Cancelar"}
                    </a>
                )}

                {route && (
                    <Link
                        className="btn btn-purple-webexperta btn-action"
                        to={route}
                    >
                        {"Volver"}
                    </Link>
                )}
            </div>
        </div>
    );
}
