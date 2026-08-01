import React, { useRef, useEffect } from "react";
import { drawTemplate } from "../Canvas/canvasEngine.js";

export default function NewCanvas({ dataReq }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (!canvasRef.current || !dataReq) return;
        const ctx = canvasRef.current.getContext("2d");
        drawTemplate(ctx, dataReq);
    }, [dataReq]);

    return (
        <div className="canvas-form">
            <div className="py-2 text-left">
                <strong>Haz clic derecho sobre la imagen para copiar o guardar.</strong>
            </div>
            <canvas
                className="crear-anuncio-canvas"
                ref={canvasRef}
                width={600}
                height={600}
            />
        </div>
    );
}
