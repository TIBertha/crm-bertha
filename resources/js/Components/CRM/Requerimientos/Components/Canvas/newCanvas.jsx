import React, { useRef, useEffect, useState } from "react";
import { drawTemplate } from "./canvasEngine.js";

export default function NewCanvas({ dataReq }) {
    const canvasRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState("");

    const [isCopying, setIsCopying] = useState(false);
    const [copyMessage, setCopyMessage] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function generar() {
            setIsLoading(true);
            setError("");

            if (!dataReq) {
                setError("No hay datos para generar el anuncio.");
                setIsLoading(false);
                return;
            }

            try {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }

                if (cancelado) return;

                const auxiliar = document.createElement("canvas");
                const contexto = auxiliar.getContext("2d");

                if (!contexto) {
                    throw new Error("No se pudo iniciar el canvas.");
                }

                await drawTemplate(contexto, dataReq);

                if (cancelado || !canvasRef.current) return;

                const canvas = canvasRef.current;

                canvas.width = auxiliar.width;
                canvas.height = auxiliar.height;

                const contextoVisible = canvas.getContext("2d");

                if (!contextoVisible) {
                    throw new Error("No se pudo mostrar el anuncio.");
                }

                contextoVisible.drawImage(auxiliar, 0, 0);
            } catch {
                if (!cancelado) {
                    setError(
                        "No se pudo generar el anuncio. Cierra el modal e inténtalo nuevamente.",
                    );
                }
            } finally {
                if (!cancelado) {
                    setIsLoading(false);
                }
            }
        }

        generar();

        return () => {
            cancelado = true;
        };
    }, [dataReq]);

    async function descargarJpg() {
        const canvas = canvasRef.current;

        if (!canvas || isLoading || error || isDownloading) return;

        setIsDownloading(true);
        setDownloadError("");

        try {
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(
                    (resultado) => {
                        if (resultado) {
                            resolve(resultado);
                        } else {
                            reject(new Error("No se pudo generar el JPG."));
                        }
                    },
                    "image/jpeg",
                    0.95,
                );
            });

            const archivoUrl = URL.createObjectURL(blob);
            const enlace = document.createElement("a");

            enlace.href = archivoUrl;
            enlace.download = "anuncio-requerimiento-" + dataReq.id + ".jpg";

            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();

            setTimeout(() => {
                URL.revokeObjectURL(archivoUrl);
            }, 10000);
        } catch {
            setDownloadError(
                "No se pudo descargar la imagen. Comprueba que la plantilla se cargue desde el mismo dominio.",
            );
        } finally {
            setIsDownloading(false);
        }
    }

    async function copiarImagen() {
        const canvas = canvasRef.current;

        if (!canvas || isLoading || error || isCopying) return;

        setCopyMessage("");

        if (!navigator.clipboard?.write || !window.ClipboardItem) {
            setCopyMessage(
                "Este navegador no permite copiar imágenes. Puedes descargar el JPG.",
            );
            return;
        }

        setIsCopying(true);

        try {
            const imagenPromise = new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("No se pudo preparar la imagen."));
                    }
                }, "image/png");
            });

            // Inicia la escritura directamente desde el clic.
            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": imagenPromise,
                }),
            ]);

            setCopyMessage("Imagen copiada. Ya puedes pegarla.");
        } catch {
            setCopyMessage(
                "No se pudo copiar la imagen. Revisa los permisos del navegador o descarga el JPG.",
            );
        } finally {
            setIsCopying(false);
        }
    }

    return (
        <div className="anuncio-canvas">
            {isLoading && (
                <div
                    className="anuncio-canvas__mensaje"
                    role="status"
                >
                    <i
                        className="fas fa-sync fa-spin"
                        aria-hidden="true"
                    ></i>

                    <span>Generando anuncio…</span>
                </div>
            )}

            {error && (
                <div
                    className="anuncio-canvas__mensaje"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <canvas
                onContextMenu={(e) => e.preventDefault()}
                ref={canvasRef}
                width={600}
                height={600}
                className="anuncio-canvas__imagen"
                hidden={isLoading || Boolean(error)}
                role="img"
                aria-label="Anuncio generado con los datos del requerimiento"
            />

            {!isLoading && !error && (
                <div className="anuncio-canvas__acciones">
                    <div className="anuncio-canvas__botones">
                        <button
                            type="button"
                            className="anuncio-canvas__copiar"
                            onClick={copiarImagen}
                            disabled={isCopying}
                        >
                            <i
                                className={
                                    isCopying
                                        ? "fas fa-spinner fa-spin"
                                        : "far fa-copy"
                                }
                                aria-hidden="true"
                            ></i>

                            {isCopying ? "Copiando…" : "Copiar imagen"}
                        </button>

                        <button
                            type="button"
                            className="anuncio-canvas__descargar"
                            onClick={descargarJpg}
                            disabled={isDownloading}
                        >
                            <i
                                className={
                                    isDownloading
                                        ? "fas fa-spinner fa-spin"
                                        : "fas fa-download"
                                }
                                aria-hidden="true"
                            ></i>

                            {isDownloading ? "Preparando…" : "Descargar imagen"}
                        </button>
                    </div>

                    {copyMessage && (
                        <p
                            className="anuncio-canvas__mensaje-copia"
                            role="status"
                        >
                            {copyMessage}
                        </p>
                    )}

                    {downloadError && (
                        <p className="anuncio-canvas__error" role="alert">
                            {downloadError}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
