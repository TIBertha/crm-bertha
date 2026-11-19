import React from "react";
import VerHistorialContacto from "../Modals/verHistorialContacto.jsx";
import { getStatusContact } from "../../../Helpers/postulantes.js";

export default function HistorialContacto({
                                              historial = [],
                                              handleContactado,
                                              trabajador,
                                          }) {
    const contactos = Array.isArray(historial) ? historial : [];
    const lastContact = contactos[contactos.length - 1] ?? null;

    let statusContact = getStatusContact(contactos);

    if (lastContact) {
        const dias = Number(lastContact.diasPasados);

        if (dias >= 0 && dias <= 30) {
            statusContact = "fresh";
        } else if (dias >= 31 && dias <= 60) {
            statusContact = "mid";
        } else if (dias >= 61) {
            statusContact = "raw";
        }
    }

    const tooltip = lastContact
        ? Number(lastContact.diasPasados) === 0
            ? "Hoy fue contactada la trabajadora"
            : `La trabajadora fue contactada hace ${lastContact.diasPasados} día(s)`
        : "La trabajadora aún no es contactada";

    return (
        <div className="postulante-contacto">
            <ul className="postulante-contacto__lista">
                <li className="postulante-contacto__item">
                    <button
                        type="button"
                        className={
                            "postulante-contacto__boton" +
                            (lastContact
                                ? ` es-${statusContact}`
                                : " es-sin-contacto")
                        }
                        onClick={handleContactado}
                        title={tooltip}
                        aria-label={`${tooltip}. Registrar contacto`}
                    >
                        <i
                            className="fas fa-phone-alt"
                            aria-hidden="true"
                        ></i>
                    </button>
                </li>

                {lastContact && (
                    <VerHistorialContacto
                        historial={contactos}
                        trabajador={trabajador}
                    />
                )}
            </ul>
        </div>
    );
}
