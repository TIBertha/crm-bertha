<?php

use App\Models\DiaSemana;
use App\Models\TipoContrato;
use App\Models\Contrato;
use Carbon\Carbon;

function createArrayCantidad($number, $inicio = 0){

    $result = [];

    for($i = $inicio; $i <= $number; $i++){

        array_push($result, $i);
    }

    return$result;

}

function saveUbicacion($ubicacion, $tipo){
    $result = null;
    if ($ubicacion){

        $dist = \App\Models\Views\DistritoView::find($ubicacion);

        if ($tipo == 'departamento'){
            $result = $dist->departamento_id;
        }else if ($tipo == 'provincia'){
            $result = $dist->provincia_id;
        }else if ($tipo == 'distrito'){
            $result = $dist->id;
        }

    }
    return $result;
}

function armarRangoEdad($data){

    $result = null;

    if ($data){
        $dataRango = extractRangoEdad($data);

        $result = $dataRango['min'] . ' - ' . $dataRango['max'];
    }

    return $result;

}

function getMapLink($latitud, $longitud, $tipo){
    $result = '';

    if ($tipo == 'image'){
        $result = 'maps.googleapis.com/maps/api/staticmap?center='. $latitud .','. $longitud .'&zoom=16&size=400x250&key=AIzaSyDn_o7H3NGNJhHZ5A13m7NIBqpmjq4YIW4';
    }elseif ($tipo == 'link'){
        $result = 'google.com.pe/maps/@' . $latitud . ',' . $longitud . ',17z';
    }

    return $result;
}

function getActividadesVerificaciones($data){

    if(!empty($data)){

        return saveFormatMultiselect($data);

    }else{
        return NULL;
    }

}

function checkAntecedente($tra){

    $ant = \App\Models\Antecedente::borrado(false)->where('trabajador_id', $tra)->orderBy('creado', 'desc')->first();

    if($ant){

        $estatus = $ant->estatusantecedente_id;
        $creado = $ant->creado;

        if($estatus == 1){
            return 1;
        }else{

            $fechaant = $creado;
            $fechaActual = \Carbon\Carbon::now();
            $fechaantAddMonth = \Carbon\Carbon::now()->subMonth(3);

            $vigente = $fechaant->isBetween($fechaantAddMonth, $fechaActual, true);

            if($vigente){
                return 2;
            }else{
                return 3;
            }
        }

    }else{

        //SIN ANTECEDENTE
        return 4;
    }

}

function getdiasTrabajo($data, $limit = ''){
    $result = [];

    if ($data){

        foreach (json_decode($data) as $d){
            $dia = (\App\Models\DiaSemana::find($d))->nombre;

            $result[] = $dia;
        }

        $newArray = $result;

        if($limit){
            $newArray = array_slice($result, 0, $limit);
        }

        return implode(', ',$newArray);

    }

    return $result;

}

function countList($lista){
    $result = 0;
    if ($lista){
        $result = count(json_decode($lista));
    }
    return $result;
}

function ValidateNombresApellidos($id,$nombres, $apellidos, $tipo){
    $re1 = 0;
    $re2 = 0;
    $user = '';

    if ($tipo == 'empleador'){
        $user = \App\Models\Views\EmpleadorView::find($id);
    }else if ($tipo == 'trabajador'){
        $user = \App\Models\Views\TrabajadorView::find($id);
    }

    if ($nombres == $user->nombres){
        $re1 = 1;
    }
    if ($apellidos == $user->apellidos){
        $re2 = 1;
    }

    $re = $re1 + $re2;

    return ($re == 2) ? true : false;
}

function getModalidades($modalidades){

    $ca = false;
    $cf = false;
    $ph = false;

    if($modalidades){

        foreach ($modalidades as $m){

            if($m['id'] == 1){
                $ca = $m['isChecked'];
            }else if($m['id'] == 2){
                $cf = $m['isChecked'];
            }else if($m['id'] == 3){
                $ph = $m['isChecked'];
            }
        }

    }

    return [
        'ca' => $ca,
        'cf' => $cf,
        'ph' => $ph
    ];
}

function getAlimentos($alimentos){

    $desayuno = false;
    $almuerzo = false;
    $cena = false;

    if($alimentos){

        foreach ($alimentos as $a){

            if($a['id'] == 1){
                $desayuno = $a['isChecked'];
            }else if($a['id'] == 2){
                $almuerzo = $a['isChecked'];
            }else if($a['id'] == 3){
                $cena = $a['isChecked'];
            }
        }

    }

    return [
        'desayuno' => $desayuno,
        'almuerzo' => $almuerzo,
        'cena' => $cena
    ];
}

