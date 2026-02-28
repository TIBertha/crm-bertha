import axios from 'axios';

export function ajaxRefreshTestimonialesTrabajador(offset) {
    return axios.post('/ajax-refresh-testimoniales-trabajador', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesTrabajadorGetData() {
    return axios.post('/ajax-testimoniales-trabajador-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesEmpleadorGetData() {
    return axios.post('/ajax-testimoniales-empleador-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesTrabajadorGet(id) {
    return axios.post('/ajax-testimoniales-trabajador-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesTrabajadorActive(id) {
    return axios.post('/ajax-testimoniales-trabajador-active', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesTrabajadorNew(data) {
    return axios.post('/ajax-testimoniales-trabajador-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesTrabajadorEdit(id, data) {
    return axios.post('/ajax-testimoniales-trabajador-edit', {id, data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

/*--------------------------------------------------------------------------------------------*/

export function ajaxRefreshTestimonialesEmpleador(offset) {
    return axios.post('/ajax-refresh-testimoniales-empleador', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesEmpleadorGet(id) {
    return axios.post('/ajax-testimoniales-empleador-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesEmpleadorActive(id) {
    return axios.post('/ajax-testimoniales-empleador-active', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesEmpleadorNew(data) {
    return axios.post('/ajax-testimoniales-empleador-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxTestimonialesEmpleadorEdit(id, data) {
    return axios.post('/ajax-testimoniales-empleador-edit', {id, data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchTrabajadores(search){
    return axios.post('/ajax-search-trabajadores', {search})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchEmpleadores(search){
    return axios.post('/ajax-search-empleadores', {search})
        .then(res => {
            let r = res.data;
            return r;
        });
}
