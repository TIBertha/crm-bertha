import axios from 'axios';

export function ajaxReclamosNew(data) {
    return axios.post('/ajax-reclamos-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxReclamosEdit(data) {
    return axios.post('/ajax-reclamos-edit', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRefreshReclamos(offset) {
    return axios.post('/ajax-refresh-reclamos', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxReclamosGetData() {
    return axios.post('/ajax-reclamos-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxReclamosGet(id) {
    return axios.post('/ajax-reclamos-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
export function ajaxReclamosAtendido(id) {
    return axios.post('/ajax-reclamos-atendido', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
