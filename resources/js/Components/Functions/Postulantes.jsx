import axios from "axios";
import moment from "moment";

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

export function getStatusContact(historial) {
    let wereContacted = historial.length != 0 ? true : false;

    let lastContact = null;
    let statusContact = "none";

    if (wereContacted == true) {
        lastContact = historial[historial.length - 1];

        if (lastContact.diasPasados >= 0 && lastContact.diasPasados <= 5) {
            statusContact = "fresh";
        } else if (
            lastContact.diasPasados >= 6 &&
            lastContact.diasPasados <= 10
        ) {
            statusContact = "mid";
        } else if (
            lastContact.diasPasados >= 11 &&
            lastContact.diasPasados <= 15
        ) {
            statusContact = "raw";
        }
    }

    return statusContact;
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
