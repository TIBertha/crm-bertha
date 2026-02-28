import axios from 'axios';

export function ajaxRefreshUsuariosInternos(offset) {

    return axios.post('/ajax-refresh-usuarios-internos', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxVerificarNumero(numero, tipo) {

    return axios.post('/ajax-verificar-numero', {numero, tipo} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetUsuariosInternos() {
    return axios.post('/ajax-get-usuarios-internos', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSetPasswordUsuariosInternos(id, contra) {
    return axios.post('/ajax-set-password-usuarios-internos', {id, contra} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
