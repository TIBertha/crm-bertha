import axios from "axios";

export function ajaxRefreshContratos(offset) {

    return axios.post('/ajax-refresh-contratos', {offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosGet(id) {
    return axios.post('/ajax-contratos-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosGetDataInicial() {

    return axios.post('/ajax-contratos-get-data-inicial', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosBuscar(data, offset) {
    return axios.post('/ajax-contratos-buscar', {data, offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosFinalizar(id) {
    return axios.post('/ajax-contratos-finalizar', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosReenviarMailComprobante(id) {
    return axios.post('/ajax-contratos-reenviar-mail-comprobante', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosReenviarMailTrabajador(id) {
    return axios.post('/ajax-contratos-reenviar-mail-trabajador', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSetVerifIngresoContrato(id, condition) {
    return axios.post('/ajax-set-verif-ingreso-contrato', {id, condition} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetDataModalDetallesContratos(idCont) {

    return axios.post('/ajax-get-data-modal-detalles-contrato', {idCont} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxGetCopysContratos(idCont) {

    return axios.post('/ajax-get-copys-contrato', {idCont} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxLoadDataCambioEstados(idContrato) {
    return axios.post('/ajax-load-data-cambio-estados', {idContrato} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSaveDataCambiosEstadosContratos(idContrato, estadoCont, estadoPost, estadoReq) {
    return axios.post('/ajax-save-data-cambios-estados-contratos', {idContrato, estadoCont, estadoPost, estadoReq} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxContratosGetData() {

    return axios.post('/ajax-contratos-get-data', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxExcludePostulante(postulante){
    return axios.post('/ajax-exclude-postulante', {postulante} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetContratosRequerimiento(id){
    return axios.post('/ajax-get-contratos-requerimiento', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetContratosRequerimientosDomicilios(empleador){
    return axios.post('/ajax-get-contratos-requerimientos-domicilios', {empleador} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetVerificacionPorDias(id){
    return axios.post('/ajax-get-verificacion-por-dias', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function getCalculoTotal(cont, gan, tot, tipocontrato, paispedido, tipocomision, modalidad){
    let total = 0;
    if(cont){
        if(tipocontrato == 1){
            if(paispedido == 54){
                if(tipocomision == 1){
                    if(gan == 0){
                        total = 0;
                    }else if(gan >= 6){
                        if(modalidad == 3){
                            total = 500;
                        }else{
                            total = 700;
                        }
                    }else if(gan < 6){
                        total = 700;
                    }
                }else if(tipocomision == 2){
                    if(gan == 0){
                        total = 0;
                    }else if(gan >= 3){
                        if(modalidad == 3){
                            total = 500;
                        }else{
                            total = 700;
                        }
                    }else if(gan < 3){
                        total = 0;
                    }
                }else if(tipocomision == 3){
                    if(modalidad == 3){
                        total = 500;
                    }else{
                        total = 700;
                    }
                }else if(tipocomision == 4){
                    if(modalidad == 3){
                        total = 500;
                    }else{
                        total = 700;
                    }
                }
            }else{
                total = 120000;
            }
        }else if(tipocontrato == 2){
            if(paispedido == 54){
                if(modalidad == 3){
                    total = tot * 0.30 - 0;
                }else{
                    total = tot * 0.30 - 0;
                }
            }
        }else if(tipocontrato == 3){
            if(paispedido == 54){
                total = tot * 0;
            }
        }
    }else{
        total = 0;
    }

    return total;
}
