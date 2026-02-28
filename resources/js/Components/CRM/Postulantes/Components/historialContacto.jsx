import React from "react";
import VerHistorialContacto from "../Modals/verHistorialContacto.jsx";
import {getStatusContact} from "../../../Helpers/postulantes.js";

export default function HistorialContacto({historial, handleContactado, trabajador}) {
    let wereContacted = (historial.length != 0 ? true : false);

    let lastContact = null;
    let statusContact = getStatusContact(historial);

    if (wereContacted === true){
        lastContact = historial[historial.length - 1];

        if (lastContact.diasPasados >= 0 && lastContact.diasPasados <=30){
            statusContact = 'fresh';
        }else if (lastContact.diasPasados >= 31 && lastContact.diasPasados <=60){
            statusContact = 'mid';
        }else if (lastContact.diasPasados >= 61){
            statusContact = 'raw';
        }
    }

    return(
        <div className={'historialContacto'}>
            <ul>
                <li onClick={(e) => handleContactado(e)} className={(wereContacted == true ? ('contacted ' + statusContact) : '')} data-toggle="tooltip" data-placement="bottom" title={lastContact ? (lastContact.diasPasados == 0 ? 'Hoy fue contactada la trabajadora' : 'La trabajadora fue contactada hace ' + lastContact.diasPasados + ' día(s)') : 'La trabajadora aún no es contactada'}>
                    <i className="fas fa-phone-alt"></i>
                </li>

                {(wereContacted === true) &&
                    <VerHistorialContacto historial={historial} trabajador={trabajador}/>
                }
            </ul>
        </div>
    )
}
