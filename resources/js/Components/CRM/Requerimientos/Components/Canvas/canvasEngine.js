import drawCamaAfuera from "./templates/camaAfuera.js";
import drawCamaAdentro from "./templates/camaAdentro.js";
import drawPorDia from "./templates/porDias.js";

export function drawTemplate(ctx, dataReq) {
    const tipo = dataReq.tiporeq || "cama_afuera";

    switch (tipo) {
        case "cama_afuera":
            return drawCamaAfuera(ctx, dataReq);
        case "cama_adentro":
            return drawCamaAdentro(ctx, dataReq);
        case "por_dia":
            return drawPorDia(ctx, dataReq);
        default:
            return drawCamaAfuera(ctx, dataReq);
    }
}
