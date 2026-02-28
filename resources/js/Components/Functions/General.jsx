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

export function changeDateFormat2(inputDate) {
    // expects Y-m-d
    let splitDate = inputDate.split("-");
    if (splitDate.count == 0) {
        return null;
    }

    return splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
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

export function getDisplayHeight() {
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

    return windowSize.innerHeight;
}

export function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}

export function toPesos(mount) {
    let valor = mount.toString();

    const sanitizedValue = valor.replace(/,/g, '');

    return  parseFloat(sanitizedValue);
}

export function toPesos3(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function toPesos2(mount) {
    let valor = mount.toString();

    return  Number(valor).toLocaleString();
}

export function executeCalcularTiempo(fechaI, fechaF) {
    if (fechaI && fechaF) {
        let a = moment(fechaF);
        let b = moment(fechaI);
        let dias = "";
        let anios = "";
        let meses = "";

        let years = a.diff(b, "year");
        b.add(years, "years");

        if (years > 0) {
            if (years > 1) {
                anios = years + " AÑOS";
            } else {
                anios = years + " AÑO";
            }
        } else {
            anios = 0;
        }

        let months = a.diff(b, "months");
        b.add(months, "months");

        if (months > 0) {
            if (months > 1) {
                meses = months + " MESES";
            } else {
                meses = months + " MES";
            }
        } else {
            meses = 0;
        }

        let days = a.diff(b, "days");
        b.add(days, "days");

        if (days > 0) {
            if (days > 1) {
                dias = days + " DIAS";
            } else {
                dias = days + " DIA";
            }
        } else {
            dias = 0;
        }

        let enunciado = "";

        if (days === 0) {
            if (years > 0 && months > 0) {
                enunciado = anios + " Y " + meses;
            } else if (years > 0 && months === 0) {
                enunciado = anios;
            } else if (years === 0 && months > 0) {
                enunciado = meses;
            }
        } else {
            if (years > 0 && months > 0) {
                enunciado = anios + ", " + meses + " Y " + dias;
            } else if (years > 0 && months === 0) {
                enunciado = anios + " Y " + dias;
            } else if (years === 0 && months > 0) {
                enunciado = meses + " Y " + dias;
            } else if (years === 0 && months === 0) {
                enunciado = dias;
            }
        }

        return enunciado;
    }
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
                        className="alert alert-success reporte-beneficios-alert"
                        role="alert"
                    >
                        El documento fue generado con exito. Puedes descargarlo
                        en el siguiente enlace:{" "}
                        <a
                            className="link-green"
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
                        className="btn bertha-purple-button btn-action"
                    >
                        {isLoading && (
                            <i className="fas fa-sync fa-spin me-2"></i>
                        )}
                        {submitButton === "new" && "Guardar"}
                        {submitButton === "edit" && "Actualizar"}
                    </button>
                )}

                {contratoID && submitButton === "edit" && (
                    <button
                        type="submit"
                        className="btn bertha-purple-button btn-action"
                    >
                        {isLoading && (
                            <i className="fas fa-sync fa-spin me-2"></i>
                        )}
                        {submitButton === "edit" && "Actualizar"}
                    </button>
                )}

                {handleCancelar && (
                    <a
                        className="btn bertha-pink-button btn-action text-white"
                        onClick={handleCancelar}
                    >
                        {"Cancelar"}
                    </a>
                )}

                {route && (
                    <Link
                        className="btn bertha-pink-button btn-action"
                        to={route}
                    >
                        {"Volver"}
                    </Link>
                )}
            </div>
        </div>
    );
}

export function ajaxGetPaises(paisID) {
    return axios.post('/ajax-get-paises', {paisID} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSaveEstado(paisID, newEstado) {
    return axios.post('/ajax-save-estado', {paisID, newEstado} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
