import axios from "axios";

export function ajaxEmpleadoresNew(data) {
    return axios.post('/ajax-empleadores-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresEdit(data) {
    return axios.post('/ajax-empleadores-edit', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function getEmpleadores(offset) {

    return axios.post('/ajax-refresh-empleadores', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function getDataInicial() {

    return axios.post('/ajax-empleadores-get-data-inicial', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxQuickEmpleadoresNew(data) {

    return axios.post('/ajax-empleadores-dt-active', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresActive(id) {

    return axios.post('/ajax-empleadores-active', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresEliminar(id) {

    return axios.post('/ajax-empleadores-eliminar', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresGetLinkFromRequerimiento(id) {

    return axios.post('/ajax-empleadores-get-link-form-requerimiento', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresGenerateLinkFromRequerimiento(empleador) {

    return axios.post('/ajax-empleadores-generate-link-form-requerimiento', {empleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresRemoveLinkFromRequerimiento(empleador) {

    return axios.post('/ajax-empleadores-remove-link-form-requerimiento', {empleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresBuscar(data, offset) {

    return axios.post('/ajax-empleadores-buscar', {data, offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxBuscarVinculosEmpleador(idEmpleador) {
    return axios.post('/ajax-buscar-vinculos-empleador', {idEmpleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTransferirDataEmpleador(idOldEmpleador, newEmpleador) {
    return axios.post('/ajax-transferir-data-empleador', {idOldEmpleador, newEmpleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEliminarDataEmpleador(idOldEmpleador) {
    return axios.post('/ajax-eliminar-data-empleador', {idOldEmpleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresGetData() {
    return axios.post('/ajax-empleadores-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEmpleadoresGet(id) {
    return axios.post('/ajax-empleadores-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
