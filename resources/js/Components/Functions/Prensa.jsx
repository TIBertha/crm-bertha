import axios from "axios";

export function ajaxPrensaNew(data) {
    return axios.post('/ajax-prensa-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxPrensaEdit(data) {
    return axios.post('/ajax-prensa-edit', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxPrensaAction(id, url) {

    return axios.post(url, {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxPrensaGetData() {

    return axios.post('/ajax-prensa-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxPrensaGet(id) {

    return axios.post('/ajax-prensa-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRefreshPrensa(offset) {

    return axios.post('/ajax-refresh-prensa', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
