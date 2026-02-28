import axios from "axios";

import {getActividadName, getModalidadName, findFichaByActividadCamaAdentro, findFichaByActividadCamaAfuera } from "../Helpers/requerimientos.js"
import {toPesos3} from "./General.jsx"

export function getSpeechCotizador(actividadID, modalidadID, sueldoIngresado, frecuencia, garantia, pais) {

    let result = '';
    let actividad = getActividadName(actividadID, pais);
    let modalidad = getModalidadName(modalidadID, pais);

    let sueldo = 0;
    let divisa = null;

    let speechCDCF = null;
    let speechPH = null;
    let speechPH1VezPorSemana = null;
    let speechPH3VecesPorSemana = null;

    if (pais == 'pe'){
        sueldo = sueldoIngresado;
        divisa = 'soles';

        let nuevSueldo = parseInt(sueldoIngresado.replace(',', ''));

        let st = nuevSueldo >= 1400 ? (nuevSueldo - 400) : 930;
        let sl = nuevSueldo - 20;
        let slRest = ((nuevSueldo * frecuencia * 4) - (sl  * frecuencia * 4));

        let com2 = (nuevSueldo >= 1200) ? 500 : 400;
        let com3 = 350;

        if ([1,2].includes(parseInt(modalidadID))){
            if(nuevSueldo >= 1200 && nuevSueldo <= 1250){
                com3 = 350;
            }else if (nuevSueldo == 1300){
                com3 = 370;
            }else if (nuevSueldo == 1350){
                com3 = 350;
            }else if (nuevSueldo >= 1400){
                com3 = 400;
            }
        }else{
            com2 = 400;
            com3 = 350;
        }

        speechCDCF =
            'Le enviamos la cotización:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: ' + sueldo + ' ' + divisa + "\r\n" +
            '- Pago a agencia: Le enviamos 3 tipos de comisiones para que escoja la de su preferencia:' + "\r\n" +  "\r\n" +
            '*Comisión 1*: ' + '*700 ' + divisa +' y ahorra 400 ' + divisa + '*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *3 meses*.' + "\r\n" +  "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + ( nuevSueldo == 1350 ? '1,000' : toPesos3(st)) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + ( nuevSueldo == 1350 ? 350 : (nuevSueldo - st) ) + ' ' + divisa +'* (' + (sueldoIngresado) + ' ' + divisa +' - ' + (nuevSueldo == 1350 ? '1,000' :  toPesos3(st)) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + sueldo + ' ' + divisa +'.' + "\r\n" + "\r\n" +

            'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + (nuevSueldo == 1350 ? 1000 : toPesos3(st) ) + ' ' + divisa +').' + "\r\n" + "\r\n" +

            '*Después* del primer mes, el precio del reemplazo es de *' + ( nuevSueldo == 1350 ? 350 : (nuevSueldo - st) ) + ' ' + divisa +'*. Le enviaremos un nuevo trabajador que le pagará ' + ( nuevSueldo == 1350 ? toPesos3(1000) : toPesos3(st) ) + ' ' + divisa +' y tendrá *un nuevo ahorro de ' + ( nuevSueldo == 1350 ? 350 :  (nuevSueldo - st) ) + ' ' + divisa +'*. ' + "\r\n" + "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *100 ' + divisa +'* que serán descontados de la comisión. Le enviaremos los currículos de *2* trabajadores, *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. Las *entrevistas* son por *videollamada* o llamada. Luego de escoger, abonará el restante de la comisión (600 ' + divisa +'). Los precios incluyen IGV.' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 100 ' + divisa +'* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* ' + (modalidadID == 1 ? findFichaByActividadCamaAdentro(actividadID) : findFichaByActividadCamaAfuera(actividadID)) + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.' + "\r\n" + "\r\n" +

            'También podemos ayudarle con estos *2 otros tipos de comisiones*:' + "\r\n" + "\r\n" +

            '*Comisión 2*: ' + com2 + ' ' + divisa + ' (100 ' + divisa + ' adelantado + ' + (com2 - 100) + ' *luego de entrevistas*), usted *ahorra ' + ( nuevSueldo == 1350 ? 350 : (nuevSueldo - st) ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            '*Comisión 3 (Precio más bajo)*: *' + com3 + ' ' + divisa + ' (por adelantado)*. Luego de enviados los currículos, usted escoge viendo fotos, videos, documentos del currículo. *No hay entrevistas laborales*. Usted *ahorra ' + ( nuevSueldo == 1350 ? 350 : (nuevSueldo - st) ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            'Usted puede escoger la comisión 1, 2 o 3 (menor precio) y agendaremos su atención por favor.'
        ;

        speechPH =
            'Si usted busca una trabajadora ' + frecuencia + ' veces por semana:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: ' + sueldo + ' al día, ' + ((nuevSueldo * frecuencia * 4)) + ' al mes (' + frecuencia + ' veces a la semana x 4 semanas = 1 mes). ' + (frecuencia == 1234 ? 'Puede escoger Martes y jueves, Martes y sábado o Jueves y sábado.' : '') + "\r\n" +
            '- Pago a agencia: Le enviamos 3 tipos de comisiones para que escoja la de su preferencia:' + "\r\n" +  "\r\n" +
            '*Comisión 1*: ' + '*500 ' + divisa + ' y ahorra ' + ( slRest ) + ' ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *3 meses*.' + "\r\n" + "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + (toPesos3(sl  * frecuencia * 4)) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + ( slRest ) + ' ' + divisa +'* (' + ( (nuevSueldo * frecuencia * 4) ) + ' - ' + ( toPesos3(sl  * frecuencia * 4) ) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + (nuevSueldo * frecuencia * 4) + ' ' + divisa +'.' + "\r\n" + "\r\n" +

            'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + ((sl  * frecuencia * 4)) + ' ' + divisa +').' + "\r\n" + "\r\n" +

            '*Después* del primer mes, el precio del reemplazo es de *' + ( slRest ) + ' ' + divisa +'*. Le enviaremos un nuevo trabajador que le pagará ' + ((sl  * frecuencia * 4)) + ' ' + divisa +' y tendrá *un nuevo ahorro de ' + ( slRest ) + ' ' + divisa +'*.' + "\r\n" + "\r\n" +

            '- Pago por beneficios laborales (gratificaciones, CTS y vacaciones): No existe' + "\r\n" +  "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *100 ' + divisa +'* que serán descontados de la comisión. Le enviaremos los currículos de *2* trabajadores, *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. Las *entrevistas* son por *videollamada* o llamada. Luego de escoger, abonará el restante de la comisión (400 ' + divisa +'). Los precios incluyen IGV.' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 100 ' + divisa +'* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* ' + (findFichaByActividadCamaAfuera(actividadID)) + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.' + "\r\n" + "\r\n" +

            'También podemos ayudarle con estos *2 otros tipos de comisiones*:' + "\r\n" + "\r\n" +

            '*Comisión 2*: ' + com2 + ' ' + divisa + ' (100 ' + divisa + ' adelantado + ' + (com2 - 100) + ' *luego de entrevistas*), usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            '*Comisión 3 (Precio más bajo)*: *' + com3 + ' ' + divisa + ' (por adelantado)*. Luego de enviados los currículos, usted escoge viendo fotos, videos, documentos del currículo. *No hay entrevistas laborales*. Usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            'Usted puede escoger la comisión 1, 2 o 3 (menor precio) y agendaremos su atención por favor.'
        ;

        speechPH1VezPorSemana =
            'Si usted busca una trabajadora ' + frecuencia + ' vez por semana:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: ' + sueldo + ' al día, ' + ((nuevSueldo * frecuencia * 4)) + ' al mes (' + frecuencia + ' vez a la semana x 4 semanas = 1 mes). ' + "\r\n" +
            '- Pago a agencia: Le enviamos 3 tipos de comisiones para que escoja la de su preferencia:' + "\r\n" +  "\r\n" +
            '*Comisión 1*: ' + '*500 ' + divisa + ' y ahorra ' + ( slRest ) + ' ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *3 meses*.' + "\r\n" + "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + (toPesos3(sl  * frecuencia * 4)) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + ( slRest ) + ' ' + divisa +'* (' + ( (nuevSueldo * frecuencia * 4) ) + ' - ' + ( toPesos3(sl  * frecuencia * 4) ) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + (nuevSueldo * frecuencia * 4) + ' ' + divisa +'.' + "\r\n" + "\r\n" +

            'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + ((sl  * frecuencia * 4)) + ' ' + divisa +').' + "\r\n" + "\r\n" +

            '*Después* del primer mes, el precio del reemplazo es de *' + ( slRest ) + ' ' + divisa +'*. Le enviaremos un nuevo trabajador que le pagará ' + ((sl  * frecuencia * 4)) + ' ' + divisa +' y tendrá *un nuevo ahorro de ' + ( slRest ) + ' ' + divisa +'*.' + "\r\n" + "\r\n" +

            '- Pago por beneficios laborales (gratificaciones, CTS y vacaciones): No existe' + "\r\n" +  "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *100 ' + divisa +'* que serán descontados de la comisión. Le enviaremos los currículos de *2* trabajadores, *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. Las *entrevistas* son por *videollamada* o llamada. Luego de escoger, abonará el restante de la comisión (400 ' + divisa +'). Los precios incluyen IGV.' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 100 ' + divisa +'* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* ' + (findFichaByActividadCamaAfuera(actividadID)) + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.' + "\r\n" + "\r\n" +

            'También podemos ayudarle con estos *2 otros tipos de comisiones*:' + "\r\n" + "\r\n" +

            '*Comisión 2*: ' + com2 + ' ' + divisa + ' (100 ' + divisa + ' adelantado + ' + (com2 - 100) + ' *luego de entrevistas*), usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            '*Comisión 3 (Precio más bajo)*: *' + com3 + ' ' + divisa + ' (por adelantado)*. Luego de enviados los currículos, usted escoge viendo fotos, videos, documentos del currículo. *No hay entrevistas laborales*. Usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            'Usted puede escoger la comisión 1, 2 o 3 (menor precio) y agendaremos su atención por favor.'
        ;

        speechPH3VecesPorSemana =
            'Si usted busca una trabajadora ' + frecuencia + ' veces por semana:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: ' + sueldo + ' al día, ' + ((nuevSueldo * frecuencia * 4).toFixed(1)) + ' al mes (' + frecuencia + ' veces a la semana x 4 semanas = 12 servicios o 1 mes). ' + "\r\n" +
            '- Pago a agencia: Le enviamos 3 tipos de comisiones para que escoja la de su preferencia:' + "\r\n" +  "\r\n" +
            '*Comisión 1*: ' + '*500 ' + divisa + ' y ahorra ' + ( slRest ) + ' ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *3 meses*.' + "\r\n" + "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + (toPesos3(sl  * frecuencia * 4)) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + ( slRest ) + ' ' + divisa +'* (' + ( (nuevSueldo * frecuencia * 4) ) + ' - ' + ( toPesos3(sl  * frecuencia * 4) ) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + (nuevSueldo * frecuencia * 4) + ' ' + divisa +'.' + "\r\n" + "\r\n" +

            'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + ((sl  * frecuencia * 4)) + ' ' + divisa +').' + "\r\n" + "\r\n" +

            '*Después* del primer mes, el precio del reemplazo es de *' + ( slRest ) + ' ' + divisa +'*. Le enviaremos un nuevo trabajador que le pagará ' + ((sl  * frecuencia * 4)) + ' ' + divisa +' y tendrá *un nuevo ahorro de ' + ( slRest ) + ' ' + divisa +'*.' + "\r\n" + "\r\n" +

            '- Pago por beneficios laborales (gratificaciones, CTS y vacaciones): No existe' + "\r\n" +  "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *100 ' + divisa +'* que serán descontados de la comisión. Le enviaremos los currículos de *2* trabajadores, *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. Las *entrevistas* son por *videollamada* o llamada. Luego de escoger, abonará el restante de la comisión (400 ' + divisa +'). Los precios incluyen IGV.' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 100 ' + divisa +'* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* ' + (findFichaByActividadCamaAfuera(actividadID)) + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.' + "\r\n" + "\r\n" +

            'También podemos ayudarle con estos *2 otros tipos de comisiones*:' + "\r\n" + "\r\n" +

            '*Comisión 2*: ' + com2 + ' ' + divisa + ' (100 ' + divisa + ' adelantado + ' + (com2 - 100) + ' *luego de entrevistas*), usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            '*Comisión 3 (Precio más bajo)*: *' + com3 + ' ' + divisa + ' (por adelantado)*. Luego de enviados los currículos, usted escoge viendo fotos, videos, documentos del currículo. *No hay entrevistas laborales*. Usted *ahorra ' + ( slRest ) + '* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.' + "\r\n" + "\r\n" +

            'Usted puede escoger la comisión 1, 2 o 3 (menor precio) y agendaremos su atención por favor.'
        ;

    }else if (pais == 'cl'){

        sueldo = sueldoIngresado;
        let nuevSueldo = pesosStringToNumber(sueldoIngresado);
        let primpag = nuevSueldo - 100000;
        let primerpago = toPesos(primpag);
        let sl = (nuevSueldo * frecuencia * 4) - (nuevSueldo * frecuencia);
        let slRest = (nuevSueldo * frecuencia);
        divisa = 'pesos';

        speechCDCF =
            'Le enviamos la cotización:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: *' + sueldo + ' ' + divisa + '*' + "\r\n" +
            '- Comisión agencia: ' + '*120,000 ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite por *1 mes*.' + "\r\n" + "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + toPesos(primerpago) + ' ' + divisa + '.  Así usted tendrá un *ahorro de 100,000 pesos*. El segundo mes, le aumenta a ' + sueldo + ' ' + divisa +'.' + "\r\n" + "\r\n" +
            'El período de prueba (*primer mes*) le servirá para evaluar a la trabajadora; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + primerpago + ' ' + divisa + ').' + "\r\n" + "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *20,000 pesos* que serán descontados de la comisión. Le enviaremos los currículos de 2 trabajadoras, *sin antecedentes*, con *buen carácter* y con *experiencia* laboral. Luego de escoger, abonará el restante de la comisión (100,000 pesos)' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 20,000 pesos* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +
            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* https://holabertha.com/ficha-postulante/veli-m-GNTFsV' + "\r\n" + "\r\n" +
            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.';

        speechPH =
            'Si usted busca una trabajadora ' + frecuencia + ' veces por semana:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: *' + sueldo + ' '  + divisa + ' al día*, ' + toPesos(nuevSueldo * frecuencia * 4) + ' al mes (' + frecuencia + ' veces a la semana x 4 semanas = 1 mes).' + "\r\n" +
            '- Comisión agencia: ' + '*120,000 ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite por *1 mes*.' + "\r\n" + "\r\n" +

            (frecuencia >= 2 ? (
                'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + toPesos(sl) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + toPesos(slRest) + ' ' + divisa +'* (' + toPesos(nuevSueldo * frecuencia * 4) + ' - ' + toPesos(sl) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + toPesos(nuevSueldo * frecuencia * 4) + ' ' + divisa +'.' + "\r\n" + "\r\n" +

                'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + toPesos(sl) + ' ' + divisa +').' + "\r\n" + "\r\n"
            ) : '') +

            '*Para atenderle*, solicitamos un adelanto de *20,000 ' + divisa +'* que serán descontados del precio del servicio. Le enviaremos los currículos de *2* trabajadoras, *sin antecedentes*, con *buen carácter* y con *experiencia* laboral. Una vez que visualice la información y sus videos de presentación, escoge a la de su preferencia y abona el restante del servicio (100,000 pesos). Luego de ello, recibirá toda la información de la trabajadora. ' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 20,000 pesos* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* https://holabertha.com/ficha-postulante/margaret-c-yCUIE6' + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.'
        ;
    }else if (pais == 'mx'){

        sueldo = sueldoIngresado;
        let nuevSueldo = pesosStringToNumber(sueldoIngresado);
        let primpag = nuevSueldo - 2000;
        let primerpago = toPesos(primpag);
        let sl = ((parseInt(sueldoIngresado) - 100)  * frecuencia * 4);
        let slRest = (nuevSueldo * frecuencia);
        divisa = 'pesos';

        speechCDCF =
            'Le enviamos la cotización:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: *' + sueldo + ' ' + divisa + '*' + "\r\n" +
            '- Comisión agencia: ' + '*2,000 ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite por *1 mes*.' + "\r\n" + "\r\n" +

            'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + (toPesos3(primerpago)) + ' ' + divisa + '.  Así usted tendrá un *ahorro de 2,000 pesos*. El segundo mes, le aumenta a ' + sueldo + ' ' + divisa +'.' + "\r\n" + "\r\n" +
            'El período de prueba (*primer mes*) le servirá para evaluar a la trabajadora; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + toPesos3(primerpago) + ' ' + divisa + ').' + "\r\n" + "\r\n" +

            '*Para atenderle*, solicitamos un adelanto de *1,000 pesos* que serán descontados de la comisión. Le enviaremos los currículos de 2 trabajadoras, *sin antecedentes*, con *buen carácter* y con *experiencia* laboral. Luego de escoger, abonará el restante de la comisión (1,000 pesos)' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 1,000 pesos* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +
            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* https://holabertha.com/ficha-postulante/veli-m-GNTFsV' + "\r\n" + "\r\n" +
            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.';

        speechPH =
            'Si usted busca una trabajadora ' + frecuencia + ' veces por semana:' + "\r\n" + "\r\n" +
            '- Actividad: ' + actividad + "\r\n" +
            '- Modalidad: ' + modalidad + "\r\n" +
            '- Sueldo ofrecido: *' + sueldo + ' '  + divisa + ' al día*, ' + toPesos3(nuevSueldo * frecuencia * 4) + ' al mes (' + frecuencia + ' veces a la semana x 4 semanas = 1 mes).' + "\r\n" +
            '- Comisión agencia: ' + '*1,800 ' + divisa +'*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite por *1 mes*.' + "\r\n" + "\r\n" +

            (frecuencia >= 2 ? (
                'Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ' + toPesos3(sl) + ' ' + divisa +'. Así usted tiene un *ahorro de ' + toPesos3((nuevSueldo * frecuencia * 4) - sl) + ' ' + divisa +'* (' + toPesos3(nuevSueldo * frecuencia * 4) + ' - ' + toPesos3(sl) + ' ' + divisa +'). El segundo mes, usted le aumenta a ' + toPesos3(nuevSueldo * frecuencia * 4) + ' ' + divisa +'.' + "\r\n" + "\r\n" +

                'El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (' + toPesos3(sl) + ' ' + divisa +').' + "\r\n" + "\r\n"
            ) : '') +

            '*Para atenderle*, solicitamos un adelanto de *1,000 ' + divisa +'* que serán descontados del precio del servicio. Le enviaremos los currículos de *2* trabajadoras, *sin antecedentes*, con *buen carácter* y con *experiencia* laboral. Una vez que visualice la información y sus videos de presentación, escoge a la de su preferencia y abona el restante del servicio (800 pesos). Luego de ello, recibirá toda la información de la trabajadora. ' + "\r\n" + "\r\n" +

            'Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de 1,000 pesos* para que Bertha haga un nuevo proceso.' + "\r\n" + "\r\n" +

            'Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* https://holabertha.com/ficha-postulante/margaret-c-yCUIE6' + "\r\n" + "\r\n" +

            'Si usted desea conocer más de nuestro servicio, puede ingresar a www.holabertha.com/es-' + pais + '/condiciones o si tiene alguna duda, estamos para ayudarle.'
        ;
    }



    if (sueldoIngresado && modalidadID && actividadID){
        if (pais == 'pe'){
            if ( [3].includes(parseInt(modalidadID)) && sueldoIngresado && frecuencia && garantia && actividadID ){
                if (frecuencia == 3){
                    result = speechPH3VecesPorSemana;
                }else if (frecuencia == 1){
                    result = speechPH1VezPorSemana;
                }else{
                    result = speechPH;
                }
            }else if ( [1,2].includes(parseInt(modalidadID)) && sueldo && !(frecuencia) && garantia && actividadID){
                result = speechCDCF;
            }
        }else if (pais == 'cl'){
            if ( [3].includes(parseInt(modalidadID)) && sueldoIngresado && frecuencia && garantia && actividadID ){
                result = speechPH;
            }else if ( [1,2].includes(parseInt(modalidadID)) && sueldo && !(frecuencia) && garantia && actividadID){
                result = speechCDCF;
            }
        }else if (pais == 'mx'){
            if ( [3].includes(parseInt(modalidadID)) && sueldoIngresado && frecuencia && garantia && actividadID ){
                result = speechPH;
            }else if ( [1,2].includes(parseInt(modalidadID)) && sueldo && !(frecuencia) && garantia && actividadID){
                result = speechCDCF;
            }
        }
    }

    return result;
}
