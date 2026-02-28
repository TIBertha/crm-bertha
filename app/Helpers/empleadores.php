<?php

function getNewEmpleadores(){
    $data = \App\Models\Views\EmpleadorView::
    where('actualizado', '>=', \Carbon\Carbon::now()->subDays(7) )
        ->whereIn('estatusid', [1,2])
        ->orderBy('actualizado', 'desc')
        ->activo(true);

    return $data;
}

function getEmpleadores($lista, $offset){

    $data = $lista->offset($offset)->limit(10)->get();

    return $data;
}

function isDataEmpleador($empleador){

    $emp = \App\Models\Views\EmpleadorView::find($empleador);

    $domicilio = \App\Models\Domicilio::borrado(false)->activo(true)->where('usuario_id', $emp->usuario_id)->get();

    $pais = $emp->paisnacimiento_id;

    if( (count($domicilio) > 0) AND $emp->tipodocumento_id AND $emp->numero_documento){
        return true;
    }else{
        return false;
    }
}

function generateTokenEmpleador($nombres, $apellidos){

    $result = null;

    if($nombres AND $apellidos){

        $arrayNombres = explode(' ', $nombres);
        $arrayApellidos = $apellidos ? explode(' ', $apellidos) : ['null'];
        $sectionName= cleaner(strtolower($arrayNombres[0])) . '-' .substr(cleaner(strtolower($arrayApellidos[0])), 0, 1);

        do {
            $token = Str::random(6);

            $result = $sectionName . '-' .$token;

        } while ( \App\Models\Empleador::where("token", $result)->first() );


    }

    return $result;
}

function generarTokenFormRequerimiento(){

    do {
        $token = Str::random(10);
    } while ( \App\Models\RequerimientoLink::where("token", $token)->first() );

    return $token;
}

function formatDataEmpleador($data){

    $result = [];

    if($data){

        foreach ($data as $d) {

            $linkaceptocondiciones = 'https://holabertha.com/condiciones/'. $d->token;
            $domicilio = \App\Models\Domicilio::where('usuario_id', $d->usuario_id)->first();
            $domicilioDir = $domicilio ? $domicilio->direccion : null;
            $distritoDir = $domicilio ? (\App\Models\Views\DistritoView::find($domicilio->distrito_id))->distritoscinco : null;
            $referenciaDir = $domicilio ? $domicilio->referencia : null;

            $fechaNuevosTerminos1711 = new \DateTime('17-11-2021');
            $formatCreado = new \DateTime(str_replace("/","-",$d->creado));

            if ($formatCreado > $fechaNuevosTerminos1711){
                $newTerms1711 = true;
            }else{
                $newTerms1711 = false;
            }
            $n = explode(" ", $d->nombres);

            $result[] = [
                'contact_name'              => $n[0] . ' ' . $d->apellidos ,
                'flag_emoji'                => $d->pais_pedido_id  ? ($d->pais_pedido_id == 11 ? '🇨🇱' : '🇵🇪') : '🇵🇪',
                'new'                       => $newTerms1711,
                'id'                        => $d->id,
                'nombrecorto'               => getNombreCorto($d->nombres, $d->apellidos, true),
                'empleador'                 => $d->empleador,
                'tarjetaTelefono'           => separateNumber($d->telefono),
                'telefono'                  => $d->telefono,
                'correo'                    => $d->correo,
                'activo'                    => $d->activo,
                'domiciliosReg'             => $domicilio,
                'direccionDR'               => $domicilioDir,
                'distritoDR'                => $distritoDir,
                'refrenciaDR'               => $referenciaDir,
                'domicilio'                 => ($d->numero_domicilios > 0) ? true : false,
                'contrato'                  => $d->datacontrato,
                'estatus'                   => $d->estatus,
                'estatusid'                 => $d->estatusid,
                'nombreempresa'             => $d->nombreempresa,
                'rucempresa'                => $d->rucempresa,
                'historial'                 => $d->contratos > 0 ? true : false,
                'usuariointernonombres'     => $d->usuariointernonombres,
                'usuariointerapellidos'     => $d->usuariointerapellidos,
                'referido'                  => $d->referido ? true : false,
                'linkaceptocondiciones'     => $d->token ? $linkaceptocondiciones : null,
                'linkrequerimiento'         => $d->link_requerimiento,
                'token'                     => $d->token,
                'fechaAceptadoTC'           => ($d->acepto_terminos) ? $d->fecha_acepto_terminos_format : null,
                'horaAceptadoTC'            => ($d->acepto_terminos) ? $d->hora_acepto_terminos_format : null,
                'aceptoterminos'            => $d->acepto_terminos
            ];
        }

    }

    return $result;

}

