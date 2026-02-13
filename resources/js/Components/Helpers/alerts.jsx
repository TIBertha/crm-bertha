import Swal from "sweetalert2";
import global from "./constantes";

export function showAlert(type, msj) {

    let icon = '';

    if(type == 'exito'){
        icon = '<i class="fas fa-check-circle"></i>';
    }else{
        icon = '<i class="fas fa-exclamation-circle"></i>';
    }

    Swal.fire({
        title: icon,
        text: msj,
        confirmButtonColor: '#513675',
        confirmButtonText: 'Ok'
    });

}

export function showAlertConfirmRedirect(type, msj, ruta) {

    let icon = '';

    if(type == 'exito'){
        icon = '<i class="fas fa-check-circle"></i>';
    }else{
        icon = '<i class="fas fa-exclamation-circle"></i>';
    }

    Swal.fire({
        title: icon,
        text: msj,
        showCancelButton: false,
        confirmButtonColor: '#513675',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value) {

            if(ruta != ''){
                window.location.href = ruta;
            }

        }
    });

}

export function showAlertConfirmRedirectReactRouter(type, msj, ruta, history) {

    let icon = '';

    if(type == 'exito'){
        icon = '<i class="fas fa-check-circle"></i>';
    }else{
        icon = '<i class="fas fa-exclamation-circle"></i>';
    }

    Swal.fire({
        title: icon,
        text: msj,
        showCancelButton: false,
        confirmButtonColor: '#513675',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value) {

            if(ruta != ''){
                history.push(ruta);
            }

        }
    });

}