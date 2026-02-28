<?php

use App\Models\CambioEstatusTrabajador;
use App\Models\Views\TransaccionBajaView;
use App\Models\Views\ContratoView;
use App\Models\Views\DistritoView;
use App\Models\Views\RequerimientoPostulacionView;
use App\Models\Views\TrabajadorView;
use Carbon\Carbon;

function formatDataPostulante($data){

    $result = [];

    if($data){

        foreach ($data as $d) {

            $urlWeb = config('webexperta.url-web');

            $linkfirma = getLinkFirma($d->id);
            $linkficha = $urlWeb . '/ficha-postulante/'. $d->token;
            $linkform  = $urlWeb . '/registro-postulante/'. $d->token;
            $linkfichaverificacion = $urlWeb . '/ficha-postulante/'. $d->token;

            $fechaHoy = (new DateTime(\Carbon\Carbon::now()->format('Y-m-d')))->format('Y-m-d H:i:s');

            $postulaciones = RequerimientoPostulacionView::where('trabajador_id', $d->id)->where('fechaentrevistaformat', '>=', $fechaHoy )->get();


            $diasTrabajoPorDias = null;

            if ($d->estatus_por_dias == 1){
                $findContratosDias = \App\Models\Views\ContratoView::where('trabajadorid', $d->id)->where('culminado',false);

                $diasTrabajoPorDias = $findContratosDias->count() > 0 ? getDiasTrabajoPD($findContratosDias->get()) : null;
            }
            $distrito = DistritoView::find($d->distrito_id);
            $estatusAnterior = getEstatusAnterior($d->id);
            $nullFoto = asset('img/user_icon.svg');
            $n = explode(" ", $d->nombres);
            $daysPast = $d->certificado_antecedente_fecha ? getDaysPast($d->certificado_antecedente_fecha) : null;

            $result[] = [
                'tiene_antecedentes'         => !empty($d->antecedente_pdf),
                'diaspasadoscertificadoantecedente' => $daysPast,
                'contact_name'               => $n[0] . ' ' . $d->apellidos ,
                'flag_emoji'                 => $d->postulando_pais_id == 11 ? '🇨🇱' : '🇵🇪',
                'id'                         => $d->id,
                'numeroDocumento'            => $d->numero_documento,
                'antecedentes_pdf'           => $d->antecedente_pdf,
                'tiene_cuenta'               => $d->tiene_cuenta,
                'foto'                       => $d->foto ? $d->foto : $nullFoto,
                'nombres'                    => $d->trabajador,
                'nacionalidad'               => $d->nacionalidad,
                'tipodocumento'              => findDocumentAcronym($d->tipodocumento_id),
                'tipodocumento_id'           => $d->tipodocumento_id,
                'nacionalidadid'             => $d->nacionalidad_id,
                'edad'                       => $d->edad ? $d->edad : '',
                'telefono_tarjeta'           => separateNumber($d->telefono),
                'telefono'                   => $d->telefono,
                'distrito'                   => $d->distrito_id ? $distrito->distritostres : ' - ',
                'telefono_tarjeta_whatsapp'  => separateNumber($d->telefono_whatsapp),
                'telefono_whatsapp'          => $d->telefono_whatsapp,
                'actividadid'                => $d->actividad_id,
                'actividades'                => showActividades($d->actividad_id, 2, $d->postulando_pais_id),
                'modalidades'                => showTiposModalidades($d->cama_adentro, $d->cama_afuera, $d->por_horas, $d->postulando_pais_id),
                'cama_adentro'               => $d->cama_adentro,
                'cama_afuera'                => $d->cama_afuera,
                'por_horas'                  => $d->por_horas,
                'lugarnacimiento'            => $d->lugarnacimiento,
                'certificado_antecedente'    => checkEstadoCertificadoAntecedente($d->certificado_antecedente, $d->certificado_antecedente_fecha),
                'videointroduccion'          => $d->videointroduccion,
                'video_introduccion_youtube' => $d->video_introduccion_youtube,
                'estadoid'                   => $d->estadoid,
                'estado'                     => $d->estado,
                'creado'                     => $d->creado,
                'actualizado'                => $d->actualizado,
                'firma'                      => $d->firma,
                'linkfirma'                  => $d->firma ? null : $linkfirma,
                'resultado_covid'            => $d->resultado_covid,
                'verificaciones_laborales'   => ($d->verificaciones_laborales && $d->verificaciones_laborales != "[]") ? configVerificaciones($d->verificaciones_laborales) : null,
                'token'                      => $d->estadoid == 5 ? null : $linkficha,
                'link_form'                  => 'Dale clic a este link ' . $linkform . "\r\n" . "Vas a llenar *TODO* lo que te pedimos. Hazlo bien y lo más antes posible, tenemos trabajo para ti y de este currículo depende que te contraten.",
                'token_privado'              => $d->estadoid == 5 ? null : $linkfichaverificacion,
                'tuvo_covid'                 => $d->tuvo_covid ?? null,
                'estatus_por_dias'           => $d->estatus_por_dias,
                'dias_contratados_por_dias'  => $diasTrabajoPorDias,
                'estatus_anterior'           => $estatusAnterior,
                'tiene_vacuna'               => $d->tiene_vacuna,
                'cartilla_verificada'        => !empty($d->cartilla_verificada),
                'adjunto_cartilla'           => ($d->adjunto_cartilla_vacuna || $d->adjunto_cartilla_vacuna_pdf) ? 'SI' : 'NO',
                'nodisponible'               => $d->nodisponible,
                'postulaciones'              => getDataPostulacion($postulaciones),
                'totalPostulaciones'         => $postulaciones ? count(getDataPostulacion($postulaciones)) : 0,
                'vecesBajas'                 => getBajasLength($d->id),
                'documento_vigente'          => $d->documento_vigente,
                'foto_documento_delantera'   => $d->foto_documento_delantera,
                'educacion'                  => configEstudios($d->adjunto_educacion),
                'paisData'                   => setPaisData($d->distrito_pais_id),
                'historialContacto'          => convertHistorialContacto($d->historial_contacto),
            ];
        }

    }

    return $result;

}