function buscarVinculosEmpleador($idEmpleador){
    $empleador = \App\Models\Empleador::find($idEmpleador);
    $contratos = \App\Models\Views\ContratoView::where('empleadorid',$idEmpleador);
    $requerimientos = \App\Models\Views\RequerimientoView::where('empleadorid', $idEmpleador);
    $domicilios = \App\Models\Domicilio::where('usuario_id', $empleador->usuario_id);

    return([
        'total'                         => $contratos->count() + $requerimientos->count() + $domicilios->count(),
        'contratos'                     => $contratos->count(),
        'requerimientos'                => $requerimientos->count(),
        'domicilios'                    => $domicilios->count(),
        'comprobantes'                  => 0,
    ]);
}

function transferirDatosEmpleador($idOldEmpleador, $idNewEmpleador){
    $oldEmpleador = \App\Models\Empleador::find($idOldEmpleador);
    $newEmpleador = \App\Models\Empleador::find($idNewEmpleador);
    $contratos = \App\Models\Views\ContratoView::where('empleadorid',$idOldEmpleador);
    $requerimientos = \App\Models\Views\RequerimientoView::where('empleadorid', $idOldEmpleador);
    $domicilios = \App\Models\Domicilio::where('usuario_id', $oldEmpleador->usuario_id);

    if($contratos->count() >= 1){
        foreach ($contratos->get() as $c){
            $datCont = [
                'empleador_id' => $idNewEmpleador,
            ];
            $e = \App\Models\Contrato::where('empleador_id', $idOldEmpleador)->update($datCont);
        }
    }

    if($requerimientos->count() >= 1){
        foreach ($requerimientos->get() as $c){
            $datReq = [
                'empleador_id' => $idNewEmpleador,
            ];
            $e = \App\Models\Requerimiento::where('empleador_id', $idOldEmpleador)->update($datReq);
        }
    }

    if($domicilios->count() >= 1){
        foreach ($domicilios->get() as $c){
            $datDom = [
                'usuario_id' => $newEmpleador->usuario_id,
            ];
            $e = \App\Models\Domicilio::where('usuario_id', $idOldEmpleador)->update($datDom);
        }
    }

    return 200;
}

function eliminarDatosEmpleador($idOldEmpleador){
    $oldEmpleador = \App\Models\Empleador::find($idOldEmpleador);
    $contratos = \App\Models\Views\ContratoView::where('empleadorid',$idOldEmpleador);
    $requerimientos = \App\Models\Views\RequerimientoView::where('empleadorid', $idOldEmpleador);
    $domicilios = \App\Models\Domicilio::where('usuario_id', $oldEmpleador->usuario_id);

    if($contratos->count() >= 1){
        foreach ($contratos->get() as $c){
            $datCont = [
                'empleador_id' => 1,
            ];
            $e = \App\Models\Contrato::where('empleador_id', $idOldEmpleador)->update($datCont);
        }
    }
    if($requerimientos->count() >= 1){
        foreach ($requerimientos->get() as $c){
            $e = \App\Models\Requerimiento::where('empleador_id', $idOldEmpleador)->delete();
        }
    }
    if($domicilios->count() >= 1){
        foreach ($domicilios->get() as $c){
            $e = \App\Models\Domicilio::where('usuario_id', $oldEmpleador->usuario_id)->delete();
        }
    }

    return 200;
}
