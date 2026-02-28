import axios from "axios";

export function ajaxRequerimientosNew(data, horasalida, horaretorno, horaentrevista){
    return axios.post('/ajax-requerimientos-new', {data, horasalida, horaretorno,horaentrevista} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosEdit(data, id, horasalida, horaretorno, horaentrevista){
    return axios.post('/ajax-requerimientos-edit', {data, id, horasalida, horaretorno, horaentrevista} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetPostulaciones(requerimientoid, filtro) {

    return axios.post('/ajax-get-postulaciones', {requerimientoid, filtro} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxGetCopysRequerimiento(idReq) {

    return axios.post('/ajax-get-copys-requerimiento', {idReq} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxPostulacionesRemover(requerimientopostulacionid) {

    return axios.post('/ajax-postulaciones-remover', {requerimientopostulacionid} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxPostulacionesSelectWhatsapp(requerimientopostulacionid) {

    return axios.post('/ajax-postulaciones-select-whatsapp', {requerimientopostulacionid} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxPostulacioneAscender(requerimientopostulacionid) {

    return axios.post('/ajax-postulaciones-ascender', {requerimientopostulacionid} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxListaPostulantesAdd(requerimientoid, search) {

    return axios.post('/ajax-lista-postulantes-add', {requerimientoid, search} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxActionAddPostulante(requerimientoid, trabajadorid) {

    return axios.post('/ajax-action-add-postulante', {requerimientoid, trabajadorid} )
        .then(res => {
            let r = res.data;
            return r;
        });

}

export function ajaxLoadEntrevistasRequerimiento(fecha) {
    return axios.post('/ajax-load-entrevistas-requerimiento', {fecha} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetEntrevistasRequerimiento(fecha) {
    return axios.post('/ajax-get-entrevistas-requerimiento', {fecha} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function cambiarFechasEntrevista(fecha) {
    return axios.post('/ajax-cambiar-fechas-entrevista', {fecha} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

/*--Formulario Requerimiento--*/

export function ajaxRequerimientosGetData() {
    return axios.post('/ajax-requerimientos-get-data', {})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSetDistrito(domicilio){
    return axios.post('/ajax-set-distrito', {domicilio})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosUploadAdjuntoAdelanto(formData){
    return axios.post('/ajax-requerimientos-upload-adjunto-adelanto', formData)
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSetDivisaPais(paisID){
    return axios.post('/ajax-set-divisa-pais', {paisID})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSetNewTiposBeneficios(paisID){
    return axios.post('/ajax-set-new-tipos-beneficios', {paisID})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSaveNewEmpleador(nuevoEmpleador){
    return axios.post('/ajax-save-new-empleador', {nuevoEmpleador})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSaveNewDomicilioEmpleador(nuevoDomicilio, empleador) {
    return axios.post('/ajax-save-new-domicilio-empleador', {nuevoDomicilio, empleador})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetCorreoEmpleador(id) {
    return axios.post('/ajax-get-correo-empleador', {id})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosGetDataInicial() {

    return axios.post('/ajax-requerimientos-get-data-inicial', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosBuscar(data, offset) {

    return axios.post('/ajax-requerimientos-buscar', {data,offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosGet(id) {
    return axios.post('/ajax-requerimientos-get', {id} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRequerimientosGetModalidad(actividad) {
    return axios.post('/ajax-requerimientos-get-modalidad', {actividad})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxDuplicarRequerimiento(idRequerimiento) {
    return axios.post('/ajax-duplicar-requerimiento', {idRequerimiento})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxSearchDistrito(search){
    return axios.post('/ajax-search-distrito', {search})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxGetPostulantesAntiguasMostradas(idEmpleador, idRequerimiento){
    return axios.post('/ajax-get-postulantes-antiguas-mostradas', {idEmpleador, idRequerimiento})
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

export function ajaxSearchTrabajadoresPorColocar(search){
    return axios.post('/ajax-search-trabajadores-por-colocar', {search})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function changeEstadoReqPendiente(id) {
    return axios.post('/ajax-requerimientos-pendiente', {id})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxCambiarEstadoReq(id, estado) {
    return axios.post('/ajax-cambiar-estado-requerimientos', {id, estado})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxEntrevistaSwitch(id){
    return axios.post('/ajax-entrevista-switch', {id})
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function ajaxRefreshRequerimientos(fastsearch, offset) {

    return axios.post('/ajax-refresh-requerimientos', {fastsearch,offset} )
        .then(res => {
            let r = res.data;
            return r;
        });
}

export function getModalidadName(val, pais) {
    if (['pe'].includes(pais)){
        if (parseInt(val) == 1){
            return 'CAMA ADENTRO';
        }else if (parseInt(val) == 2){
            return 'CAMA AFUERA';
        }else if (parseInt(val) == 3){
            return 'POR DÍAS';
        }
    }else if (['mx'].includes(pais)){
        if (parseInt(val) == 1){
            return 'DE QUEDADA';
        }else if (parseInt(val) == 2){
            return 'ENTRADA POR SALIDA';
        }else if (parseInt(val) == 3){
            return 'POR DÍAS';
        }
    }else if (['cl'].includes(pais)){
        if (parseInt(val) == 1){
            return 'PUERTA ADENTRO';
        }else if (parseInt(val) == 2){
            return 'PUERTA AFUERA';
        }else if (parseInt(val) == 3){
            return 'POR DÍAS';
        }
    }
}

export function getCostoPorDia(paisPedido, valorDia, valorDiaFrecuencia){
    let result = 0;

    if (paisPedido == 11){
        if (valorDiaFrecuencia >= 30000){
            result = valorDiaFrecuencia;
        }else{
            result = 30000;
        }
    }else if (paisPedido == 54){
        if ((valorDiaFrecuencia >= 80) && (valorDiaFrecuencia <= 1000) ){
            result = valorDiaFrecuencia;
        }else{
            result = 80;
        }
    }else if (paisPedido == 49){
        if ((valorDiaFrecuencia >= 350) && (valorDiaFrecuencia <= 4400) ){
            result = valorDiaFrecuencia;
        }else{
            result = 350;
        }
    }

    return result;
}

export function getValordiaFrecuencia(paisPedido){
    let minValue = 0;

    if (paisPedido == 54){
        minValue = 70;
    }else if (paisPedido == 11){
        minValue = 30000;
    }else if (paisPedido == 49){
        minValue = 300;
    }

    return minValue;
}

export function getSueldoPrimerMes(value, paisPedido, isFloat = true){
    let result = 0;

    let valor = ((isFloat == true) ? value.floatValue : value);

    if (parseInt(paisPedido) == 54){
        if(valor >= 1400){
            result = valor - 400;
        }else{
            if (valor >= 1350){
                result = 1000;
            }else{
                result = 930;
            }
        }
    }else if (parseInt(paisPedido) == 11){
        if (valor >= 500000){
            result = valor - 100000;
        }else {
            result = 400000;
        }
    }else if (parseInt(paisPedido) == 49){
        if (valor >= 2000){
            result = valor - 2000;
        }else {
            result = 2000;
        }
    }

    return result;
}

export function getMontoComision(inputComision, inputSueldo, inputModalidad, dataReq){
    let {sueldo, modalidad, tipoComision, paispedido} = dataReq;

    let newComision = (inputComision ? inputComision : tipoComision);
    let newSueldo = (inputSueldo ? inputSueldo : sueldo);
    let newModalidad = (inputModalidad ? inputModalidad : modalidad);
    let com = 0;

    if (paispedido == 54){
        if (parseInt(newComision) == 1){
            if ([1,2,5].includes(parseInt(newModalidad))){
                com = 700;
            }else{
                com = 500;
            }
        }else if (parseInt(newComision) == 2){
            if ([1,2,5].includes(parseInt(newModalidad))){
                com = (newSueldo >= 1200) ? 500 : 400
            }else{
                com = 400;
            }
        }else if (parseInt(newComision) == 3){
            if ([1,2,5].includes(parseInt(newModalidad))){
                if(newSueldo >= 1200 && newSueldo <= 1250){
                    com = 350;
                }else if (newSueldo == 1300){
                    com = 370;
                }else if (newSueldo == 1350){
                    com = 350;
                }else if (newSueldo >= 1400){
                    com = 400;
                }
            }else{
                com = 350;
            }
        }
    }else if (paispedido == 49){
        if ([1,2].includes(parseInt(newModalidad))){
            com = 2000;
        }else if (parseInt(newModalidad) == 3){
            com = 1800;
        }
    }



    return com;
}
