import moment from "moment";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

export function GetSpeechCopyLinkLiquidador() {
    let enun1 = 'Le enviamos el enlace para que ingreses al *Sistema de Liquidaciones de Trabajadores del Hogar:*:' + "\r\n";
    let enun2 = 'https://appweb.trabajo.gob.pe/si.trabajadoreshogarexterno/' + "\r\n" + "\r\n";
    let enun3 = 'Primero, le recomendamos *ver el siguiente video*:' + "\r\n";
    let enun4 = 'https://youtu.be/DFbT8PBRMMg' + "\r\n";

    return enun1 + enun2 + enun3 + enun4;
}

export function currencySoles(number, decPlaces = 2, decSep = '.', thouSep = ',') {

    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces, decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    let sign = number < 0 ? "-" : "";
    let i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    let j = (j = i.length) > 3 ? j % 3 : 0;

    return 'S/. ' + sign + (j ? i.substr(0, j) + thouSep : "") + i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) + (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

export function cambiarEspacioPorGuion(text) {
    if (text) {
        return text.replace(/ /g, "-");
    }

    return "";
}

export function getHourReal(){
    let d = new Date();
    return d.getHours();
}

export function armarHorarioRequerimiento(modalidad) {
    let timeIngreso = moment(setHours(setMinutes(new Date(), 0), 8)).format();
    let timeSalida = [];
    if (modalidad == 5){
        timeSalida = moment(setHours(setMinutes(new Date(), 0), 14)).format();
    } else{
        timeSalida = moment(setHours(setMinutes(new Date(), 0), 17)).format();
    }
    let timeSalidaSab = moment(setHours(setMinutes(new Date(), 0), 13)).format();

    let horarioTrabajador  = [
        {
            id: 1,
            dia: 'Lunes',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: false
        },
        {
            id: 2,
            dia: 'Martes',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: false
        },
        {
            id: 3,
            dia: 'Miércoles',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: false
        },
        {
            id: 4,
            dia: 'Jueves',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: false
        },
        {
            id: 5,
            dia: 'Viernes',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: false
        },
        {
            id: 6,
            dia: 'Sábado',
            horaingreso: timeIngreso,
            horasalida: (modalidad == 2 ? timeSalidaSab : timeSalida),
            isDescanso: false
        },
        {
            id: 7,
            dia: 'Domingo',
            horaingreso: timeIngreso,
            horasalida: timeSalida,
            isDescanso: true
        }
    ];

    return horarioTrabajador;
}

export function firstName(name) {
    let SName = name.split(" ")[0];

    return toTitleCase(SName);
}

export function firstNamePost(name) {
    let SName = name.split(" ")[0];

    return SName;
}

export function mayorEdadFormated() {
    let date = new Date();
    let d = date.getDate();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let y = new Date().getFullYear() - 18;

    return y + '-' + m + '-' + d;
}

export function setDateFormatNew(date) {
    let d = date.getDate();
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let y = new Date().getFullYear();

    return y + '-' + m + '-' + d;
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function str_limit(text, limit) {
    if (text.length > limit) {
        return text.substring(0, limit) + "...";
    } else {
        return text;
    }
}

export function getPrimerNombre(nombre) {
    let n = nombre.split(' ') ;
    return n[0];
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

export function GetSpeechDespedida2() {
    let enun1 = 'Muchas gracias por su recomendación. Si algún día nos necesita, le dejo nuestra web www.holabertha.com . Que tenga un buen día.';
    let enun2 = '. ' + 'Si algún día nos necesita, le dejo nuestra web www.holabertha.com . Que tenga un buen día.';

    return enun1;
}

export function GetListAddVerificacion() {
    return [
        '*Envíanos los datos de tus recomendaciones*',
        'Nombre de tu ex empleador:',
        'Apellidos de tu ex empleador:',
        'WhatsApp de tu ex empleador:',
        'Lugar de labores:',
        'Inicio de labores (mes/año):',
        'Fin de labores (mes/año):',
        'Motivo de retiro:'
    ].join('\r\n');
}

export function removeExtensionFromString(text){
    return text.substr(0, text.lastIndexOf("."));
}

export function getExtensionFromString(text){

    const lastDot = text.lastIndexOf('.');
    return text.substring(lastDot + 1);
}

export function getSpeechLlamadaVerificacion(nombrePostulante, nombreResponsable) {
    let postName = nombrePostulante;
    let nombreEjecutivo = '';

    if (nombreResponsable === 'Jorge Wankun'){
        nombreEjecutivo = 'Gabriela Urbaez';
    }else{
        nombreEjecutivo = nombreResponsable;
    }

    let tiempo = '';
    let hora = getHourReal();

    if ((hora >= 6) && (hora <= 11) ){
        tiempo = 'Buenos días'
    }else if ((hora >= 12) && (hora <= 19)){
        tiempo = 'Buenas tardes'
    }else{
        tiempo = 'Buenas noches'
    }

    let t1 = '<p>' + tiempo + ' Sr(a). (Nombre del empleador). Soy ' + nombreEjecutivo + ' de la agencia de empleos Bertha.</p>';
    let t2 = '<p>Su ex trabajador(a) <strong>' + postName + '</strong> está buscando empleo como trabajador(a) del hogar a través de nuestra agencia. Quisiera hacerle 3 preguntas cuyas respuestas mostraremos a empleadores interesados en contratar a <strong>' + postName + '</strong>.</p>';
    let t3 = '<p>1. ¿Considera usted que es una persona honrada?</p>';
    let t4 = '<p>2. ¿Qué actividades realizó en su hogar?</p>';
    let t5 = '<p>3. Finalmente. ¿Cómo considera su trabajo? ¿Bueno o malo?</p>';
    let t6 = '<p>Muchas gracias, le enviaremos nuestra información a su WhatsApp para que sepa de donde le llamamos.</p>';

    return '<span>' + t1 + t2 + t3 + t4 + t5 + t6 + '</span>';
}

export function GetSpeechVerificacion(nombreEmpleador, nombrePostulante, apellidosPostulante, nombreResponsable){
    let tiempo = '';
    let hora = getHourReal();
    let nombreEjecutivo = '';

    if (nombreResponsable === 'Jorge Wankun'){
        nombreEjecutivo = 'Gabriela Urbaez';
    }else{
        nombreEjecutivo = nombreResponsable;
    }

    let nombreCompletoPostulante = nombrePostulante + ' ' + apellidosPostulante.charAt(0);

    let empName = firstName(nombreEmpleador);

    let enun1 = ' Sr(a). ';
    let enun2 = '. Soy ' + nombreEjecutivo + ' de la agencia de empleos Bertha (www.holabertha.com)' + "\r\n" + 'Su ex trabajador(a) ' + '*' + nombreCompletoPostulante + '.*' + ' está buscando empleo como trabajador(a) del hogar a través de nuestra agencia. Quisiera hacerle 3 preguntas cuyas respuestas mostraremos a empleadores interesados en contratar a ' + '*' + nombreCompletoPostulante + '*' + '.';
    let enun3 = "\r\n" + '1. ¿Considera usted que es una persona honrada?' + "\r\n" + '2. ¿Qué actividades realizó en su hogar?' + "\r\n" + '3. Finalmente. ¿Cómo considera su trabajo? ¿Bueno o malo?';
    let enun4 = "\r\n" + 'Por favor, agradeceríamos que nos responda con un *mensaje de voz* o texto a través de este WhatsApp. Gracias por su amabilidad';

    if ((hora >= 6) && (hora <= 11) ){
        tiempo = 'Buenos días'
    }else if ((hora >= 12) && (hora <= 19)){
        tiempo = 'Buenas tardes'
    }else{
        tiempo = 'Buenas noches'
    }

    return tiempo + enun1 + empName + enun2 + enun3 + enun4;

}

export function GetListAddEstudios() {

    let enun1 = '*Envíanos los datos de tus estudios*' + "\r\n" ;
    let enun2 = 'Tipo de Certificado (Bachiller/curso/diplomado/licenciatura/maestría):' + "\r\n" ;
    let enun3 = 'Centro de estudios:' + "\r\n" ;
    let enun4 = 'Título obtenido:' + "\r\n" ;
    let enun5 = 'Inicio de estudios (mes/año):' + "\r\n" ;
    let enun6 = 'Fin de estudios (mes/año):' + "\r\n" ;

    return enun1 + enun2 + enun3 + enun4 + enun5 + enun6 ;
}

export function forceInputUppercase(e){
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(start, end);
}

export function speechPostuladosPC(postuladosPC, nombreEmpleador, actividadNombre, actividadid, supervisor) {
    let s1 = 'Buen día Sr(ta). ' +  toTitleCase(nombreEmpleador) + ', las trabajadoras tienen cero antecedentes policiales, cero antecedentes judiciales y cero antecedentes penales, buen carácter, experiencia laboral en ' + actividadNombre.toLowerCase() + '.' +  "\r\n" + "\r\n";

    let s2 = '';

    if (actividadid == 1){
        s2 = 'Cocinan platos criollos (Lomo saltado, tallarines, ají de gallina, arroz con pollo, ensaladas, entradas, sopas, postres, etc). Limpian el mobiliario, pisos, ventanas, mamparas, electrodomésticos, adornos, etc. Conocen los productos y utensilios de limpieza. Realizan lavado a mano (Ropa delicada) y lavadora. Planchan polos, camisas, pantalones, etc.' + "\r\n" + "\r\n";
    }else if (actividadid == 6){
        s2 = 'Se encargan de la alimentación, higiene y cuidado del niño del hogar. Limpia su habitación. lava, plancha y ordena su ropa, juega y presta todo el apoyo requerido.' + "\r\n" + "\r\n";
    }else if (actividadid == 3){
        s2 = 'Se encargan de la alimentación, higiene y cuidado del paciente. Limpia su habitación. lava, plancha y ordena su ropa, juega y presta la atención médica requerida.' + "\r\n" + "\r\n";
    }else if (actividadid == 10){
        s2 = 'Se encargan de la alimentación, higiene y cuidado del adulto mayor. Limpia su habitación. lava, plancha y ordena su ropa, juega y presta todo el apoyo requerido.' + "\r\n" + "\r\n";
    }

    let s3 = postuladosPC.map((p, key) =>{
        return ((key+1) + '. ' + p.nombres + ' ' + p.apellidos + ':' + p.link + "\r\n" + (postuladosPC.length != (key +1) ? "\r\n" : ''))
    });

    let s4 = "\r\n" + '- Le hemos asignado a ' + supervisor.cargo + ' ' + supervisor.nombre + ', quien se encargará de realizar la conexión entre usted y cada postulante.' + "\r\n" + "\r\n";

    let s5 = '- Las postulantes han aceptado su pedido registrado por lo que no se pueden cambiar horarios, sueldos u otros pactados inicialmente.' + "\r\n" + "\r\n";

    let s6 = '- Usted puede conversar con las postulantes sobre sus experiencias. Si al finalizar las entrevistas, usted tiene alguna consulta sobre el servicio u otro, puede hacerlas de forma escrita o audio a través del canal Chat (No a través de ' + supervisor.cargo + '), para dejar un historial escrito de la comunicación.';



    return (s1 + s2 + s3.join("") + s4 + s5 + s6);
}
