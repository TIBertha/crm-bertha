<?php

use App\Models\DiaSemana;
use Carbon\Carbon;

function getCopyDetalles($d, $tipo = null, $actExt = null, $actidExt = null, $modExt = null, $modidExt = null, $sueldoExt = null, $sueldoPdExt = null, $camesFromCont = false, $newTerms = false, $showFechaEntrevista = false, $detallesEmpleador = false){

    $empleador = '';
    $modalidad = '';
    $actividad = '';
    $sueldoPD = '';
    $sueldo = '';
    $sueldo1ermes = '';
    $sueldoenadelante = '';
    $tipovivienda = '';
    $numpisos = '';
    $distrito = '';
    $numadultos = '';
    $numninos = '';
    $edadninos = '';
    $detalleNinos= '';
    $nummascotas = '';
    $tipodescanso = '';
    $numpacientes = '';
    $edadpacientes = '';
    $diagnostico = '';
    $diasalida = '';
    $horasalida = '';
    $diaretorno = '';
    $horaretorno = '';
    $tipobeneficio = '';
    $referenciadomicilio = '';
    $domicilio = '';
    $nacionalidad = '';
    $requisitos = '' ;
    $inicioLabores = '';
    $ganancia = '';
    $entrevista = '';
    $observacionesWeb = '';
    $mapa = '';

    if ($d->observaciones_web and $detallesEmpleador == false){
        $observacionesWeb = 'Observaciones: ' . $d->observaciones_web . "\r\n" ;;
    }

    $tipoBeneficiosLey = '';

    if ($showFechaEntrevista == true ){
        $fecha = '';
        $hora= '';

        if ($d->fechaentrevista){
            $f = formatFecha($d->fechaentrevista);
            $fecha = ( mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . $f['nombreMes'] . ' del ' . $f['numeroAnio'] );
        }

        if ($d->horaentrevista){
            $hora = Carbon::parse($d->horaentrevista)->format('h:i A');
        }

        if ($detallesEmpleador == true){
            //$d->tipocomision == 3
            if ($d->paispedido_id == 54){
                if ($d->tipocomision == 3){
                    $stringFecha = 'Fecha de envío de currículos (no reagendable): ';
                }else{
                    $stringFecha = 'Envío de CV y entrevista por videollamada (no reagendable): ';
                }
            }else{
                $stringFecha = 'Fecha de envío de currículos (no reagendable): ';
            }
        }else{
            if ($d->paispedido_id == 54){
                if ($d->tipocomision == 3){
                    $stringFecha = 'Fecha de envío de currículos (*no hay entrevista*): ';
                }else{
                    $stringFecha = 'Entrevista por videollamada (*no reagendable*): ';
                }
            }else{
                $stringFecha = 'Fecha límite de postulación ('. ($d->tipocomision == 3 ? '*no hay entrevista*' : 'no reagendable') .'): ';
            }
        }

        if ($d->fechaentrevista && $d->horaentrevista){
            $entrevista = $stringFecha . $fecha . ' - ' . $hora . "\r\n" ;
        }else{
            if ($d->fechaentrevista){
                $entrevista = $stringFecha  . $fecha . "\r\n" ;
            }else if ($d->horaentrevista){
                $entrevista = 'Hora de entrevista: ' . $hora . "\r\n" ;
            }
        }
    }

    if ($d->fecha_inicio_labores){
        $f = formatFecha(Carbon::parse($d->fecha_inicio_labores));
        $date = (mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . mb_convert_case($f['nombreMes'], MB_CASE_TITLE, "UTF-8") . ' del ' . $f['numeroAnio']);
        $inicioLabores = 'Inicio de labores: ' . $date . "\r\n" ;
    }

    if ($actidExt){
        $act = $actidExt;
    }else{
        $act = $d->actividadid;
    }

    if ($modidExt){
        $mod = $modidExt;
    }else{
        $mod = $d->modalidadid;
    }

    $ben = ($d->tipobeneficio_id) ? mb_convert_case( $d->tipobeneficio_valor , MB_CASE_LOWER, "UTF-8") :  '';

    if ($mod == 3){
        if ($sueldoExt){
            $sf = $sueldoExt;
        }else{
            $sf = (($d->valor_dia_frecuencia) * $d->frecuenciaservicio_id * 4);
        }
    }else{
        if ($sueldoExt){
            $sf = $sueldoExt;
        }else{
            $sf = $d->sueldo;
        }

    }

    if ($d->tipobeneficio_id == '1'){
        $ben = $sf/2;
    }else if ($d->tipobeneficio_id == '2'){
        $ben = $sf;
    }else if ($d->tipobeneficio_id == '3'){
        $ben = 930;
    }

    if ($detallesEmpleador == true){

        $tb = 'Beneficios laborales: Antigua ley' . "\r\n" ;

        if ($d->tipobeneficio_id == '1'){
            $tb = 'Beneficios laborales: Antigua ley' . "\r\n" ;
        }else if ($d->tipobeneficio_id == '2'){
            $tb = 'Beneficios laborales: Nueva ley' . "\r\n" ;
        }else if ($d->tipobeneficio_id == '3'){
            $tb = 'Beneficios laborales: Antigua ley' . "\r\n" ;
        }else if ($d->tipobeneficio_id == '4'){
            $tb = 'Beneficios laborales: No aplica (No gratificaciones, No CTS, No vacaciones)' . "\r\n" ;
        }

        if($d->estatusrequerimientoid == 4){
            $nacionalidad = '*Postulante peruana/extranjera/ambas*:' . "\r\n" ;

            if ($d->paispedido_id == 54){
                if($d->tipobeneficio_id){
                    $tipobeneficio = $tb;
                }else{
                    $tipobeneficio = 'Beneficios laborales: Nueva ley' . "\r\n" ;
                }
            }

        }else{

            if ( $d->nacionalidadid ){
                $nacionalidad = 'Nacionalidad: ' . $d->nacionalidad . "\r\n" ;
            }else{
                $nacionalidad = '*Postulante peruana/extranjera/ambas*:' . "\r\n" ;
            }

            if ($d->paispedido_id == 54){
                if($d->tipobeneficio_id){
                    $tipobeneficio = $tb;
                }
            }
        }

        if ($d->domicilioid){
            $mapa = 'Mapa: ' . getEncondedLink($d->domicilioid, 'empleador/ver-direccion') . ' (Dar clic)' . "\r\n" ;
            $domicilio = 'Dirección: ' . $d->domicilio . "\r\n" ;
        }else{
            if ($d->input_domicilio){
                $domicilio = 'Dirección: ' . $d->input_domicilio . "\r\n" ;
            }else{
                $domicilio = '*Dirección exacta (no lo compartiremos):*' . "\r\n" ;
            }
        }

    }else{

      if ($d->nacionalidadid) {
        $nacionalidad = 'Nacionalidad: ' . ($d->nacionalidadid == 3 ? 'PERUANA O EXTRANJERA' : $d->nacionalidad) . "\r\n" ;
      }

      if ($d->paispedido_id == 54){
          if ($d->tipobeneficio_id){
              if($d->tipobeneficio_id != '4'){
                  $tipobeneficio = 'Beneficios laborales: ' . ($ben) . ' de gratificación de fiestas patrias, ' . $ben . ' de gratificación de navidad, ' . $ben . ' de CTS y ' . ($d->tipobeneficio_id == '1' ? '15' : '30') . ' días de vacaciones.' . "\r\n" ;
                  $ganancia = 'Ganarás: S/. ' . ( $d->tipobeneficio_id == '1'  ? (4 * $ben) : ($sf + (3 * $ben)) ) . ' en  beneficios laborales.' . "\r\n" ;

              }else{
                  $tipobeneficio = 'Beneficios laborales: No aplica' . "\r\n" ;
              }
          }
      }



      if ($d->latitud_domicilio && $d->longitud_domicilio){
          $mapa = 'Mapa: ' . getEncondedLink($d->domicilioid, 'ver-domicilio') . "\r\n" ;
      }

      $requisitos = 'Requisitos: Tener internet.' . (($detallesEmpleador == false && $d->modalidadid == 3) ? ' Si aceptas el trabajo, te daremos más días para que tengas mayores ingresos.': '') . "\r\n" . '*Importante*: *Si postulas y no asistes* a tu primer día de labores, no podrás postular a más empleos. *Si eres responsable y asistes a tu trabajo*, puedes probar el trato de tu empleador. Si no estás cómoda y deseas renunciar, haremos que te paguen tus días trabajados y te buscaremos otro empleo, pero *debes durar mínimo 1 mes*.' . "\r\n" ;
    }

    $divisa = ($d->paispedido_id == 54 ? 'S/' : $d->codigo_iso_divisa_paispedido);

    if ($sueldoExt){
        $sueldo = ( $mod == 3 ? ('Sueldo por mes (' .  $d->frecuenciaservicio_id . ' veces por 4 semanas = ' . ($d->frecuenciaservicio_id * 4) . ' días): ') : 'Sueldo: ') . ( $mod == 3 ? $sueldoPdExt : $sueldoExt ) . "\r\n" ;

        $mount = 0;

        if ($d->paispedido_id == 54){
            $mount = ( $sueldoExt == 1350 ? 1000 : ( intval($sueldoExt) * 0.7 ));
        }else if ($d->paispedido_id == 11){
            $mount = $sueldoExt - 100000;
        }else if ($d->paispedido_id == 49){
            $mount = $sueldoExt - 2000;
        }

        $sueldo1ermes = 'Sueldo 1er mes: ' . $divisa . ' ' . numberToCommas($mount) . "\r\n" ;

        if ($mod == 3){

            $sueldoenadelante = 'Sueldo 2do mes y en adelante: ' . $divisa . ' ' . numberToCommas($sueldoExt) . "\r\n" ;


        }else{
            $sueldoenadelante = 'Sueldo 2do mes y en adelante: ' . $divisa . ' ' . numberToCommas($sueldoExt) . ' + ' . ($d->tipobeneficio_id == '1' ? 'Medio sueldo' : $ben) . ' de gratificación de fiestas patrias, ' . $divisa . ' ' . numberToCommas($ben) . ' de gratificación de navidad, ' . $divisa . ' ' . numberToCommas($ben) . ' de CTS y ' . ($d->tipobeneficio_id == '1' ? '15' : '30') . ' días de vacaciones' . "\r\n" ;
        }
    }else{
        if ($d->sueldo){
            $sueldo = ( $mod == 3 ? ('Sueldo por mes (' .  $d->frecuenciaservicio_id . ' veces por 4 semanas = ' . ($d->frecuenciaservicio_id * 4) . ' días): ') : 'Sueldo: ') . $divisa . ' ' . ( $mod == 3 ? numberToCommas($d->sueldo_por_dias) : numberToCommas($d->sueldo) ) . "\r\n" ;

            if ($mod == 3){

                $m = 0;

                if ($d->paispedido_id == 54){
                    $m = $d->valor_dia_frecuencia - 20;
                }else if ($d->paispedido_id == 11){
                    $m = 22500;
                }else if ($d->paispedido_id == 49){
                    $m = $d->valor_dia_frecuencia - 400;
                }

                $s1m = (($m) * ($d->frecuenciaservicio_id * 4));
                $s2m = ($d->valor_dia_frecuencia * $d->frecuenciaservicio_id * 4);

                $sueldo1ermes = 'Sueldo 1er mes: ' . $divisa . ' ' . numberToCommas($s1m) . getText1($m, $d->frecuenciaservicio_id, $divisa, $camesFromCont) . ($detallesEmpleador == true ? ' (Ahorra ' . $divisa . ' ' . numberToCommas($s2m - $s1m) . ')'  : null) . "\r\n" ;
                $sueldoenadelante = 'Sueldo 2do mes y en adelante: ' . $divisa . ' ' . numberToCommas($s2m) . getText1($d->valor_dia_frecuencia, $d->frecuenciaservicio_id, $divisa, $camesFromCont) . "\r\n" ;

            }else{

                $nuevosueldo = ($d->sueldo >= 1400) ? ($d->sueldo - 400) : 930;

                $mount = 0;

                if ($d->paispedido_id == 54){
                    $mount = ($d->sueldo == 1350 ? 1000 : (intval($nuevosueldo)));
                }else if ($d->paispedido_id == 11){
                    $mount = $d->sueldo - 100000;
                }else if ($d->paispedido_id == 49){
                    $mount = $d->sueldo - 2000;
                }

                $sueldo1ermes = 'Sueldo 1er mes: ' . $divisa . ' ' . numberToCommas($mount) . ($detallesEmpleador == true ? ' (Ahorra ' . $divisa . ' ' . numberToCommas($d->sueldo - $mount) . ')' : null) . "\r\n" ;

                $sueldoenadelante = 'Sueldo 2do mes y en adelante: ' . $divisa . ' ' . numberToCommas($d->sueldo) . "\r\n" ;

            }
        }
    }

    if ($d->valor_dia_frecuencia){
        $sueldoPD = 'Sueldo por día: ' . $divisa . ' ' .  numberToCommas($d->valor_dia_frecuencia) . "\r\n" ;
    }

    $arregoRangoEdad = extractRangoEdad($d->rangoedadid);

    if ($d->paispedido_id == 11){
        $disTitle = 'Comuna';
    }else{
        $disTitle = 'Distrito';
    }

    if ($showFechaEntrevista == true && !($d->distrito_domicilio) && !($d->distrito)){
        $distrito = '*' . $disTitle . ':*' . "\r\n" ;
    }else{

        $ll = null;

        if ($d->distrito_domicilioid){
            $ll = $d->distrito_domicilioid;
        }else{
            if ($d->distritoid){
                $ll = $d->distritoid;
            }
        }

        $lll = \App\Models\Views\DistritoView::find($ll);

        $distrito = '' . $disTitle . ': ' . $lll->distritostres . "\r\n" ;
    }

    if ($d->referencia){
        $referenciadomicilio = 'Referencia: ' . $d->referencia . "\r\n" ;
    }

    if ($d->empleadornombres){
        $empleador = 'Empleador: ' . getPrimerNombre($d->empleadornombres) . "\r\n" ;
    }

    if ($actExt){
        $actividad = 'Actividad: ' . $actExt . ' ' . $d->descripcion . "\r\n" ;
    }else{
        if ($d->actividad){
            $actividad = 'Actividad: ' . $d->actividad . ' ' . $d->descripcion . "\r\n" ;
        }
    }

    if ($modExt){
        $modalidad = 'Modalidad: ' . $modExt . "\r\n";
    }else{
        if ($d->modalidad) {
            $modalidad = 'Modalidad: ' . $d->modalidad . "\r\n";
        }
    }

    if ($d->rangoedadid){
        $rangoedad = 'Rango de edad: De ' . $arregoRangoEdad['min'] . ' a ' . $arregoRangoEdad['max'] . ' años' . "\r\n" ;
    }

    if($act == 1){
        $nummascotas = ($d->num_mascotas != null  ? ('Cantidad de mascotas: ' . $d->num_mascotas . "\r\n") : ($detallesEmpleador == true ? ('*Cantidad de mascotas:*' . "\r\n") : ''));
    }

    if (in_array($act, [1,2,4,5,6,7,8,9])){
        if ($d->num_ninos != null){
            $numninos = ('Cantidad de niños: ' . $d->num_ninos . "\r\n");
            if ($detallesEmpleador == true){
                $detalleNinos = ($d->num_ninos > 0 && $d->edad_nino) ? ('*Por seguridad del niño, se sugiere que si la trabajadora le cuida o vigila, no haga otras labores en simultáneo' . "\r\n") : '';
            }
        }else{
            $numninos = ($detallesEmpleador == true ? ('*Cantidad de niños:*' . "\r\n") : '');
        }

        if (in_array($act, [1,2,4,5,6,7,9])){
            $edadninos = (($d->num_ninos > 0 && $d->edad_nino) ? ('Edad niño(s): '  . getListaEdades($d->edad_nino) . "\r\n") : ( ($detallesEmpleador == true && $d->num_ninos > 0) ? ('*Edad niño(s):*' . "\r\n") : ''));

            if (in_array($act, [1,4,5,9])){
                $tipovivienda = ($d->tipovivienda ? ('Tipo de vivienda: ' . $d->tipovivienda . "\r\n") : ($detallesEmpleador == true ? ('*Departamento / Casa:*' . "\r\n") : ''));
                $numpisos = ($d->num_pisos ? ('Pisos: ' . $d->num_pisos . "\r\n") : ($detallesEmpleador == true ? ('*Pisos de la vivienda:*' . "\r\n") : ''));
            }
        }
    }

    if (in_array($act, [1,2,3,5,8,9,10])){
        $numpacientes = ($d->num_adultos ? ('Cantidad de adultos: ' . $d->num_adultos . "\r\n") : ($detallesEmpleador == true ? ('*Cantidad de adultos:*' . "\r\n") : ''));

        if (in_array($act, [3,10])){
            $diagnostico = ($d->diagnostico ? ('Diagnóstico: ' . $d->diagnostico . "\r\n") : ($detallesEmpleador == true ? ('*Diagnóstico:*' . "\r\n") : ''));
            $edadpacientes = ($d->edad_adulto ? (($d->actividadid == 3 ? 'Edad de paciente: ' : 'Edad adulto(s): ') . getListaEdades($d->edad_adulto) . "\r\n" ) : (($detallesEmpleador == true ? (($d->actividadid == 3 ? '*Edad de paciente:*' : '*Edad adulto(s):*') . "\r\n" ) : '')));
        }
    }

    $horarios = '';

    if($d->horarios){

        $horarios .= 'Horario: ' . "\r\n" ;

        foreach (json_decode($d->horarios, true) as $h){

            if(in_array($mod, [1,2, 5])){

                if ($detallesEmpleador == true){
                    $horarios .=  (!($h['isDescanso']) ? ( ($h['dia']). ': '  . ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') . "\r\n" ) ) : '')  ;
                }else{
                    $horarios .= ($h['dia']). ': '  . ($h['isDescanso'] ? ' Descanso' : ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') ) ) . "\r\n" ;
                }

            }else if($mod == 3){

                if(!$h['isDescanso']){
                    $horarios .= ($h['dia']). ': '  . ($h['isDescanso'] ? ' Descanso' : ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') ) ) . "\r\n" ;
                }

            }

        }

    }

    $NoHayBeneficios = 'Beneficios laborales: No aplica (No gratificaciones, No CTS, No vacaciones)' . "\r\n" ;

    $question = $camesFromCont == true ? null : ($detallesEmpleador == false ? ('*¿Postulas?*' . "\r\n") : '');

    $periodoPago = 'Período de pago: Quincenal (fracción correspondiente)' . "\r\n" ;

    if ($mod == 1/*Cama Adentro*/){

        /*if ($d->tiempo_cuarentena){
            $tipodescanso = 'Tipo Descanso: ' . \App\Models\TipoDescanso::find($d->tiempo_cuarentena)->nombre . "\r\n" ;
        }*/

        if ($d->dia_salida){
            $diasalida = 'Día de salida: ' . DiaSemana::find($d->dia_salida)->nombre . "\r\n" ;
        }

        if ($d->hora_salida){
            $horasalida = 'Hora de salida: ' . Carbon::parse($d->hora_salida)->format('h:i A') . "\r\n" ;
        }

        if ($d->dia_ingreso){
            $diaretorno = 'Día de retorno: ' . DiaSemana::find($d->dia_ingreso)->nombre . "\r\n" ;
        }

        if ($d->hora_ingreso){
            $horaretorno = 'Hora de retorno: ' . Carbon::parse($d->hora_ingreso)->format('h:i A') . "\r\n" ;
        }

        return $question . ($tipo ? '' : ($camesFromCont == true ? null : $empleador) . $modalidad . $actividad) . $nacionalidad . $tipovivienda . $numpisos . $numpacientes .
            $edadpacientes . $diagnostico . $numadultos . $numninos . $edadninos . $detalleNinos .  $nummascotas . $tipodescanso .
            ($d->tiempo_cuarentena == 7 ? null : ($diasalida . $horasalida . $diaretorno . $horaretorno)) . ( $sueldo1ermes . $sueldoenadelante . $periodoPago ) . ($detallesEmpleador == true ? ($d->estatusrequerimientoid != 1 ? $tipoBeneficiosLey : '') : '') . ($d->estatusrequerimientoid == 1 ? $tipoBeneficiosLey : '') . $tipobeneficio . $ganancia .
            ($camesFromCont == true ? null : ($distrito . $domicilio . $referenciadomicilio . $mapa . $requisitos . $entrevista . $inicioLabores)) . $observacionesWeb;

    }else if (in_array($mod, [2,5])/*Cama Afuera*/){

        return $question . ($tipo ? '' : ($camesFromCont == true ? null : $empleador) . $modalidad . $actividad) . $nacionalidad . $tipovivienda . $numpisos . $numpacientes .
            $edadpacientes . $diagnostico . $numadultos . $numninos . $edadninos . $detalleNinos . $nummascotas . $horarios . ( $newTerms == true ? ( $sueldo1ermes . $sueldoenadelante . $periodoPago ) : $sueldo) . ($detallesEmpleador == true ? ($d->estatusrequerimientoid != 1 ? $tipoBeneficiosLey : '') : '' ) . ($d->estatusrequerimientoid == 1 ? $tipoBeneficiosLey : '') . $tipobeneficio . $ganancia .
            ($camesFromCont == true ? null : ($distrito . $domicilio . $referenciadomicilio . $mapa . $requisitos . $entrevista . $inicioLabores)) . $observacionesWeb;

    }else if($mod == 3/*Por Dias*/){

        $frecuencia = 'Frecuencia: ' . ($d->frecuenciaservicio ? $d->frecuenciaservicio : ' - ') . "\r\n" ;

        return $question . ($tipo ? '' : ($camesFromCont == true ? null : $empleador) . $modalidad . $actividad) . $nacionalidad . $tipovivienda . $numpisos . $numpacientes .
            $edadpacientes . $diagnostico . $numadultos . $numninos . $edadninos . $detalleNinos . $nummascotas . $frecuencia . $horarios . $sueldoPD . ( $sueldo1ermes . $sueldoenadelante . $periodoPago ) . (($d->paispedido_id == 54) ? ($detallesEmpleador == true ? $NoHayBeneficios : '' ) : null) . ($detallesEmpleador == false ? $tipobeneficio : '') . $ganancia .
            ($camesFromCont == true ? null : ($distrito . $domicilio . $referenciadomicilio . $mapa . $requisitos . $entrevista .  $inicioLabores)) . $observacionesWeb;

    }else if($mod == 4/*24X24*/){

        return $question . ($tipo ? '' : ($camesFromCont == true ? null : $empleador) . $modalidad . $actividad) . $nacionalidad . $tipovivienda . $numpisos . $numpacientes . $edadpacientes .
            $diagnostico . $numadultos . $numninos . $edadninos . $detalleNinos . $nummascotas .  ( $sueldo1ermes . $sueldoenadelante . $periodoPago ) . (($d->paispedido_id == 54) ? ($detallesEmpleador == true ? $NoHayBeneficios : '' ) : null) . $ganancia . ($detallesEmpleador == false ? $tipobeneficio : '') .
            ($camesFromCont == true ? null : ($distrito . $domicilio . $referenciadomicilio . $mapa . $requisitos . $entrevista . $inicioLabores)) . $observacionesWeb;

    }

}