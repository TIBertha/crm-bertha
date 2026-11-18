import {
    findFichaByActividadCamaAdentro,
    findFichaByActividadCamaAfuera,
} from '../Helpers/requerimientos.js';

const formatoMonto = valor =>
    Number(valor).toLocaleString('en-US', {
        maximumFractionDigits: 2,
    });

export function getSpeechCotizadorMexico(
    actividad,
    modalidad,
    sueldoIngresado,
    frecuencia
) {
    const actividades = {
        1: 'Todo servicio (cocina, limpieza, lavado y planchado)',
        3: 'Enfermera',
        6: 'Niñera',
        10: 'Cuidado de adulto mayor',
    };

    const modalidades = {
        1: 'De planta',
        2: 'Entrada por salida',
        3: 'Por días',
    };

    const actividadID = Number(actividad);
    const modalidadID = Number(modalidad);

    const linkCV = modalidadID === 1
        ? findFichaByActividadCamaAdentro(actividadID)
        : findFichaByActividadCamaAfuera(actividadID);

    const dias = Number(frecuencia);
    const porDias = modalidadID === 3;

    const sueldo = porDias
        ? 500
        : Number(String(sueldoIngresado).replace(/,/g, ''));

    if (!actividades[actividadID] || !modalidades[modalidadID]) {
        return '';
    }

    if (porDias && ![1, 2, 3, 4].includes(dias)) {
        return '';
    }

    if (!porDias && (!Number.isFinite(sueldo) || sueldo <= 2000)) {
        return '';
    }

    const comision = porDias ? 1800 : 2000;
    const adelanto = 1000;
    const restante = comision - adelanto;

    const sueldoMensual = porDias ? sueldo * dias * 4 : sueldo;
    const sueldoPruebaDiario = 400;

    const sueldoPrimerMes = porDias
        ? sueldoPruebaDiario * dias * 4
        : sueldoMensual - 2000;

    const ahorro = sueldoMensual - sueldoPrimerMes;

    const dinero = valor => `$${formatoMonto(valor)} pesos`;

    const sueldoTexto = porDias
        ? `${dinero(sueldo)} por día (${dinero(sueldoMensual)} al mes)`
        : `${dinero(sueldoMensual)} mensuales (${dinero(sueldoMensual / 2)} quincenales)`;

    const periodoPrueba = porDias
        ? [
            `* Puede ofrecer un sueldo de ${dinero(sueldoPrimerMes)} el primer mes (${dinero(sueldoPruebaDiario)} por día). Luego, le aumenta a ${dinero(sueldo)} por día.`,
            `* Esto le permite un ahorro de ${dinero(ahorro)}, lo que reduce su inversión inicial.`,
        ].join('\r\n')
        : [
            `* Puede ofrecer un sueldo de ${dinero(sueldoPrimerMes)} el primer mes.`,
            `* Esto le permite un ahorro de ${dinero(ahorro)}, lo que cubre el 100% del costo de nuestro servicio.`,
        ].join('\r\n');

    const reemplazo = porDias
        ? 'si la trabajadora no cumple sus expectativas o renuncia sin cumplir el número de servicios contratados, le proporcionamos el reemplazo sin costo adicional. Solo deberá pagarle directamente los días laborados de acuerdo con el sueldo de prueba. En caso de que se hayan completado todos los servicios contratados, la garantía de reemplazos ya no aplica.'
        : 'si la trabajadora no cumple sus expectativas o renuncia en el primer mes, le proporcionamos el reemplazo sin costo adicional. Solo deberá pagarle a la trabajadora directamente los días laborados de acuerdo con el sueldo de prueba.';

    const ejemploCV = linkCV.trim()
        ? `📌 Puede ver un ejemplo de nuestros currículos aquí:\r\n${linkCV.trim()}`
        : '';

    return [
        'Le enviamos la cotización.',
        [
            `*Actividad:* ${actividades[actividadID]}`,
            `*Modalidad:* ${modalidades[modalidadID]}`,
            `*Sueldo ofrecido:* ${sueldoTexto}`,
            `*Costo de nuestro servicio de selección y reemplazo:* ${dinero(comision)} (único pago). Le ofrecemos *1 mes de garantía.*`,
        ].join('\r\n'),
        [
            '*Proceso de contratación y pagos:*',
            `1. *Adelanto:* ${dinero(adelanto)} para iniciar la selección.`,
            '2. *Selección de candidatas:* recibirá currículos y videos de presentación de 2 trabajadoras preseleccionadas sin antecedentes, con buen carácter y con experiencia laboral.',
            `3. *Elección de candidata:* al seleccionar a la trabajadora, abona el saldo restante de ${dinero(restante)}.`,
            '4. *Período de prueba (1 mes):*',
            periodoPrueba,
            `5. *Reemplazo gratuito e ilimitado por 1 mes:* ${reemplazo}`,
            `6. *Nuevo proceso de selección:* si decide no contratar a ninguna de las trabajadoras enviadas, puede solicitar un nuevo proceso abonando un nuevo adelanto de ${dinero(adelanto)}.`,
        ].join('\r\n'),
        ejemploCV,
        '📌 Para más información, consulte nuestros términos en www.holabertha.com/mx/condiciones o si tiene alguna duda, nos informa por favor.',
    ].filter(Boolean).join('\r\n\r\n');
}