function getBajasLength($idTrabajador){
    $result = [];
    $bajas = TransaccionBajaView::where('trabajador_id', $idTrabajador)->orderBy('creado', 'desc')->get();

    foreach ($bajas as $b) {
        $result[] = [
            'id'                            => $b->id,
            'usuario_id'                    => $b->usuario_id,
            'trabajador_id'                 => $b->trabajador_id,
            'trabajador'                    => mb_convert_case(($b->trabajador), MB_CASE_UPPER, "UTF-8"),
            'trabajadornombres'             => mb_convert_case(($b->trabajadornombres), MB_CASE_UPPER, "UTF-8"),
            'trabajadorapellidos'           => mb_convert_case(($b->trabajadorapellidos), MB_CASE_UPPER, "UTF-8"),
            'trabajadorcorreo'              => $b->trabajadorcorreo,
            'trabajadortelefono'            => $b->trabajadortelefono,
            'trabajadortelefonowhatsapp'    => $b->trabajadortelefonowhatsapp,
            'tipobaja_id'                   => $b->tipobaja_id,
            'tipobajanombre'                => $b->tipobajanombre,
            'penalizacion_dias'             => $b->penalizacion_dias,
            'baja_id'                       => $b->baja_id,
            'bajanombre'                    => $b->bajanombre,
            'fecha_inicio_sancion'          => $b->fecha_inicio_sancion,
            'fecha_fin_sancion'             => $b->fecha_fin_sancion,
            'fecha_inicio_sancion_format'   => $b->fecha_inicio_sancion_format,
            'fecha_fin_sancion_format'      => $b->fecha_fin_sancion_format,
            'culminado'                     => $b->culminado,
            'creado_format'                 => $b->creado_format,
            'creado'                        => $b->creado,
            'actualizado'                   => $b->actualizado,
            'pagado'                        => boolval($b->pagado),
            'monto_pagado'                  => $b->monto_pagado,
            'fecha_pago_monto'              => $b->fecha_pago_monto_format
        ];
    }

    return $result;
}

