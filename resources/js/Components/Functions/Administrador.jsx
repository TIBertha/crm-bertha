import axios from 'axios';

export function ajaxAdministradoresActive(id) {
    return axios.post('/ajax-administradores-active', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresDelete(id){
    return axios.post('/ajax-administradores-delete', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresReset(id) {
    return axios.post('/ajax-administradores-reset', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresGet(id) {
    return axios.post('/ajax-administradores-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresGetData() {
    return axios.post('/ajax-administradores-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresNew(data) {
    return axios.post('/ajax-administradores-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxAdministradoresEdit(id, data) {
    return axios.post('/ajax-administradores-edit', {id, data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
