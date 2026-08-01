import { drawAutoText, drawList, drawSalary, drawCenteredText } from "../Helpers/text.js";

export default function drawPorDias(ctx, data) {
    const template = new Image();
    template.src = "https://adjuntosexperta.s3.amazonaws.com/Adjuntos/anuncio-template-por-dia.jpg";

    template.onload = () => {
        ctx.clearRect(0, 0, 600, 600);
        ctx.drawImage(template, 0, 0, 600, 600);

        let y;

        drawCenteredText(ctx, data.fechaentrevista, { x: 300, y: 72.5 });

        y = drawAutoText(ctx, data.actividad, { x: 25, y: 140, maxWidth: 550, fontWeight: "bold" });

        y = drawAutoText(ctx, data.modalidad || data.frecuencia, { x: 25, y, maxWidth: 550, fontWeight: "bold" });

        y = drawAutoText(ctx, data.distrito, { x: 25, y, maxWidth: 550, fontWeight: "bold" });

        if (data.referencia) {
            y = drawAutoText(ctx, data.referencia, {
                x: 25,
                y,
                maxWidth: 550,
                baseSize: 35,
                maxLines: 4
            });
        }

        if (data.horarioPD) {
            y = drawList(ctx, data.horarioPD, { x: 25, y: y + 12, fontWeight: "bold" });
        }

        const sueldoFinal = data.sueldopordia || data.sueldo;

        drawSalary(ctx, sueldoFinal, {
            x: 25,
            y: 590,
            big: parseInt(data.paispedido) === 54,
        });
    };
}