function getDaysPast($fecha){
    $today = new DateTime(Carbon::now());
    $date = new DateTime($fecha);
    $daysPast = $today->diff($date)->days;

    return $daysPast+1;
}

function getEstatusAnterior($id){

    $porColocar = CambioEstatusTrabajador::borrado(false)->where('trabajador_id', $id)->where('estatuspostulante_id', 1)->first();

    if($porColocar){
        return "1";
    }else{

        $estatusAnterior = CambioEstatusTrabajador::borrado(false)->where('trabajador_id', $id)->orderBy('creado', 'DESC')->skip(1)->first();

        if($estatusAnterior){

            if($estatusAnterior->estatuspostulante_id == 8){
                return "8";
            }

        }

        $tra = TrabajadorView::find($id);

        $est = ($tra->foto AND $tra->firma AND $tra->foto_documento_delantera ) ? 1 : 7;

        if($est == 1){
            return "1";
        }else{
            return "7";
        }


    }

}

function generateTokenFicha($nombres, $apellidos){

    $result = null;

    if($nombres AND $apellidos){

        $arrayNombres = explode(' ', $nombres);
        $arrayApellidos = explode(' ', $apellidos);
        $sectionName= cleaner(strtolower($arrayNombres[0])) . '-' .substr(cleaner(strtolower($arrayApellidos[0])), 0, 1);

        do {
            $token = Str::random(6);

            $result = $sectionName . '-' .$token;

        } while ( \App\Models\Trabajador::where("token", $result)->first() );

    }

    return $result;
}

function almacenarToken($token, $usuario, $tipo){
    if ($token){
        $dataToken = [
            'usuario_id'        => $usuario,
            'token'             => $token,
            'tipo'              => $tipo,
            'creado'            => Carbon::now(),
            'actualizado'       => Carbon::now(),
        ];
        $exito = \App\Models\HistorialToken::create($dataToken);
        return json_encode(['code' => 200]);
    } else{
        return json_encode(['code' => 500]);
    }
}

function getHistorialBajaData($data){
    $result = [];

    if ($data){
        foreach ($data as $d){

            $baja = \App\Models\Baja::find($d->baja_id);

            $result[] = [
                'id'                                => $d->id,
                'creado_format'                     => $d->creado_format,
                'tipobajanombre'                    => $d->tipobajanombre,
                'bajanombre'                        => $d->bajanombre,
                'penalizacion_dias'                 => $d->penalizacion_dias,
                'monto_pagado'                      => $d->monto_pagado,
                'monto_referencial'                 => $baja->monto_referencial,
                'pagado'                            => boolval($d->pagado),
                'fecha_inicio_sancion_format'       => $d->fecha_inicio_sancion_format,
                'fecha_fin_sancion_format'          => $d->fecha_fin_sancion_format
            ];
        }
    }

    return $result;
}