function getDepartamentoProvinciaDistrito($data){

    if(!empty($data)){

        $distritoid = $data['value'];
        $distrito = \App\Models\Distrito::find($distritoid);
        $provincia = \App\Models\Provincia::find($distrito->provincia_id);
        $departamento = \App\Models\Departamento::find($provincia->departamento_id);

        return [
            'distrito' => $distritoid,
            'provincia' => $provincia->id,
            'departamento' => $departamento->id
        ];

    }else{
        return null;
    }

}
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

    static $cacheActividades = null;

    // Cargar todas las actividades una sola vez
    if ($cacheActividades === null) {
        $cacheActividades = \App\Models\Actividad::all()->keyBy('id');
    }

    $result = '';

    if($actividades){

        $r = [];

        foreach (json_decode($actividades) as $d){

            if($d == 10){
                $nameAct = 'CUIDADO ADULTO';
            } else {

                // Obtener la actividad desde el cache (0 queries)
                $act = $cacheActividades[$d] ?? null;

                if (!$act) continue;

                if($paisPostulando == 11){
                    $nameAct = $act->nombre_ch;
                } else if($paisPostulando == 49){
                    $nameAct = $act->nombre_mx;
                } else {
                    $nameAct = $act->nombre;
                }
            }

            $r[] = $nameAct;
        }

        $newArray = $limit ? array_slice($r, 0, $limit) : $r;

        return implode(' | ', $newArray);
    }

    return $result;
}


function checkEstadoCertificadoAntecedente($certificado, $fechacertificado){
    if (!$certificado || !$fechacertificado) {
        return 4;
    }

    $fc = Carbon::parse($fechacertificado);
    $hoy = Carbon::now();
    $limite = Carbon::now()->subMonths(3);

    return $fc->isBetween($limite, $hoy, true) ? 2 : 3;
}


function configVerificaciones($verificaciones){
    if (!$verificaciones) {
        return null;
    }

    $items = json_decode($verificaciones, true) ?? [];

    $veri = [];

    foreach ($items as $data) {
        $veri[] = [
            'adjunto'   => isset($data['adjuntos'])
                ? (!empty($data['adjuntos']) ? 'si' : 'no')
                : null,
            'ejecutivo' => $data['ejecutivo'] ?? null,
            'llamar'    => $data['llamar'] ?? false,
        ];
    }

    return $veri;
}


function getDataPostulacion($data)
{
    $result = [];

    if (!$data || $data->isEmpty()) {
        return $result;
    }

    foreach ($data as $d) {

        $req = $d->requerimiento; // relación precargada

        // Seguridad: si no existe el requerimiento, saltamos
        if (!$req) {
            continue;
        }

        // Nuevos términos
        $fechaNuevosTerminos1711 = new DateTime('2021-11-17');
        $formatCreado = new DateTime(str_replace("/", "-", $d->creado));
        $newTerms1711 = $formatCreado > $fechaNuevosTerminos1711;

        // Fecha entrevista
        $fechaEntrevista = '';
        if ($d->fechaentrevistaformat) {
            $f = formatFecha($d->fechaentrevistaformat);
            $fechaEntrevista = mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8")
                . ' ' . $f['numeroDia'] . '/' . $f['numeroMes'];
        }

        $result[] = [
            'idReq'             => $d->requerimiento_id,
            'empleador'         => $d->empleador ? mb_convert_case($d->empleador, MB_CASE_TITLE, "UTF-8") : '',
            'fechaentrevista'   => $fechaEntrevista,
            'horaentrevista'    => $d->horaentrevista ? Carbon::parse($d->horaentrevista)->format('h:i A') : '',
            'actividad'         => $req->actividad ? mb_convert_case($req->actividad, MB_CASE_TITLE, "UTF-8") : '',
            'modalidad'         => $req->modalidad ? mb_convert_case($req->modalidad, MB_CASE_TITLE, "UTF-8") : '',
            'sueldo'            => $req->sueldo,
            'distritoDomicilio' => $req->distrito_domicilio,
            'copyRequerimiento' => getCopyDetalles(
                $req,
                null, null, null, null, null, null, null,
                false,
                $newTerms1711,
                true,
                false
            ),
        ];
    }

    return $result;
}


