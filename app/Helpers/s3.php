<?php

use App\Facades\S3Uploader;

function savePDF($pdfBase64){

    $result = [
        'pdf' => null
    ];

    $folder = 'Adjuntos/';

    if($pdfBase64){

        list($baseType, $file) = explode(';', $pdfBase64);
        list(, $file) = explode(',', $file);

        $file = base64_decode($file);

        $pdfName = time().'.pdf';

        S3Uploader::put($pdfName, $file);

        S3Uploader::put($folder . $pdfName, $file, 'public');

        $result['pdf'] = S3Uploader::url($folder. $pdfName);

    }

    return $result;

}

function saveDocumentToS3($base64){

    list($baseType, $file) = explode(';', $base64);
    list($file) = explode(',', $file);
    $extension = explode('/', mime_content_type($base64))[1];

    $file = base64_decode($file);

    $folder = 'Adjuntos/';

    $fileName = time().'.' .$extension;

    S3Uploader::put($folder . $fileName, $file, 'public');

    return S3Uploader::url($folder. $fileName);

}

function saveImageToS3($base64)
{

    list($baseType, $image) = explode(';', $base64);
    list(, $image) = explode(',', $image);

    $image = base64_decode($image);

    $folder = 'Adjuntos/';

    $imageName = time() . '.jpeg';

    S3Uploader::put($folder . $imageName, $image, 'public');

    return S3Uploader::url($folder . $imageName);

}

function base64ToFileGeneral($base64, $typeImg, $tipo = '', $extension = ''){

    list($baseType, $image) = explode(';', $base64);
    list(, $image) = explode(',', $image);

    $image = base64_decode($image);

    $folder = 'Adjuntos/';

    if($tipo == 'blog'){
        $path = 'blog';
    }else if($tipo == 'administrador'){
        $path = 'administrador';
    }

    $imageName = $path.'-'.$typeImg.'-'.time().'.png';

    S3Uploader::put($folder . $imageName, $image, 'public');

    return S3Uploader::url($folder. $imageName);

}

function deleteFile($url){

    $urlPath = parse_url($url);

    return S3Uploader::delete($urlPath['path']);

}

function isURL($data){

    if(filter_var($data, FILTER_VALIDATE_URL)){
        return true;
    }else{
        return false;
    }

}

function uploadBigFile($file, $tipo = '', $extension = '', $others = '', $additional = '')
{
    $folder = 'Adjuntos/';
    $fileName = '';

    if ($tipo == 'verificaciones') {
        $fileName = $others.'-'.time().'.'.$extension;

    } else if ($tipo == 'adjuntoDocumento') {
        $path = 'Documento';
        $fileName = $path.'-'.$additional.'.'.$extension;

    } else if ($tipo == 'encuestaInei') {
        $path = 'EncuestaINEI-'.time();
        $fileName = $others.'.'.$extension;

    } else if ($tipo == 'reporteMinisterio') {
        $path = 'ReporteMinisterio-'.time();
        $fileName = $others.'.'.$extension;

    } else if (in_array($tipo, ['poster', 'imagenTestimonial', 'imagenTestimonialEmpleador'])) {
        $path = 'Testimonial-'.time();
        $fileName = $path.'.'.$extension;

    } else if (in_array($tipo, ['imagen'])) {
        $path = 'Prensa-'.time();
        $fileName = $path.'.'.$extension;

    } else if (in_array($tipo, ['foto', 'fotodnidelantera', 'fotodnitrasera', 'fotorecibo'])) {
        $path = $tipo.'-'.time();
        $fileName = $path.'.'.$extension;

    } else if ($tipo == 'adjuntocontrato') {
        $path = 'adjuntocontrato';
        $fileName = $path.'-'.time().'.'.$extension;

    } else if ($tipo == 'adjuntoreserva') {
        $path = 'adjuntocontrato';
        $fileName = $path.'-'.time().'.'.$extension;

    } else if ($tipo == 'videointro') {
        $path = $others;
        $fileName = $path.'-'.time().'.'.$extension;

    } else if ($tipo == 'adjuntodetraccion') {
        $path = 'adjuntodetraccion';
        $fileName = $path.'-'.time().'.'.$extension;

    } else if ($tipo == 'adjuntoAdelantoRequerimiento') {
        $path = 'adjuntoAdelantoRequerimiento';
        $fileName = $path.'-'.time().'.'.$extension;

    } else if (in_array($tipo, ['boleta', 'educacion', 'comprobanteExterno'])) {
        $fileName = time().'.'.$extension;

    } else if (in_array($tipo, ['estadosCuenta', 'compra', 'tributo', 'pagoSalud', 'pagoJubilacion', 'boletaPago', 'seguimiento', 'respuestaAdjuntos'])) {
        $fileName = $others.'.'.$extension;
    }

    // --- DECODIFICACIÓN ROBUSTA ---
    if (str_starts_with($file, 'data:')) {
        // Base64 con MIME
        $file = preg_replace('#^data:\w+\/[\w\+\-\.]+;base64,#i', '', $file);
        $binary = base64_decode($file);
    } else if (preg_match('/^[A-Za-z0-9\/\r\n+]*={0,2}$/', $file)) {
        // Base64 sin MIME
        $binary = base64_decode($file);
    } else {
        // Binario puro
        $binary = $file;
    }

    S3Uploader::put($folder . $fileName, $binary, 'public');

    return S3Uploader::url($folder . $fileName);
}



function saveImageGeneralS3($new, $tipo , $old = '', $textImg = '', $extension = '', $others = '', $additional = ''){

    $imgOld = ($old == '' OR $old == null) ? null : $old;
    $imgNew = $new;
    $path = '';

    if(isURL($imgNew)){
        $path = $imgOld;
    }else{
        if($imgNew){

            if (in_array($tipo, ['imagen','estadosCuenta','comprobanteExterno','foto', 'poster', 'imagenTestimonialEmpleador', 'imagenTestimonial', 'fotodnidelantera','fotodnitrasera','fotorecibo','encuestaInei','reporteMinisterio','adjuntoAdelantoRequerimiento','respuestaAdjuntos', 'seguimiento', 'pagoSalud', 'pagoJubilacion', 'boletaPago', '', 'compra', 'tributo', 'boleta', 'adjuntocontrato', 'adjuntoreserva', 'adjuntodetraccion', 'videointro', 'verificaciones', 'educacion', 'adjuntoDocumento',])){
                $path = uploadBigFile($imgNew, $tipo, $extension, $others, $additional);
            }else{

                $path = base64ToFileGeneral($imgNew, $textImg, $tipo, $extension);
            }
        }

        if($path AND isURL($imgOld)){
            deleteFile($imgOld);
        }
    }

    return $path;
}

function getBase64Extension($base64)
{
    if (str_contains($base64, ';base64')) {
        $mime = explode(':', explode(';', $base64)[0])[1];
        return explode('/', $mime)[1];
    }

    return null;
}

