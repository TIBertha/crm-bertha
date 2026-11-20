//import TEMPLATE_URL from "../../../../../../../public/img/canvas/anuncio-template.jpg";


const TEMPLATE_URL = "/img/canvas/anuncio-template.jpg";
const WIDTH = 600;
const MIN_HEIGHT = 600;
const MARGIN = 25;
const TEXT_WIDTH = WIDTH - MARGIN * 2;
const CONTENT_TOP = 112;

const FONT = '"Google Sans", Arial, sans-serif';
const PINK = "#ff0080";

let templatePromise = null;

function cargarPlantilla() {
    if (!templatePromise) {
        templatePromise = new Promise((resolve, reject) => {
            const imagen = new Image();

            imagen.onload = () => resolve(imagen);

            imagen.onerror = () => {
                templatePromise = null;
                reject(
                    new Error("No se pudo cargar la plantilla del anuncio."),
                );
            };

            imagen.src = TEMPLATE_URL;
        });
    }

    return templatePromise;
}

function texto(valor) {
    return valor === null || valor === undefined
        ? ""
        : String(valor).trim();
}

function establecerFuente(ctx, size, bold = false) {
    ctx.font = `${bold ? "bold" : "normal"} ${size}px ${FONT}`;
}

/*
 * Divide también las palabras demasiado largas.
 * Conserva los saltos de línea y no elimina contenido.
 */
function dividirLineas(ctx, contenido, maxWidth) {
    const lineas = [];

    for (const parrafo of texto(contenido).split(/\r\n|\r|\n/)) {
        const palabras = parrafo.trim().split(/\s+/).filter(Boolean);

        if (palabras.length === 0) {
            lineas.push("");
            continue;
        }

        let linea = "";

        for (const palabra of palabras) {
            const propuesta = linea ? `${linea} ${palabra}` : palabra;

            if (ctx.measureText(propuesta).width <= maxWidth) {
                linea = propuesta;
                continue;
            }

            if (linea) {
                lineas.push(linea);
                linea = "";
            }

            if (ctx.measureText(palabra).width <= maxWidth) {
                linea = palabra;
                continue;
            }

            let fragmento = "";

            for (const caracter of Array.from(palabra)) {
                const candidato = fragmento + caracter;

                if (
                    fragmento &&
                    ctx.measureText(candidato).width > maxWidth
                ) {
                    lineas.push(fragmento);
                    fragmento = caracter;
                } else {
                    fragmento = candidato;
                }
            }

            linea = fragmento;
        }

        if (linea) {
            lineas.push(linea);
        }
    }

    return lineas;
}

function ajustarTamano(ctx, contenido, baseSize, maxWidth, bold = false) {
    let size = baseSize;

    establecerFuente(ctx, size, bold);

    while (
        ctx.measureText(contenido).width > maxWidth &&
        size > 1
        ) {
        size -= 1;
        establecerFuente(ctx, size, bold);
    }

    return size;
}

function agregarHorarios(bloques, horarios) {
    if (!Array.isArray(horarios)) return;

    horarios.forEach((horario, index) => {
        const dia = texto(horario.dia);

        const horas = [
            texto(horario.ingreso),
            texto(horario.salida),
        ]
            .filter(Boolean)
            .join(" a ");

        const contenido = [
            dia ? `${dia}:` : "",
            horas,
        ]
            .filter(Boolean)
            .join(" ");

        if (contenido) {
            bloques.push({
                contenido,
                size: 30,
                bold: true,
                gap: index === 0 ? 10 : 2,
            });
        }
    });
}

function agregarIngresoSalida(bloques, horario, salidaPrimero = false) {
    if (!horario) return;

    const ingreso = [
        texto(horario.diaingreso),
        texto(horario.horaingreso),
    ]
        .filter(Boolean)
        .join(" ");

    const salida = [
        texto(horario.diasalida),
        texto(horario.horasalida),
    ]
        .filter(Boolean)
        .join(" ");

    const filas = salidaPrimero
        ? [
            { etiqueta: "Salida", valor: salida },
            { etiqueta: "Ingreso", valor: ingreso },
        ]
        : [
            { etiqueta: "Ingreso", valor: ingreso },
            { etiqueta: "Salida", valor: salida },
        ];

    filas.forEach((fila, index) => {
        if (!fila.valor) return;

        bloques.push({
            contenido: `${fila.etiqueta}: ${fila.valor}`,
            size: 30,
            bold: true,
            gap: index === 0 ? 10 : 2,
        });
    });
}

