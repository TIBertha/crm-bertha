export function getActividadName(val, pais) {

    if (['pe'].includes(pais)){
        if(parseInt(val) == 1){
            return 'TODO SERVICIO';
        }else if (parseInt(val) == 3){
            return 'ENFERMERA';
        }else if (parseInt(val) == 6){
            return 'NANA';
        }else if (parseInt(val) == 10){
            return 'CUIDADO ADULTO MAYOR';
        }
    }else if (['cl', 'mx'].includes(pais)){
        if(parseInt(val) == 1){
            return 'NANA';
        }else if (parseInt(val) == 3){
            return 'ENFERMERA';
        }else if (parseInt(val) == 6){
            return 'NIÑERA';
        }else if (parseInt(val) == 10){
            return 'CUIDADO ADULTO MAYOR';
        }
    }
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

export function findFichaByActividadCamaAdentro(id){
    let result = '';

    if(id === '1'){
        result =  'https://holabertha.com/ficha-postulante/veli-m-GNTFsV';
    }else if (id === '3'){
        result =  'https://holabertha.com/ficha-postulante/luisa-i-pKqST2';
    }else if (id === '6'){
        result =  'https://holabertha.com/ficha-postulante/yesica-c-TZfyow';
    }else if (id === '10'){
        result =  'https://holabertha.com/ficha-postulante/celia-o-Mi6YrY';
    }

    return result;
}

export function findFichaByActividadCamaAfuera(id){
    let result = '';

    if(id === 1){
        result =  'https://holabertha.com/ficha-postulante/margaret-c-yCUIE6';
    }else if (id === 3){
        result =  'https://holabertha.com/ficha-postulante/milagros-m-RIR6U5';
    }else if (id === 6){
        result =  'https://holabertha.com/ficha-postulante/ana-a-y2fnME';
    }else if (id === 10){
        result =  'https://holabertha.com/ficha-postulante/celia-o-Mi6YrY';
    }

    return result;
}
