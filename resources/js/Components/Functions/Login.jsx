import axios from "axios";

export function ajaxCambiarPassword(data) {
    return axios.post('/ajax-cambiar-password', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

/*export function ajaxPostLogin(telefono, password) {
    return axios.post('/ajax-post-login', {telefono, password} )
        .then(res => {
            let r = res.data;
            return r;
        });
}*/

export function ajaxPostLogin(url, telefono, password) {
    const base = document.getElementById('login').dataset.url;

    return axios.post(`${url}/ajax-post-login`, {
        telefono,
        password
    }).then(res => res.data);
}


export function ajaxPostMailGeo(data) {
    return axios.post('/ajax-post-mail-geo', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEnviarToken(correo) {
    return axios.post('/ajax-enviar-token', {correo} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxResetPassword(data) {
    return axios.post('/ajax-reset-password', {data} )
        .then(res => {
            let r = res.data;
            return r;
        });
}