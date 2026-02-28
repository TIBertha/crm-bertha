import axios from 'axios';

export function ajaxRefreshCredenciales(offset) {

    return axios.post('/ajax-refresh-credenciales', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCredencialesBuscar(data, offset) {

    return axios.post('/ajax-credenciales-buscar', {data, offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCredencialesEliminar(id) {

    return axios.post('/ajax-credenciales-eliminar', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCredencialesGet(id) {

    return axios.post('/ajax-credenciales-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCredencialesNew(data){
    return axios.post('/ajax-credenciales-new', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCredencialesEdit(data){
    return axios.post('/ajax-credenciales-edit', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
