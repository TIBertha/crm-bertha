import { drawAutoText, drawList, drawSalary, drawCenteredText } from "../Helpers/text.js";

export default function drawCamaAfuera(ctx, data) {
    const template = new Image();
    template.src = "https://adjuntosexperta.s3.amazonaws.com/Adjuntos/anuncio-template.jpg";

    template.onload = () => {
        ctx.clearRect(0, 0, 600, 600);
        ctx.drawImage(template, 0, 0, 600, 600);

        let y;

        drawCenteredText(ctx, data.fechaentrevista, { x: 300, y: 72.5, size: 40 });

        y = drawAutoText(ctx, data.actividad, { x: 25, y: 140, maxWidth: 550, fontWeight: "bold" });

        y = drawAutoText(ctx, data.frecuencia || data.modalidad, { x: 25, y: y + 10, maxWidth: 550, fontWeight: "bold"});

        y = drawAutoText(ctx, data.distrito, { x: 25, y, maxWidth: 550, baseSize: 32, maxLines: 2, fontWeight: "bold"});

        if (data.referencia) {
            y = drawAutoText(ctx, data.referencia, {
                x: 25,
                y,
                maxWidth: 550,
                baseSize: 35,
                maxLines: 4
            });
        }

        if (data.horarioCF) {
            y = drawList(ctx, data.horarioCF, { x: 25, y: y + 12 , fontWeight: "bold"});
        }

        if (data.horarioPD) {
            y = drawList(ctx, data.horarioPD, { x: 25, y: y + 8 , fontWeight: "bold"});
        }

        if (data.horarioCD) {
            y = drawAutoText(ctx, `Salida: ${data.horarioCD.diasalida} ${data.horarioCD.horasalida}`, {
                x: 25, y: y + 10, maxWidth: 550, fontWeight: "bold"
            });

            y = drawAutoText(ctx, `Ingreso: ${data.horarioCD.diaingreso} ${data.horarioCD.horaingreso}`, {
                x: 25, y, maxWidth: 550, fontWeight: "bold"
            });
        }

        const sueldoFinal = data.frecuencia ? data.sueldopordia : data.sueldo;

        drawSalary(ctx, sueldoFinal, {
            x: 25,
            y: 590,
            big: parseInt(data.paispedido) === 54,
        });
    };
}
