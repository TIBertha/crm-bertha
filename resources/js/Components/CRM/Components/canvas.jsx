import React, {createRef, useEffect, useRef, useState} from 'react';

export default function Canvas({dataReq}) {

    const myCanvas = useRef();
    const [newFontSize, setNewFontSize] = useState(0);

    function fitTextOnCanvas(context, text, x, y) {

        // start with a large font size
        var fontsize = 300;

        // lower the font size until the text fits the canvas
        do {
            fontsize--;
            context.font = 'normal ' + ((context.measureText(text).width > 550) ? fontsize : 32.5) + 'px Google Sans,sans-serif';
        } while (context.measureText(text).width > 550)

        // draw the text
        context.fillText(text, x, y);

    }

    function printAt( context , text, x, y, lineHeight, fitWidth, fontSize){

        fitWidth = fitWidth || 0;

        if (fitWidth <= 0){
            context.font = 'normal ' + fontSize + 'px Google Sans,sans-serif';
            context.fillStyle = "#ff0080";
            context.textAlign = "left";
            context.fillText(text, x, y );
            return;
        }


        for (var idx = 0; idx <= text.length; idx++){
            var str = text.substr(0, idx);
            if (context.measureText(str).width > fitWidth){
                fitTextOnCanvas(context, text.substr(0, idx-1), x, y);
                fitTextOnCanvas(context, text.substr(idx-1), x, (y + lineHeight));
                return;
            }
        }

        context.fillText(text, x, y );
    }

    function createDraw(inputReferencia){
        const context = myCanvas.current.getContext("2d");
        const image = new Image();
        image.src = "https://adjuntosexperta.s3.amazonaws.com/Adjuntos/anuncio-template.jpg";

        image.onload = () => {

            let x = 25;
            let widthLimit = 600;

            context.drawImage(image, 0, 0, 600,  600);

            context.font = 'normal 40px Google Sans,sans-serif';
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(dataReq.fechaentrevista, 300, 72.5);

            context.font = 'normal 35px Google Sans,sans-serif';
            context.fillStyle = "#ff0080";
            context.textAlign = "left";
            context.fillText(dataReq.actividad, x, 140);

            context.font = 'normal 35px Google Sans,sans-serif';
            context.fillStyle = "#ff0080";
            context.textAlign = "left";
            context.fillText(dataReq.frecuencia ? dataReq.frecuencia : dataReq.modalidad, x, 185);

            /*context.font = 'bold 32.5px Google Sans,sans-serif';
            context.fillStyle = "#ff0080";
            context.textAlign = "left";
            context.fillText(dataReq.distrito, x, 230, widthLimit);*/

            //printAt(context, dataReq.distrito, x, 245, 32.5, widthLimit, 30);

            fitTextOnCanvas(context, dataReq.distrito, x, 245);

            if (dataReq.referencia){
                fitTextOnCanvas(context, dataReq.referencia, x, 295);
            }

            /*if (dataReq.referencia){
                printAt(context, dataReq.referencia, x, 285, 40,widthLimit, 32.5)
            }*/

            if (dataReq.horarioCF){
                if(dataReq.horarioCF.length == 1){
                    dataReq.horarioCF.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = "left",
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (385))
                        )
                    })
                }else if (dataReq.horarioCF.length == 2){
                    dataReq.horarioCF.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = "left",
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (370 + (70 * k)))
                        )
                    })
                }else{
                    dataReq.horarioCF.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = "left",
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (390 + (35 * k)))
                        )
                    })
                }
            }

            if (dataReq.horarioPD){
                if(dataReq.horarioPD.length == 1){
                    dataReq.horarioPD.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = "left",
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (410))
                        )
                    })
                }else if (dataReq.horarioPD.length == 2){
                    dataReq.horarioPD.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = 'left',
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (410 + (40 * k)))
                        )
                    })
                }else{
                    dataReq.horarioPD.map((h,k) => {
                        return(
                            context.font = 'normal 30px Google Sans,sans-serif',
                                context.fillStyle = "#ff0080",
                                context.textAlign = 'left',
                                context.fillText((h.dia + ': ' + h.ingreso + ' a ' + h.salida), x, (370 + (40 * k)))
                        )
                    })
                }
            }

            if (dataReq.horarioCD){
                context.font = 'normal 35px Google Sans,sans-serif';
                context.fillStyle = "#ff0080";
                context.textAlign = "left";
                context.fillText(('Salida: ' + dataReq.horarioCD.diasalida + ' ' + dataReq.horarioCD.horasalida), x, (380));

                context.font = 'normal 35px Google Sans,sans-serif';
                context.fillStyle = "#ff0080";
                context.textAlign = "left";
                context.fillText(('Ingreso: ' + dataReq.horarioCD.diaingreso + ' ' + dataReq.horarioCD.horaingreso), x, (425));
            }

            context.font = 'bold ' + (parseInt(dataReq.paispedido) == 54 ? '110' : '90') + 'px Google Sans,sans-serif';
            context.fillStyle = "#ff0080";
            context.textAlign = "left";
            context.fillText((dataReq.frecuencia ? dataReq.sueldopordia : dataReq.sueldo), x, (590));

        };
    }

    useEffect(() => {
        createDraw();
    }, []);

    return (
        <div className={'canvas-form'}>

            <div className={'py-2 text-left'}>
                <strong>Haz clic derecho sobre la imagen para copiar o guardar.</strong>
            </div>

            <canvas className={'crear-anuncio-canvas'} ref={myCanvas} width={600} height={600} />
        </div>
    )
}
