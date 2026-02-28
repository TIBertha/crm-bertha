import axios from "axios";
import moment from "moment";

export function ajaxSearchUsuarios(id, numeroDocumento, telefono) {
    return axios.post('/ajax-search-usuarios', {id, numeroDocumento, telefono} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRegistrarUsuarioPostulante(id) {
    return axios.post('/ajax-registrar-usuario-postulante', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function setPasswordUser(id, contra, tipoUser) {
    return axios.post('/ajax-set-password-user', {id, contra, tipoUser} )
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