function configEstudios($estudios){

    $result = null;
    if ($estudios){
        foreach (json_decode($estudios, true) as $data){

            $result[] = [
                'hasAdj' => isset($data['adjuntos'][0]['url']),
                'title'  => $data['centro'] ?? null,
                'time'   => $data['tiempo'] ?? null,
            ];

        }
    }

    return $result;
}

function getBajasLength($idTrabajador){
    $result = [];
    $bajas = \App\Models\TransaccionBaja::where('trabajador_id', $idTrabajador)->orderBy('creado', 'desc')->get();

    foreach ($bajas as $b) {
        $result[] = [
            'id'                            => $b->id,
            'usuario_id'                    => $b->trabajador->usuario_id,
            'trabajador_id'                 => $b->trabajador->id,
            'trabajador'                    => mb_convert_case(($b->trabajador->usuario->nombres . ' ' . $b->trabajador->usuario->apellidos), MB_CASE_UPPER, "UTF-8"),
            'trabajadornombres'             => mb_convert_case(($b->trabajador->usuario->nombres), MB_CASE_UPPER, "UTF-8"),
            'trabajadorapellidos'           => mb_convert_case(($b->trabajador->usuario->apellidos), MB_CASE_UPPER, "UTF-8"),
            'trabajadorcorreo'              => $b->trabajador->usuario->correo,
            'trabajadortelefono'            => $b->trabajador->usuario->telefono,
            'trabajadortelefonowhatsapp'    => $b->trabajador->usuario->telefono_whatsapp,
            'tipobaja_id'                   => $b->id,
            'tipobajanombre'                => $b->tipobajanombre,
            'penalizacion_dias'             => $b->penalizacion_dias,
            'baja_id'                       => $b->baja_id,
            'bajanombre'                    => $b->baja->tipoBaja->nombre,
            'fecha_inicio_sancion'          => $b->fecha_inicio_sancion,
            'fecha_fin_sancion'             => $b->fecha_fin_sancion,
            'fecha_inicio_sancion_format'   => $b->fecha_inicio_sancion,
            'fecha_fin_sancion_format'      => $b->fecha_fin_sancion,
            'culminado'                     => $b->culminado,
            'creado_format'                 => $b->creado,
            'creado'                        => $b->creado,
            'actualizado'                   => $b->actualizado,
            'pagado'                        => boolval($b->pagado),
            'monto_pagado'                  => $b->monto_pagado,
            'fecha_pago_monto'              => $b->fecha_pago_monto
        ];
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

function restringirInformacion($texto){

    $palabras = explode(' ', $texto);

    if($palabras){

        $result = [];

        foreach ($palabras as $p){

            $numcaracteres = strlen($p);

            if($numcaracteres){
                $result[] = substr($p, 0, 1).str_repeat('*', $numcaracteres - 2).substr($p, $numcaracteres - 1, 1);
            }
        }

        return implode(' ', $result);
    }

    return '';
}

function restringirTexto($texto){

    $numcaracteres = strlen($texto);

    if($numcaracteres > 1 AND $numcaracteres < 50){
        return substr($texto, 0, 1).str_repeat('*', $numcaracteres - 2).substr($texto, $numcaracteres - 1, 1);
    }else if($numcaracteres > 50){
        return substr($texto, 0, 1). '***************'.substr($texto, $numcaracteres - 1, 1);
    }else{
        return '';
    }
}

function formatInternationalNumber($numero){
    $result = null;

    if ($numero){
        if (substr($numero, 0, 2) == '51' AND strlen($numero) == 11){
            $result = substr($numero, 0,2) . ' ' .  substr($numero, 2,3) . ' ' .  substr($numero, 5,3) . ' ' .  substr($numero, 8,3);
        }else if(substr($numero, 0, 1) == '9' AND strlen($numero) == 9){
            $result = substr($numero, 0,3) . ' ' .  substr($numero, 3,3) . ' ' .  substr($numero, 6,3);
        }else{
            $result = $numero;
        }
    }

    return $result;
}

function isNewTerms1711($date){
    $fechaNuevosTerminos1711 = new \DateTime('17-11-2021');
    $formatCreado = new \DateTime(str_replace("/","-",$date));

    if ($formatCreado > $fechaNuevosTerminos1711){
        $result = true;
    }else{
        $result = false;
    }

    return $result;
}

function verificacionDocumentosPostulante($data){

    return [
        'documentoidentidad'     => !empty($data->foto_documento_delantera),
        'certiadulto'            => !empty($data->certificado_antecedente),
        'reportepsicologico'     => true,
        'actacompromiso'         => !empty($data->firma),
        'declaracioncovid19'     => !empty($data->firma),
        'cartillavacuna'         => filled($data->adjunto_cartilla_vacuna) && count(json_decode($data->adjunto_cartilla_vacuna, true)) >= 1,
        'declaracionjurada'      => !empty($data->firma) && !empty($data->departamento_id) && !empty($data->provincia_id) && !empty($data->distrito_id) && !empty($data->direccion),
        'reciboservicio'         => filled($data->recibos) && !empty(json_decode($data->recibos, true)),
        'recomendaciones'        => filled($data->verificaciones_laborales) && !empty(json_decode($data->verificaciones_laborales, true)),
        'verificaciones_laborales' => filled($data->verificaciones_laborales)  && !empty(json_decode($data->verificaciones_laborales, true)),
        'certificados'           => filled($data->adjunto_educacion) && !empty(json_decode($data->adjunto_educacion, true)),
    ];

}

function getAge($fechanacimiento){
    if($fechanacimiento){
        return \Carbon\Carbon::parse($fechanacimiento)->age;
    }else{
        return 0;
    }
}

function verifyFechaRegistro($fecha){

    $fechaCondicional = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', '2020-07-03 00:00:00');

    if (Carbon::parse($fecha)->greaterThan($fechaCondicional)){
        return "1 mes";
    }else{
        return "2 meses";
    }

}

function isFechaVigente($inicio, $fin){

    $fechaActual = \Carbon\Carbon::parse(Carbon::now()->format('Y-m-d'));
    $fechainicio = \Carbon\Carbon::parse($inicio);
    $fechafin = \Carbon\Carbon::parse($fin);

    if($fechainicio AND $fechafin){
        $vigente = $fechaActual->isBetween($fechainicio, $fechafin);
    }else{
        $vigente = false;
    }

    return $vigente;
}

function findUsuario($id){
    $empleador = \App\Models\Empleador::find($id);

    return $empleador[0]['usuario_id'];
}

function findDistrito($id){
    $distrito = \App\Models\Views\DistritoView::find($id);

    return $distrito;
}

function convertEdadToCheckbox($data){

    $defaultCheck = [
        [ 'id' => 1, 'value' => 'De 18 a 30 años', 'isChecked' => false, 'disabled' => false],
        [ 'id' => 2, 'value' => 'De 31 a 45 años', 'isChecked' => false, 'disabled' => false],
        [ 'id' => 3, 'value' => 'De 46 a más', 'isChecked' => false, 'disabled' => false],
        [ 'id' => 4, 'value' => 'Todas las edades', 'isChecked' => false, 'disabled' => false]
    ];

    if($data){

        foreach (json_decode($data, true) as $d){

            if(in_array($d, [1,2,3])){
                $defaultCheck[ ($d - 1)]['isChecked'] = true;
            }else{

                for($i = 0; $i < 3 ; $i++){
                    $defaultCheck[$i]['isChecked'] = false;
                    $defaultCheck[$i]['disabled'] = true;
                }

                $defaultCheck[3]['isChecked'] = true;

            }

        }

    }

    return $defaultCheck;

}

function validateNewContrato($req, $paispedido, $contratosGroup, $tiposcontratosAll){

    $contratos = Contrato::borrado(false)->activo(true)->orderBy('creado', 'desc')->where('requerimiento_id', $req->id)->first();

    if($contratos){

        if(isFechaVigente($req->fecha_inicio_garantia, $req->fecha_fin_garantia) AND $req->fecha_inicio_garantia AND $req->fecha_fin_garantia){

            if(isCambioAplicable($contratos)){
                $tipocontratodefault = 3;
                $comisionDefault = 0;
            }else{
                $tipocontratodefault = 2;
                $comisionDefault = 3;
            }

            $garantiaInicioCantidad = $req->garantia;
            if ($paispedido == 54){
                $tiposcontratos = TipoContrato::borrado(false)->whereIn('id', [2,3])->orderBy('nombre', 'asc')->get();
            }else{
                $tiposcontratos = TipoContrato::borrado(false)->whereIn('id', [2])->orderBy('nombre', 'asc')->get();
            }

            $domicilio = $contratos->domicilio_id;
            $fechainiciogarantia = $req->fecha_inicio_garantia;
            $fechafingarantia = $req->fecha_fin_garantia;
            $observaciones = $contratos->observaciones;
            $tipocomision = ($tipocontratodefault == 3 || $tipocontratodefault == 2) ? $comisionDefault : ($contratos->tipocomision_id == 1 ? 2 : $contratos->tipocomision_id);
            $garantia = $contratos->garantia;

        }else{
            $tipocontratodefault = 1;
            $garantiaInicioCantidad = 0;
            $tiposcontratos = TipoContrato::borrado(false)->whereIn('id', [1])->get();
            $domicilio = '';
            $fechainiciogarantia = '';
            $fechafingarantia = '';
            $observaciones = $contratos->observaciones;
            $tipocomision = 2;
            $garantia = 3;
        }

    }else{

        $tipocontratodefault = 1;
        $garantiaInicioCantidad = 0;
        $tiposcontratos = TipoContrato::borrado(false)->whereIn('id', [1])->get();
        $domicilio = '';
        $fechainiciogarantia = '';
        $fechafingarantia = '';
        $observaciones = '';
        $tipocomision = 2;
        $garantia = 3;
    }

    return [
        'tipocontratodefault' => $tipocontratodefault,
        'garantiainiciocantidad' => $garantiaInicioCantidad,
        'tiposcontratos' => $tiposcontratos,
        'tipocontratonombre' => TipoContrato::find($tipocontratodefault)->nombre,
        'domicilio' => $domicilio,
        'fechainiciogarantia' => $fechainiciogarantia,
        'fechafingarantia' => $fechafingarantia,
        'observaciones' => $observaciones,
        'tipocomision' => $tipocomision,
        'garantia' => $garantia
    ];
}


function mesesEnLetra($mes)
{
    $map = [
        1  => "1 (uno)",
        2  => "2 (dos)",
        3  => "3 (tres)",
        4  => "4 (cuatro)",
        5  => "5 (cinco)",
        6  => "6 (seis)",
        7  => "7 (siete)",
        8  => "8 (ocho)",
        9  => "9 (nueve)",
        10 => "10 (diez)",
        11 => "11 (once)",
        12 => "12 (doce)",
    ];

    return $map[$mes] ?? null;
}

function codificacionContrato($idcontrato){

    $contrato = \App\Models\Contrato::find($idcontrato);
    $emp = \App\Models\Views\EmpleadorView::find($contrato->empleador_id);
    $req = \App\Models\Requerimiento::find($contrato->requerimiento_id);
    $tc = $contrato->tipocontrato_id;
    $letraTipoContrato = '';

    if($tc == 1){
        $letraTipoContrato = 'A';
    }else if($tc == 2){
        $letraTipoContrato = 'R';
    }else if($tc == 3){
        $letraTipoContrato = 'C';
    }

    return ($emp->numero_documento ? $emp->numero_documento : 'Z'). $contrato->numero_contrato . $letraTipoContrato . $req->numero_requerimiento;

}

function getHistorialContrato($requerimiento){

    $result = [];
    $data = [];

    if($requerimiento){

        $contratos = \App\Models\Views\ContratoView::where('requerimientoid', $requerimiento)->orderBy('creadooriginal', 'desc')->get();

        if($contratos){
            foreach ($contratos as $c) {
                $data[] = [
                    'id'                    => $c->id,
                    'fecha'                 => $c->fecha,
                    'trabajadorid'          => $c->trabajadorid,
                    'trabajador'            => $c->trabajador,
                    'trabajadortelefono'    => $c->trabajadortelefono,
                    'tipocontrato'          => $c->tipocontrato,
                    'codigo_iso_divisa'     => $c->codigo_iso_divisa,
                    'sueldo'                => numberToCommas($c->sueldo)
                ];
            }
            $result = (json_encode($data));

        }
    }

    return $result;
}

function getUltimoComprobante($contrato){

    $result = null;

    if ($contrato){

        $comprobante = \App\Models\Comprobante::where('mediofacturacion', $contrato->id)->where('tipomediofacturacion_id', 1)->where('estatuscomprobante_id', 1)->orderBy('creado', 'desc')->first();

        if($comprobante){
            $result = $comprobante->id;
        }else if ($contrato->pdf_comprobante_ext){
            $result = $contrato->pdf_comprobante_ext;
        }
    }

    return $result;

}
