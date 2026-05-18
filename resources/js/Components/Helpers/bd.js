export function setEstadosRequerimientoName(id){
    let result;
    switch (id) {
        case 1:
            result = "PENDIENTE";
            break;
        case 2:
            result = "ATENDIDO";
            break;
        case 3:
            result = "DESISTIDO";
            break;
        case 4:
            result = "POR COMPLETAR";
            break;
    }

    return result;
}
