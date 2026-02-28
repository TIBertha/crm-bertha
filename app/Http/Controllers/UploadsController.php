<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UploadsController extends Controller
{

    public function ajaxUploadFile(Request $request){

        try{

            $url = '';

            $fileBase64  = $request->input('file');
            $campo       = $request->input('campo');
            $tipoarchivo = $request->input('tipoarchivo');

            if($fileBase64){

                if($tipoarchivo == 'application/pdf'){

                    $url = savePDF($fileBase64);

                }else if ( in_array($tipoarchivo, ['comprobanteExterno', 'contratoLaboral', 'documentoArchivo', 'encuestaINEI']) ){

                    $url = saveDocumentToS3($fileBase64);

                }else if(in_array($tipoarchivo, ['word'])){

                    $url = saveImageGeneralS3($fileBase64, '', 'word','','docx');
                }else{

                    $url = saveImageToS3($fileBase64);

                }
            }

            return response()->json([
                'code' => 200,
                'result' => $campo == 'cartillavacuna' ? array($url) : $url
            ]);

        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al subir archivo. Consulte al administrador' ]);
        }

    }
    public function ajaxUploadAdjunto(Request $request){

        DB::beginTransaction();

        try{

            $type = $request->input('type');
            $file = $request->file('file');
            $fileSize = $request->input('filesize');
            $filename = $request->input('filename');
            $fileid = $request->input('fileid');
            $extension = $request->input('extension');
            $fecha = $request->input('fecha');

            $contentFile = file_get_contents($file->getRealPath());


            $pathS3 = saveImageGeneralS3($contentFile, $type, '', '', $extension, $filename);

            $adjunto = [];

            if ($pathS3) {
                $adjunto = [
                    'id' => $fileid,
                    'name' => $filename,
                    'size' => $fileSize,
                    'url' => $pathS3,
                    'fecha' => $fecha,
                    'extension' => $extension,
                    'uploaded' => true
                ];
            }

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'exito', 'adjunto' => $adjunto]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al adjuntar archivo. Consulte al administrador', 'adjunto' => '' ]);

        }

    }

    public function ajaxUploadAdjuntoAdelanto(Request $request){

        $file = $request->file('file');
        $fileSize = $request->input('filesize');
        $filename = $request->input('filename');
        $fileid = $request->input('fileid');
        $extension = $request->input('extension');
        $fecha = $request->input('fecha');
        $adjunto = null;

        $contentFile = file_get_contents($file->getRealPath());

        $pathS3 = saveImageGeneralS3($contentFile, '', 'adjuntoAdelantoRequerimiento', '', $extension, '', $filename);

        if ($pathS3){
            $adjunto = [
                'id'   => $fileid,
                'name' => $filename,
                'size' => $fileSize,
                'url'  => $pathS3,
                'fecha'=> $fecha,
                'extension' => $extension,
                'uploaded' => true
            ];
        }

        return response()->json(['code' => 200, 'msj' => 'exito', 'adjunto' => $adjunto]);
    }
}