function saveFormatVerificaciones($data){

    $result = null;

    if($data){

        $r = [];

        foreach($data as $key => $value){

            if(array_filter($value)){

                $dis = getDepartamentoProvinciaDistrito($value['distrito']);
                $act = getActividadesVerificaciones($value['actividad']);

                $d = [
                    "nombre" => $value['nombre'],
                    "apellidos" => $value['apellidos'] ?? null,
                    "departamento" => $dis ? $dis['departamento'] : null,
                    "provincia" => $dis ? $dis['provincia'] : null,
                    "distrito" => $dis ? $dis['distrito'] : null,
                    "telefono" => $value['telefono'] ? $value['telefono'] : null,
                    "actividad" => $act,
                    "tiempo" => isset($value['tiempo']) ? ($value['tiempo'] ? $value['tiempo'] : null) : null,
                    "inicioLabores" => $value['inicioLabores'] ? \Carbon\Carbon::parse($value['inicioLabores'])->format('Y-m-d') : null ,
                    "finLabores" => $value['finLabores'] ? \Carbon\Carbon::parse($value['finLabores'])->format('Y-m-d') : null,
                    "verificado" => $value['verificado'],
                    "motivoretiro" => $value['motivoretiro'] ?? null,
                    "adjuntos" => $value['adjuntos'] ?? null,
                    "adjuntosrecomendaciones" => $value['adjuntosrecomendaciones'] ?? null,
                    "ejecutivo" => $value['ejecutivo'] ?? null,
                    "llamar" => $value['llamar'] ?? false
                ];
                array_push($r, $d);
            }
        }

        $result = json_encode($r);
    }
    return $result;
}

function saveFormatAdjuntoEducacion($data){

    $result = null;

    if($data){

        $r = [];

        foreach($data as $key => $value){

            if(array_filter($value)){

                $d = [
                    "tipocertificado" => $value['tipocertificado'] ?? null,
                    "centro"          => $value['centro'] ?? null,
                    "titulo"          => $value['titulo'] ?? null,
                    "adjuntos"        => $value['adjuntos'] ?? null
                ];

                array_push($r, $d);

            }

        }

        $result = json_encode($r);
    }

    return $result;

}

function getSueldoPromedio($actividades, $camaadentro, $camaafuera, $pordias){

    if ($pordias) {
        return null;
    }

    if (!($camaadentro || $camaafuera)) {
        return null;
    }

    $ids = json_decode($actividades, true) ?? [];
    if (empty($ids)) {
        return null;
    }

    $sueldos = [];

    foreach ($ids as $id) {
        $act = \App\Models\Actividad::find($id);
        if (!$act) continue;

        $sueldos[] = $camaadentro
            ? (int) $act->precio_referencia
            : (int) $act->precio_referencia_cf;
    }

    return !empty($sueldos) ? max($sueldos) : null;
}



function getDistritosSearch($distritos){

    $result = null;

    if($distritos){

        foreach ($distritos as $d){
            $result[] = $d['value'];
        }

    }

    return $result;

}

function extractRangoEdad($data){

    if ($data){
        $rango = (json_decode($data,true))[0];

        return [
            'min' => $rango['edadminima'],
            'max' => $rango['edadmaxima'],
        ];
    }else{
        return null;
    }


}

function checkUpdateAdjuntoVerificacionesLaborales($oldData = null, $newData = null): bool {

    $result = false;

    if($oldData){

        if($newData){

            $filesID_old = getFilesIDVerificacionLaboral($oldData);
            $filesID_new = getFilesIDVerificacionLaboral($newData);

            $diferencias = array_diff($filesID_new, $filesID_old);

            if($diferencias){
                $result = true;
            }

        }

    }else{

        if($newData){

            foreach ($newData as $d){

                $adjuntos = isset($d['adjuntos']);

                if($adjuntos){
                    return count($d['adjuntos']) > 0;
                }

            }
        }

    }

    return $result;
}

function getFilesIDVerificacionLaboral($data) : array{

    $result = [];

    if($data){

        foreach ($data as $d){

            $adjuntos = isset($d['adjuntos']);

            if($adjuntos AND $d['adjuntos']){

                foreach ($d['adjuntos'] as $a){
                    array_push($result, $a['id']);
                }

            }

        }

    }

    return $result;
}

function saveCambioEstatusPostulante($trabajadorid, $estatus){

    return \App\Models\CambioEstatusTrabajador::create([
        'trabajador_id'           => $trabajadorid,
        'estatuspostulante_id'    => $estatus,
    ]);

}