function construirBloques(data, modalidad) {
    const bloques = [];

    function agregar(contenido, size, bold, gap = 8) {
        const valor = texto(contenido);

        if (valor) {
            bloques.push({
                contenido: valor,
                size,
                bold,
                gap,
            });
        }
    }

    agregar(data.actividad, 35, true, 0);

    agregar(
        modalidad === 3
            ? data.modalidad || data.frecuencia
            : data.frecuencia || data.modalidad,
        35,
        true,
        8,
    );

    agregar(data.distrito, 32, true, 8);
    agregar(data.referencia, 28, false, 8);

    if (modalidad === 1) {
        agregarIngresoSalida(bloques, data.horarioCD);
    } else if (modalidad === 3) {
        agregarHorarios(bloques, data.horarioPD);
    } else {
        // Conserva los distintos horarios que admite cama afuera.
        agregarHorarios(bloques, data.horarioCF);
        agregarHorarios(bloques, data.horarioPD);
        agregarIngresoSalida(bloques, data.horarioCD, true);
    }

    return bloques;
}

function medirBloques(ctx, bloques, escala) {
    let y = CONTENT_TOP;

    const resultado = bloques.map((bloque) => {
        const size = Math.max(18, Math.round(bloque.size * escala));
        const lineHeight = Math.ceil(size * 1.22);

        establecerFuente(ctx, size, bloque.bold);

        const lineas = dividirLineas(
            ctx,
            bloque.contenido,
            TEXT_WIDTH,
        );

        y += Math.round(bloque.gap * escala);

        const posicion = {
            ...bloque,
            size,
            lineHeight,
            lineas,
            y,
        };

        y += lineas.length * lineHeight;

        return posicion;
    });

    return {
        bloques: resultado,
        bottom: y,
    };
}

function obtenerSueldo(data, modalidad) {
    if (modalidad === 3) {
        return data.sueldopordia || data.sueldo;
    }

    return data.frecuencia
        ? data.sueldopordia
        : data.sueldo;
}

export async function drawTemplate(ctx, dataReq) {
    if (!ctx || !dataReq) return;

    const template = await cargarPlantilla();

    const modalidadOriginal = Number(dataReq.modalidadid);
    const modalidad = [1, 2, 3].includes(modalidadOriginal)
        ? modalidadOriginal
        : 2;

    const bloques = construirBloques(dataReq, modalidad);

    // El backend ya envía el sueldo con moneda y, cuando corresponde,
    // el texto "x día". Se conserva ese contenido.
    const sueldo = texto(obtenerSueldo(dataReq, modalidad));
    const baseSueldo = Number(dataReq.paispedido) === 54 ? 110 : 90;

    const sizeSueldo = sueldo
        ? ajustarTamano(ctx, sueldo, baseSueldo, TEXT_WIDTH, true)
        : 0;

    const altoSueldo = sueldo
        ? Math.ceil(sizeSueldo * 1.2)
        : 0;

    const separacionSueldo = sueldo ? 20 : 0;

    const limiteContenido =
        MIN_HEIGHT - MARGIN - altoSueldo - separacionSueldo;

    let layout = medirBloques(ctx, bloques, 1);

    // Reduce progresivamente el texto antes de aumentar la altura.
    for (
        let paso = 1;
        paso <= 7 && layout.bottom > limiteContenido;
        paso += 1
    ) {
        layout = medirBloques(ctx, bloques, 1 - paso * 0.05);
    }

    const height = Math.max(
        MIN_HEIGHT,
        Math.ceil(
            layout.bottom +
            separacionSueldo +
            altoSueldo +
            MARGIN,
        ),
    );

    // Cambiar dimensiones reinicia el contexto.
    ctx.canvas.width = WIDTH;
    ctx.canvas.height = height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WIDTH, height);

    // Mantiene intactas las proporciones de la plantilla original.
    ctx.drawImage(template, 0, 0, WIDTH, MIN_HEIGHT);

    const fecha = texto(dataReq.fechaentrevista);

    if (fecha) {
        const sizeFecha = ajustarTamano(
            ctx,
            fecha,
            40,
            TEXT_WIDTH,
        );

        ctx.save();
        establecerFuente(ctx, sizeFecha);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(fecha, WIDTH / 2, 72.5);
        ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = PINK;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    layout.bloques.forEach((bloque) => {
        establecerFuente(ctx, bloque.size, bloque.bold);

        bloque.lineas.forEach((linea, index) => {
            ctx.fillText(
                linea,
                MARGIN,
                Math.round(bloque.y + index * bloque.lineHeight),
            );
        });
    });

    if (sueldo) {
        establecerFuente(ctx, sizeSueldo, true);

        ctx.fillText(
            sueldo,
            MARGIN,
            height - MARGIN - altoSueldo,
        );
    }

    ctx.restore();
}
