export function GetRequisitosViewPostulantes2(data) {
    const array = [];

    if (data) {
        array.push("*Envianos lo siguiente:*" + "\r\n");

        if (!data.nombres || data.nombres == "") {
            array.push("- Tu(s) nombre(s)");
        }
        if (!data.apellidos || data.apellidos == "") {
            array.push("- Tus apellidos");
        }
        if (!data.genero || data.genero == "") {
            array.push("- Tu género");
        }
        if (!data.telefono || data.telefono == "") {
            array.push("- Tu celular");
        }
        if (!data.telefonowhatsapp || data.telefonowhatsapp == "") {
            array.push("- Tu WhatsApp");
        }
        if (!data.tipodocumento || data.tipodocumento == "") {
            array.push("- Tu tipo de documento");
        }
        if (!data.numerodocumento || data.numerodocumento == "") {
            array.push("- Tu número de documento");
        }
        if (!data.estadocivil || data.estadocivil == "") {
            array.push("- Tu estado civil");
        }
        if (!data.fechanacimiento || data.fechanacimiento == "") {
            array.push("- Tu fecha de nacimiento");
        }
        if (!data.numhijos || data.numhijos == "") {
            array.push("- Si tienes hijos, sus respectivas edades");
        }
        if (!data.paisprocedencia || data.paisprocedencia == "") {
            array.push("- Tu país de nacimiento");
        }
        if (!data.paisprocedencia || data.paisprocedencia == "") {
            array.push("- Tu país de nacimiento");
        } else if (data.paisprocedencia) {
            if (
                ["4", "13", "18", "49", "54", "68"].includes(
                    data.paisprocedencia,
                )
            ) {
                if (
                    !data.departamentonacimiento ||
                    data.departamentonacimiento == ""
                ) {
                    array.push("- La ciudad donde naciste");
                }
            } else {
                if (!data.lugarnacimiento || data.lugarnacimiento == "") {
                    array.push("- El lugar donde naciste");
                }
            }
        }
        if (!data.distrito || data.distrito == "") {
            array.push("- El distrito donde estas viviendo actualmente");
        }
        if (!data.direccion || data.direccion == "") {
            array.push("- La dirección donde estas viviendo actualmente");
        }
        if (!data.idioma || data.idioma == "") {
            array.push("- ¿Qué idiomas sabes?");
        }
        if (!data.foto || data.foto == "") {
            array.push(
                "- Una foto tuya tipo carnet (Ejemplo: https://holabertha.com/docs/foto-referencial)",
            );
        }
        if (!data.fotodnidelantera || data.fotodnidelantera == "") {
            array.push(
                "- Una foto de la parte delantera de tu documento de identidad",
            );
        }
        if (!data.fotodnitrasera || data.fotodnitrasera == "") {
            array.push(
                "- Una foto de la parte posterior de tu documento de identidad",
            );
        }
        if (data.isChofer == true) {
            if (
                !data.fotolicenciadelantera ||
                data.fotolicenciadelantera == ""
            ) {
                array.push(
                    "- Una foto de la parte delantera de tu licencia de conducir",
                );
            }
            if (!data.fotolicenciatrasera || data.fotolicenciatrasera == "") {
                array.push(
                    "- Una foto de la parte posterior de tu licencia de conducir",
                );
            }
        }
        if (
            !data.fotorecibo ||
            data.fotorecibo == "" ||
            data.fotorecibo.length == 0
        ) {
            array.push("- Una foto de tu recibo de luz o agua");
        }
        if (!data.tuvocovid || data.tuvocovid == "") {
            array.push("- ¿Llegaste a contraer el virus del COVID-19?");
        }
        if (!data.tienevacuna || data.tienevacuna == "") {
            array.push("- ¿Estás vacunada contra el COVID-19?¿Cuantas dosis?");
        }
        if (!data.niveleducativo || data.niveleducativo == "") {
            array.push(
                "- Tu grado de educación [Inicial/Primaria/Secundaria/Tecnica/Universitaria]",
            );
        }
    }

    return array.join("\r\n");
}

export function getStatusContact(historial) {
    let wereContacted = historial.length != 0 ? true : false;

    let lastContact = null;
    let statusContact = "none";

    if (wereContacted == true) {
        lastContact = historial[historial.length - 1];

        if (lastContact.diasPasados >= 0 && lastContact.diasPasados <= 5) {
            statusContact = "fresh";
        } else if (
            lastContact.diasPasados >= 6 &&
            lastContact.diasPasados <= 10
        ) {
            statusContact = "mid";
        } else if (
            lastContact.diasPasados >= 11 &&
            lastContact.diasPasados <= 15
        ) {
            statusContact = "raw";
        }
    }

    return statusContact;
}
