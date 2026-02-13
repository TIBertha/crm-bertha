import moment from "moment";

export function cambiarEspacioPorGuion(text) {
    if (text) {
        return text.replace(/ /g, "-");
    }

    return "";
}

export function str_limit(text, limit) {
    if (text.length > limit) {
        return text.substring(0, limit) + "...";
    } else {
        return text;
    }
}

export function GetSpeechCerti(pdfLink, documentoPostulante, passwordCERTI) {
    let enun1 = "Te enviamos tu certificado de antecedentes:" + "\r\n";
    let enun2 = pdfLink + "\r\n" + "\r\n";
    let enun3 = "Cuando lo quieras actualizar entras aquí:" + "\r\n";
    let enun4 = "https://www.empleosperu.gob.pe/#/login" + "\r\n" + "\r\n";
    let enun5 = "Usuario: " + documentoPostulante + "\r\n";
    //let enun6 = 'Contraseña: ' + (passwordCERTI ? passwordCERTI : documentoPostulante) + "\r\n";
    let enun6 = "Contraseña: Bertha*123456" + "\r\n";

    return enun1 + enun2 + enun3 + enun4 + enun5 + enun6;
}

export function firstNamePost(name) {
    let SName = name.split(" ")[0];

    return SName;
}

export function getCovidCons(data) {
    let result = {
        tuvoCovidColor: "dark",
        tieneVacunaColor: "danger",
        tieneVacuna: "NO",
        tieneVacunaIconColor: "secondary",
        tieneVacunaIconTitle: "No Tiene adjunto la cartilla",
    };

    if (data.tuvo_covid == "SI") {
        result.tuvoCovidColor = "danger";
    } else if (data.tuvo_covid == "NO") {
        result.tuvoCovidColor = "success";
    }

    if (parseInt(data.tiene_vacuna) == 0) {
        result.tieneVacunaColor = "danger";
        result.tieneVacuna = "NO";
    } else {
        result.tieneVacuna = parseInt(data.tiene_vacuna) + " DOSIS";
        if (parseInt(data.tiene_vacuna) == 1) {
            result.tieneVacunaColor = "secondary";
        } else if (parseInt(data.tiene_vacuna) == 2) {
            result.tieneVacunaColor = "warning";
        } else if (parseInt(data.tiene_vacuna) >= 3) {
            result.tieneVacunaColor = "success";
        }
    }

    if (data.adjunto_cartilla == "SI") {
        if (data.cartilla_verificada == true) {
            result.tieneVacunaIconColor = "primary";
            result.tieneVacunaIconTitle =
                "Tiene adjunto la cartilla verificada";
        } else {
            result.tieneVacunaIconColor = "warning";
            result.tieneVacunaIconTitle =
                "Tiene adjunto la cartilla sin verificar";
        }
    }

    return result;
}
