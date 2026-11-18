import {
    getActividadName,
    getModalidadName,
    findFichaByActividadCamaAdentro,
    findFichaByActividadCamaAfuera,
} from '../Helpers/requerimientos.js';

const formatoMonto = valor =>
    Number(valor).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

export function getSpeechCotizadorPeru(
    actividadID,
    modalidadID,
    sueldoIngresado,
    frecuencia,
    garantia,
    pais,
    tipoCotizacion
) {
    // Este cotizador trabaja únicamente con Perú.
    const actividadNum = Number(actividadID);
    const modalidadNum = Number(modalidadID);
    const frecuenciaNum = Number(frecuencia);

    const sueldo = Number(
        String(sueldoIngresado ?? '').replace(/,/g, '')
    );

    const porDias = modalidadNum === 3;
    const designacion = tipoCotizacion === 'type2';

    // Validaciones.
    if (
        ![1, 3, 6, 10].includes(actividadNum)
        || ![1, 2, 3].includes(modalidadNum)
        || !['type1', 'type2'].includes(tipoCotizacion)
        || !Number.isFinite(sueldo)
        || sueldo <= 0
        || !garantia
    ) {
        return '';
    }

    if (porDias && ![1, 2, 3, 4].includes(frecuenciaNum)) {
        return '';
    }

    const actividad = getActividadName(actividadNum, 'pe');
    const modalidad = getModalidadName(modalidadNum, 'pe');

    const dinero = valor => `${formatoMonto(valor)} soles`;
    const salto = '\r\n';
    const espacio = '\r\n\r\n';

    // Sueldos y ahorro.
    const sueldoMensual = porDias
        ? sueldo * frecuenciaNum * 4
        : sueldo;

    let sueldoPruebaDiario = null;
    let sueldoPrimerMes;

    if (porDias) {
        sueldoPruebaDiario = sueldo - 20;

        if (sueldoPruebaDiario <= 0) {
            return '';
        }

        sueldoPrimerMes = sueldoPruebaDiario * frecuenciaNum * 4;
    } else if (sueldo === 1350) {
        sueldoPrimerMes = 1000;
    } else if (sueldo >= 1400) {
        sueldoPrimerMes = sueldo - 400;
    } else {
        sueldoPrimerMes = 930;
    }

    const ahorro = sueldoMensual - sueldoPrimerMes;

    // Comisiones: conservan los importes del cotizador original.
    const adelanto = 100;
    const comision1 = porDias ? 500 : 700;
    const comision2 = porDias ? 400 : 500;

    let comision3 = 350;

    if (!porDias) {
        if (sueldo === 1300) {
            comision3 = 370;
        } else if (sueldo >= 1400) {
            comision3 = 400;
        }
    }

    const comisionDesignacion = porDias ? 400 : 500;

    const veces = frecuenciaNum === 1 ? 'vez' : 'veces';

    const titulo = porDias
        ? `Si usted busca una trabajadora ${frecuenciaNum} ${veces} por semana:`
        : 'Le enviamos la cotización:';

    const sueldoTexto = porDias
        ? `${dinero(sueldo)} al día, ${dinero(sueldoMensual)} al mes (${frecuenciaNum} ${veces} a la semana x 4 semanas = 1 mes).`
        : dinero(sueldoMensual);

    const pagoAgencia = designacion
        ? `*${dinero(comisionDesignacion)} y ahorra ${dinero(ahorro)}*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *1 mes*. Y le daremos boleta o factura por su abono.`
        : 'Le enviamos 3 tipos de comisiones para que escoja la de su preferencia:';

    const resumen = [
        `- Actividad: ${actividad}`,
        `- Modalidad: ${modalidad}`,
        `- Sueldo ofrecido: ${sueldoTexto}`,
        `- Pago a agencia: ${pagoAgencia}`,
    ].join(salto);

    const detalleComision1 = designacion
        ? ''
        : `*Comisión 1*: *${dinero(comision1)} y ahorra ${dinero(ahorro)}*. Bertha cobra por la selección de personal y por brindarle los reemplazos de personal que usted necesite hasta por *3 meses*.`;

    const detalleSueldo = [
        `Usted como empleador puede ofrecer un sueldo de prueba *el primer mes*, lo mínimo es ${dinero(sueldoPrimerMes)}.`,
        `*Así usted tiene un ahorro de ${dinero(ahorro)}* (${dinero(sueldoMensual)} - ${dinero(sueldoPrimerMes)}).`,
        `El segundo mes, usted le aumenta a ${dinero(sueldoMensual)}.`,
    ].join(' ');

    const periodoPrueba =
        `El período de prueba (*primer mes*) le servirá para evaluar al trabajador; si desea despedirle durante este tiempo o si renuncia, le daremos el *reemplazo gratuito* y le pagará sus días laborados de acuerdo a su sueldo de prueba (${dinero(sueldoPrimerMes)}).`;

    const reemplazoPosterior = designacion
        ? ''
        : `*Después* del primer mes, el precio del reemplazo es de *${dinero(ahorro)}*. Le enviaremos un nuevo trabajador al que le pagará ${dinero(sueldoPrimerMes)} y tendrá *un nuevo ahorro de ${dinero(ahorro)}*.`;

    const proceso = designacion
        ? '*Para atenderle*, solicitamos el pago de la comisión por adelantado. Le enviaremos *una* trabajadora *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. No hay entrevistas o elección de currículos sino que la agencia designa el personal, lo envía al domicilio y minutos antes de su llegada envía los documentos y datos de la empleada. Los precios incluyen IGV.'
        : `*Para atenderle*, solicitamos un adelanto de *${dinero(adelanto)}* que será descontado de la comisión. Le enviaremos los currículos de *2* trabajadores, *sin antecedentes* policiales, judiciales y penales, con *buen carácter* y con *experiencia* laboral. Las *entrevistas* son por *videollamada* o llamada. Luego de escoger, abonará el restante de la comisión (${dinero(comision1 - adelanto)}). Los precios incluyen IGV.`;

    const nuevoProceso =
        `Bertha realiza la selección en base a documentos como los reportes de antecedentes, *si el empleador rechaza* a las postulantes seleccionadas, podrá abonar *otro adelanto de ${dinero(adelanto)}* para que Bertha haga un nuevo proceso.`;

    // De cama adentro para modalidad 1; de cama afuera para 2 y 3.
    const linkCV = modalidadNum === 1
        ? findFichaByActividadCamaAdentro(actividadNum)
        : findFichaByActividadCamaAfuera(actividadNum);

    const ejemploCV = linkCV
        ? `Para que usted tenga una idea de nuestros currículos, le enviamos un ejemplo *(solo referencial)* ${linkCV}`
        : '';

    const condiciones =
        'Si usted desea conocer más de nuestro servicio, puede ingresar a https://holabertha.com/pe/condiciones o si tiene alguna duda, estamos para ayudarle.';

    const otrasComisiones = designacion
        ? []
        : [
            'También podemos ayudarle con estos *2 otros tipos de comisiones*:',

            `*Comisión 2*: ${dinero(comision2)} (${dinero(adelanto)} adelantado + ${dinero(comision2 - adelanto)} *luego de entrevistas*), usted *ahorra ${dinero(ahorro)}* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.`,

            `*Comisión 3 (Precio más bajo)*: *${dinero(comision3)} (por adelantado)*. Luego de enviados los currículos, usted escoge viendo fotos, videos, documentos del currículo. *No hay entrevistas laborales*. Usted *ahorra ${dinero(ahorro)}* el primer mes de la trabajadora. Garantía de reemplazos de *1 mes*.`,

            'Usted puede escoger la comisión 1, 2 o 3 (menor precio) y agendaremos su atención por favor.',
        ];

    return [
        titulo,
        resumen,
        detalleComision1,
        detalleSueldo,
        periodoPrueba,
        reemplazoPosterior,
        proceso,
        nuevoProceso,
        ejemploCV,
        condiciones,
        ...otrasComisiones,
    ].filter(Boolean).join(espacio);
}
