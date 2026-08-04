import drawCamaAfuera from "./Templates/camaAfuera.js";
import drawCamaAdentro from "./Templates/camaAdentro.js";
import drawPorDias from "./Templates/porDias.js";

export function drawTemplate(ctx, dataReq) {

    switch (dataReq.modalidadid) {
        case 1:
            return drawCamaAdentro(ctx, dataReq);
        case 2:
            return drawCamaAfuera(ctx, dataReq);
        case 3:
            return drawPorDias(ctx, dataReq);
        default:
            return drawCamaAfuera(ctx, dataReq);
    }
}