function formatDataUsuarios($data){

    $result = [];

    if ($data){
        foreach ($data as $d) {
            $isTrabajador = TrabajadorView::where('usuario_id', $d->id)->count() != 0 ? true : false;

            $result[] = [
                'id'                => $d->id,
                'usuario'           => $d->nombres . ' ' . $d->apellidos,
                'numeroDocumento'   => $d->numero_documento,
                'telefono'          => $d->telefono,
                'registrado'        => $isTrabajador,
            ];
        }
    }

    return $result;

}

function showVerificaciones($verificaciones, $restringida = false){

    $result = [];

    if($verificaciones){

        foreach (json_decode($verificaciones, true) as $d){

            $veri = [];
            $reco = [];

            if($d['telefono']){

                //Condicion para postulante con locacion de trabajo en Argentina
                $departamento = ( ($d['nombre'] == 'MERCEDES DE PREVEZ' AND $d['telefono'] == '+5491144308016') ? 'RETIRO, BUENOS AIRES, ARGENTINA' : ($d['departamento']  ? \App\Models\Distrito::find($d['distrito'])->nombre . ' | ' . \App\Models\Departamento::find($d['departamento'])->nombre : "-") );


                if(isset($d['adjuntos'])){

                    $veri = $d['adjuntos'];
                }

                if(isset($d['adjuntosrecomendaciones'])){
                    $reco = $d['adjuntosrecomendaciones'];
                }

                $apellidos = isset($d['apellidos']) ? $d['apellidos'] : null;

                $result[] =[
                    'nombre'       => $restringida ? getNombresAnteriorEmpleador($d['nombre'], $apellidos) : $d['nombre'] . ' ' . $apellidos ,
                    'departamento' => $departamento,
                    'provincia'    => $d['provincia']  ? \App\Models\Provincia::find($d['provincia'])->nombre : ' - ',
                    'distrito'     => $d['distrito']  ? \App\Models\Distrito::find($d['distrito'])->nombre . ' - ' . \App\Models\Provincia::find($d['provincia'])->nombre : ' - ',
                    'telefono'     => $d['telefono'] ? ($restringida ? restringirInformacion($d['telefono']) : $d['telefono']) : ' - ',
                    'inicioLabores'=> isset($d['inicioLabores']) ? \Carbon\Carbon::parse($d['inicioLabores'])->format('m-Y') : '',
                    'inicio'       => isset($d['inicioLabores']) ? $d['inicioLabores'] : '',
                    'finLabores'   => isset($d['finLabores']) ? \Carbon\Carbon::parse($d['finLabores'])->format('m-Y') : '',
                    'anio'         => isset($d['anio']) ? $d['anio'] : '',
                    'actividad'    => $d['actividad']  ? showActividades($d['actividad']) : ' - ',
                    'tiempo'       => $d['tiempo'] ? $d['tiempo'] : ' - ',
                    'verificado'   => $d['verificado'],
                    'adjuntosverificacion' => $restringida ? [] : $veri,
                    'adjuntosrecomendacion' => $restringida ? [] : $reco

                ];
            }

        }
    }

    if ($result){

        $collection = collect($result);

        $sorted = $collection->sortByDesc('inicio');

        return $sorted->values()->all();
    }

}

function verifyS3Photo($foto){

    $nullFoto = asset('img/user_icon.svg');

    //if (isFileS3Exists($foto)){

    if ($foto){
        $result = $foto;
    }else{
        $result = $nullFoto;
    }

    return $result;
}

function getRecomendacionesUrl($verificaciones){

    $result = null;

    if($verificaciones){

        foreach (json_decode($verificaciones, true) as $v){

            if(isset($v['adjuntosrecomendaciones'])){

                foreach ($v['adjuntosrecomendaciones'] as $adj){

                    if($adj['url']){

                        $result[] = $adj['url'];
                    }
                }

            }

        }

    }

    return $result;
}

