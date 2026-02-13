<?php

use App\Models\DiaSemana;
use Carbon\Carbon;

function showTiposModalidades($ca, $cf, $ph, $pais){

    $mod = [
        $ca ? (in_array($pais, [49]) ? 'DE PLANTA' : 'CAMA ADENTRO') : '',
        $cf ? (in_array($pais, [49]) ? 'ENTRADA POR SALIDA' : 'CAMA AFUERA') : '',
        $ph ? 'POR DIAS' : '',
    ];

    $filterMod = array_filter($mod);

    if($filterMod){
        return implode(' | ', $filterMod);
    }else{
        return '';
    }

}

function showModalidades($modalidades){

    $result = [];

    if($modalidades){

        foreach (json_decode($modalidades) as $d){

            $result[] = (\App\Models\Modalidad::find($d)->nombre);
        }

        sort($result);

        return implode(' | ',$result);

    }

    return $result;

}

function showActividades($actividades, $limit = '', $paisPostulando = 54){

    $result = '';

    if($actividades){

        $r = [];

        foreach (json_decode($actividades) as $d){

            if($d == 10){
                $nameAct = 'CUIDADO ADULTO';
            }else{
                $act = \App\Models\Actividad::find($d);
                $n = $act->nombre;
                if($paisPostulando == 11){
                    $n = $act->nombre_ch;
                }else if($paisPostulando == 49){
                    $n = $act->nombre_mx;
                }
                $nameAct = $n;
            }

            $r[] = $nameAct;
        }

        $newArray = $r;

        if($limit){
            $newArray = array_slice($r, 0, $limit);
        }

        return implode(' | ',$newArray);

    }

    return $result;

}

function checkEstadoCertificadoAntecedente($certificado, $fechacertificado){

    if($certificado AND $fechacertificado){

        $fc = Carbon::parse($fechacertificado);
        $fechaActual = \Carbon\Carbon::now();
        $fechaantAddMonth = \Carbon\Carbon::now()->subMonth(3);

        $vigente = $fc->isBetween($fechaantAddMonth, $fechaActual, true);

        if($vigente){
            return 2;
        }else{
            return 3;
        }

    }else{
        //SIN ANTECEDENTE
        return 4;
    }
}

function configVerificaciones($verificaciones){

    if ($verificaciones){

        $veri = [];

        foreach (json_decode($verificaciones, true) as $data){

            $veri[] = [
                'adjunto'   => isset($data['adjuntos']) ? ($data['adjuntos'] ? 'si' : 'no') : null,
                'ejecutivo' => isset($data['ejecutivo']) ? ($data['ejecutivo']) : null,
                'llamar'    => isset($data['llamar']) ? ($data['llamar']) : false,
            ];

        }

        return $veri;

    }
}

function getDataPostulacion($data){
    $result = [];

    if ($data) {

        foreach ($data as $d){

            $req = \App\Models\Views\RequerimientoView::find($d->requerimiento_id);

            $fechaNuevosTerminos1711 = new \DateTime('17-11-2021');
            $formatCreado = new \DateTime(str_replace("/","-",$d->creado));

            if ($formatCreado > $fechaNuevosTerminos1711){
                $newTerms1711 = true;
            }else{
                $newTerms1711 = false;
            }

            $fechaEntrevista = '';

            if ($d->fechaentrevistaformat){
                $f = formatFecha($d->fechaentrevistaformat);
                $fechaEntrevista = ( mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ' ' . $f['numeroDia'] . '/' . $f['numeroMes']);
            }

            $result[] = [
                'idReq' => $d->requerimiento_id ? $d->requerimiento_id : '',
                'empleador' => $d->empleador ? mb_convert_case( $d->empleador , MB_CASE_TITLE, "UTF-8") : '',
                'fechaentrevista' => $fechaEntrevista,
                'horaentrevista' => $d->horaentrevista ? Carbon::parse($d->horaentrevista)->format('h:i A') : '',
                'actividad' => $req->actividad ? mb_convert_case( $req->actividad , MB_CASE_TITLE, "UTF-8") : '',
                'modalidad' => $req->modalidad ? mb_convert_case( $req->modalidad , MB_CASE_TITLE, "UTF-8") : '',
                'sueldo' => $req->sueldo ? $req->sueldo : '',
                'distritoDomicilio' => $req->distrito_domicilio ? $req->distrito_domicilio : '',
                'copyRequerimiento' => getCopyDetalles($req, null, null, null, null, null, null, null, false, $newTerms1711 , true, false),
            ];
        }

    }

    return $result;
}

function configEstudios($estudios){

    $result = null;
    if ($estudios){
        foreach (json_decode($estudios, true) as $data){

            $result[] = [
                'hasAdj'        => isset($data['adjuntos'][0]['url']) ? true : false,
                'title'         => isset($data['centro']) ? $data['centro'] : '',
                'time'          => isset($data['tiempo']) ? $data['tiempo'] : '',
            ];
        }
    }

    return $result;
}

function showDiasSemana($dias, $limit = ''){

    $result = [];

    if($dias){

        foreach (json_decode($dias) as $d){

            $result[] = (DiaSemana::find($d)->nombre);
        }

        //sort($result);

        $newArray = $result;

        if($limit){
            $newArray = array_slice($result, 0, $limit);
        }

        return implode(' | ',$newArray);

    }

    return $result;

}

function getPrimerNombre($nombre){
    $myvalue = $nombre;
    $arr = explode(' ',trim($myvalue));

    if(count($arr) > 1){
        return $arr[0];
    }else{
        return $nombre;
    }

}