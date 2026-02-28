import Swal from "sweetalert2";
import global from "./constantes.js";

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

export function modalCancelar(ruta, navigate) {

    Swal.fire({
        text: "¿Estás seguro de regresar al panel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: global.PURPLEBERTHA,
        confirmButtonText: "Si",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.value && ruta) {
            navigate(ruta);
        }
    });
}

export function showAlertConfirmRedirect(type, msj, ruta) {

    let icon = '<i class="fas fa-' + (type === 'exito' ? 'check' : 'exclamation') + '-circle"></i>';

    Swal.fire({
        title: icon,
        text: msj,
        showCancelButton: false,
        confirmButtonColor: '#513675',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value && ruta) {
            window.location.href = ruta;
        }
    });

}

export function showAlertConfirmRedirectReactRouter(type, msj, ruta, navigate) {

    let icon = '<i class="fas fa-' + (type === 'exito' ? 'check' : 'exclamation') + '-circle"></i>';

    Swal.fire({
        title: icon,
        text: msj,
        showCancelButton: false,
        confirmButtonColor: '#513675',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value && ruta) {
            navigate(ruta);
        }
    });

}