function showEducacion($educacion, $restringida = false){

    $result = [];

    if($educacion){

        foreach (json_decode($educacion, true) as $e){

            $result[] =[
                'tipocertificado' => isset($e['tipocertificado']) ? \App\Models\TipoCertificado::find($e['tipocertificado'])->nombre : ' - ',
                'centro'          => isset($e['centro']) ? $e['centro'] : ' - ',
                'titulo'          => isset($e['titulo'])  ? $e['titulo'] : ' - ',
                'inicio'          => isset($e['fechainicio']) ? \Carbon\Carbon::parse($e['fechainicio'])->format('m-Y') : '',
                'fin'             => isset($e['fechafin']) ? \Carbon\Carbon::parse($e['fechafin'])->format('m-Y') : '',
                'tiempo'          => isset($e['tiempo']) ? $e['tiempo'] : ' - ',
                //'adjunto'         => $adj,
            ];

        }
    }

    if ($result){

        $collection =collect($result);

        $sorted = $collection->sortByDesc('inicio');

        return $sorted->values()->all();
    }

}

function isNewPageSeccionEstudio($educacion, $verificaciones, $checks){

    //$cantidadChecks = count_array_values($checks, true);
    $cantidadVerificaciones = $verificaciones ? count( json_decode($verificaciones, true)) : 0;
    $cantidadEducacion = $educacion ? count( json_decode($educacion, true)) : 0;

    if($cantidadVerificaciones == 1 AND $cantidadEducacion == 1){
        return false;
    }else{
        return true;
    }

}

function showIdiomas($idiomas, $separador = ' , ', $limit = 0){

    $result = [];

    if($idiomas){

        foreach (json_decode($idiomas) as $d){

            $result[] = (\App\Models\Idioma::find($d)->nombre);
        }

        $newArray = $result;

        if($limit){
            $newArray = array_slice($result, 0, $limit);
        }

        $last = array_pop($newArray);

        if($newArray){

            if($last[0] == 'I'){
                return implode($separador, $newArray)." E ". $last;
            }

            return implode($separador, $newArray)." Y ". $last;
        }

        return $last;

    }

    return $result;

}

function showContactoEmergencia($contacto){

    $result = [];

    $newArray = [];

    if($contacto){

        foreach (json_decode($contacto, true) as $d){

            $result[] =[
                'nombre'        =>  $d['nombre'],
                'telefono'      =>  $d['telefono'],
                'parentesco'    =>  $d['parentesco'] ? ((\App\Models\Parentesco::find($d['parentesco'])->nombre)) : "",
            ];
        }

        $newArray = array_slice($result, 0 , 3);
    }

    return $newArray;

}

