import axios from "axios";
import moment from "moment";
import {cambiarEspacioPorGuion} from "../Helpers/strings.js";

export function ajaxSetContactadoPostulantes(id) {
    return axios
        .post("/ajax-set-contactado-postulantes", { id })
        .then((res) => {
            let r = res.data;
            return r;
        });
}
export function ajaxRefreshPostulantes(offset, data) {
    return axios
        .post("/ajax-refresh-postulantes", { offset, data })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetRegistroLiquidaciones() {
    return axios.post("/ajax-get-registro-liquidacion", {}).then((res) => {
        let r = res.data;
        return r;
    });
}

export function ajaxCalcularLiquidacion(fechaIngreso, fechaCese, sueldo,monto) {
    return axios
        .post("/ajax-calcular-liquidacion", {
            fechaIngreso,
            fechaCese,
            sueldo,
            monto,
        })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPostulantesGet(id) {
    return axios.post("/ajax-postulantes-get", { id }).then((res) => {
        let r = res.data;
        return r;
    });
}

export function ajaxSaveDataFaltantePostulante(
    id,
    paisNacimiento,
    paisPostulacion,
    tipoDocumento,
    numeroDocumento,
) {
    return axios
        .post("/ajax-save-data-faltante-postulante", {
            id,
            paisNacimiento,
            paisPostulacion,
            tipoDocumento,
            numeroDocumento,
        })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetHistorialBajas(id) {
    return axios.post("/ajax-get-historial-bajas", { id }).then((res) => {
        let r = res.data;
        return r;
    });
}

export function ajaxGetDataFaltantePostulante(id) {
    return axios
        .post("/ajax-get-data-faltante-postulante", { id })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPostulantesGetDataInicial() {
    return axios.post("/ajax-postulantes-get-data-inicial", {}).then((res) => {
        let r = res.data;
        return r;
    });
}

export function ajaxPostulantesGetData(genero, paispostulando) {
    return axios
        .post("/ajax-postulantes-get-data", { genero, paispostulando })
        .then((res) => {
            let r = res.data;
            return r;
        });
}



export function ajaxSaveDataBajas(idPostulante, idBaja) {
    return axios
        .post("/ajax-save-data-bajas", { idPostulante, idBaja })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxUpdatePagoBaja(idBaja, monto) {
    return axios
        .post("/ajax-update-pago-baja", { idBaja, monto })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxBuscarVinculosPostulante(idPostulante) {
    return axios
        .post("/ajax-buscar-vinculos-postulante", { idPostulante })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxTransferirDataPostulante(idOldPostulante, newPostulante) {
    return axios
        .post("/ajax-transferir-data-postulante", {
            idOldPostulante,
            newPostulante,
        })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxEliminarDataPostulante(idOldPostulante) {
    return axios
        .post("/ajax-eliminar-data-postulante", { idOldPostulante })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetActividadesList(genero, paispostulando) {
    return axios
        .post("/ajax-get-actividades-list", { genero, paispostulando })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPostulantesNew(data, testspsicologico, firma) {
    return axios
        .post("/ajax-postulantes-new", { data, testspsicologico, firma })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxPostulantesEdit(id, data, firma) {
    return axios
        .post("/ajax-postulantes-edit", { id, data, firma })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function functionCalculateAge(fechaNacimiento) {
    let edadPostulante = moment().diff(fechaNacimiento, "years", false);

    return fechaNacimiento ? edadPostulante : "";
}

export function ajaxSaveEjecutivo(id, verificaciones) {
    return axios
        .post("/ajax-save-ejecutivo", { id, verificaciones })
        .then((res) => {
            let r = res.data;
            return r;
        });
}

export function ajaxSaveEstatusCul(estatus, id) {
    return axios.post("/ajax-save-estatus-cul", { estatus, id }).then((res) => {
        let r = res.data;
        return r;
    });
}

export function functionSelectNationality(value) {
    return value == "54" ? "1" : "2";
}

export function getNumAdjuntoVerificacion(data, key, tipoadjunto) {
    let existeData = data[key] ? true : false;

    if (existeData) {
        if (tipoadjunto == "adjuntosrecomendaciones") {
            if (data[key].adjuntosrecomendaciones.length) {
                const maxNumR = data[key].adjuntosrecomendaciones
                    .map((valor) => valor.num)
                    .sort((a, b) => a - b)[
                data[key].adjuntosrecomendaciones.length - 1
                    ];

                return maxNumR + 1;
            }
        } else if (tipoadjunto == "adjuntosverificaciones") {
            if (data[key].adjuntos.length) {
                const maxNumV = data[key].adjuntos
                    .map((valor) => valor.num)
                    .sort((a, b) => a - b)[data[key].adjuntos.length - 1];

                return maxNumV + 1;
            }
        }

        return 1;
    }

    return 1;
}

export function isActividadChofer(actividades) {
    if (actividades) {
        let check = actividades.find((o) => o.value == 8);

        if (check) {
            return true;
        } else {
            return false;
        }
    }

    return false;
}

export function nombreAdjuntoVerificacion(data, key, num, tipoadjunto) {
    let name = "";
    let existeData = data[key] ? true : false;
    let labelTipoAdjunto = "";

    if (existeData) {
        if (tipoadjunto == 'adjuntosrecomendaciones') {
            labelTipoAdjunto = "RECOMENDACION";
        } else if (tipoadjunto == "adjuntosverificaciones") {
            labelTipoAdjunto = "VERIFICACION";
        }

        let nombre = data[key].nombre
            ? data[key].nombre + " " + labelTipoAdjunto + " " + num
            : "";

        if (nombre) {
            name = cambiarEspacioPorGuion(nombre);
        }
    }

    return name;
}