function calculoLiquidacion($fechaIngreso, $fechaCese, $sueldo, $version){

    $periodo = calculateDaysBetweenDates($fechaIngreso, $fechaCese);

    $fiestas = cacluloFiestasPatrias($fechaIngreso, $fechaCese, $sueldo, $version);
    $navidad = cacluloNavidad($fechaIngreso, $fechaCese, $sueldo, $version);
    $diasFiestas = $fiestas['diasFiestas'];
    $diasNavidad = $navidad['diasNavidad'];

    $totaldias = ( $diasNavidad + $diasFiestas);

    $totalanios= calculateNumberYears($fechaIngreso, $fechaCese);
    $sueldodia = $sueldo / 30;
    $cts = ($sueldo / 360) * $totaldias;
    $vacaciones = ($sueldo / 360) * $totaldias;

    $calculoCTSNuevo = calculoCTSNuevo($fechaIngreso, $fechaCese, $sueldo, $version);

    $totalfiestas = $fiestas['total'];
    $totalnavidad = $navidad['total'];
    $totalCtsVaca = $calculoCTSNuevo['montoTotal'];

    $newFechaInicio = Carbon::parse($fechaIngreso);
    $newFechaFinal = Carbon::parse($fechaCese);

    $liquidacion = [
        'version' => $version,
        'sueldo' => formatMoney($sueldo),
        'fechaingreso' => $newFechaInicio->format('d/m/Y'),
        'fechacese' => $newFechaFinal->format('d/m/Y'),
        'periodo' => $periodo,
        'sueldodia' => formatMoney($sueldodia),
        'totaldias' =>$totaldias,
        'totalanios' => $totalanios,
        'cts' => formatMoney($cts),
        'vacaciones' => formatMoney($vacaciones),
        'total' => formatMoney($totalfiestas + $totalnavidad + $totalCtsVaca + $totalCtsVaca),
        'totalfiestas' => $totalfiestas ? formatMoney($totalfiestas) : '0,00',
        'totalnavidad' => $totalnavidad ? formatMoney($totalnavidad) : '0,00',
        'totalCtsVaca' => $totalCtsVaca ? formatMoney($totalCtsVaca) : '0,00',
        'fiestas' => $fiestas['registros'],
        'navidad' => $navidad['registros'],
        'calculoCtsVaca' => $calculoCTSNuevo['intervaloFechas']
    ];

    return $liquidacion;

}

function getCopyCalculoLiquidacion($calculo, $version){
    $t1 = 'LIQUIDACION DE BENEFICIOS LABORALES';
    $t2 = ($version == 'nueva' ? 'Nueva Ley N° 31047 (Un sueldo por beneficio)' : 'Antigua Ley N° 27986 (Medio sueldo por beneficio)') . '. Ley de las Trabajadoras del Hogar. ' . "\r\n"  . '*Si en caso se ha realizado algún pago de beneficios, es responsabilidad del solicitante restar los adelantos al resultado final de la presente liquidación. Los beneficios se pagan proporcional al tiempo trabajado.*';

    $fechaIngreso = 'INICIO DE LABORES: ' . $calculo['fechaingreso'];
    $fechaSalida = 'FIN DE LABORES: ' . $calculo['fechacese'];
    $tiempo = 'TIEMPO TRABAJADO: ' . $calculo['periodo'];
    $sueldo = 'SUELDO: S/. ' . $calculo['sueldo'];

    $t3 = 'Gratificación de Fiestas Patrias:';
    $gfp = '';
    foreach ($calculo['fiestas'] as $f){
        $gfp .=  $f['ano'] . ': S/. ' . $f['total'] . "\r\n";
    }

    $t4 = 'Gratificación de Navidad:';
    $gn = '';
    foreach ($calculo['navidad'] as $n){
        $gn .=  $n['ano'] . ': S/. ' . $n['total'] . "\r\n";
    }

    $t5 = 'Compensación por tiempo de servicios (CTS):';
    $cts = '';
    foreach ($calculo['calculoCtsVaca'] as $c){
        $cts .=  $c['fechaActual'] . ': S/. ' . $c['total'] . "\r\n";
    }

    $t6 = 'Vacaciones:';
    $v = '';
    foreach ($calculo['calculoCtsVaca'] as $c){
        $v .=  $c['fechaActual'] . ': S/. ' . $c['total'] . "\r\n";
    }

    //$t7 = 'TOTAL LIQUIDACIÓN A PAGAR: S/. ' . $calculo['total'];


    return ($t1 . "\r\n"  . $t2 . "\r\n" . "\r\n"  . $fechaIngreso . "\r\n"  . $fechaSalida . "\r\n"  . $tiempo  . "\r\n"  . $sueldo . "\r\n"  . "\r\n"  . $t3 . "\r\n" . $gfp . "\r\n" . $t4 . "\r\n" . $gn . "\r\n" . $t5 . "\r\n" . $cts . "\r\n" . $t6 . "\r\n" . $v);

}
