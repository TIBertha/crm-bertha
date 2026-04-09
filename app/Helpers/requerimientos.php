<?php

use App\Models\Comprobante;
use App\Models\DiaSemana;
use App\Models\Pais;
use App\Models\TipoDescanso;
use App\Models\Requerimiento;
use App\Models\Contrato;
use App\Models\TipoContrato;
use App\Models\Trabajador;
use App\Models\RequerimientoPostulacion;
use App\Models\Domicilio;
use App\Models\Views\EmpleadorView;
use App\Models\Views\DistritoView;
use App\Models\Views\RequerimientoPostulacionView;
use App\Models\Views\RequerimientoView;
use App\Models\Views\TrabajadorView;
use Carbon\Carbon;

function getCopyDetallesCrearContrato($d, $tipo = null){
    $domicilioReferencia = '';
    $domicilioMapa = '';
    $domicilioDistrito = '';

    $empleadorData = EmpleadorView::find($d->empleadorid);
    $empleadorNombres = '';
    $empleadorDocumento = '';
    $empleadorFechaNacimiento = '';
    $empleadorLugarNacimiento = '';
    $empleadorEstadoCivil = '';
    //$empleadorCorreo = '';

    $comprobante = '';

    $requerimientoDomicilio = '';

    $fecha = '';

    if ($d->fecha_inicio_labores){
        $f = formatFecha($d->fecha_inicio_labores);
        $fecha = (mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . mb_convert_case($f['nombreMes'], MB_CASE_TITLE, "UTF-8") . ' del ' . $f['numeroAnio'] );
    }

    $inicioLabores = ($d->fecha_inicio_labores ? 'Inicio de labores: ' : '*Inicio de labores:* ') . $fecha . "\r\n" ;


    if ($empleadorData){
        $empleadorNombres = 'Nombres y apellidos: ' . $d->empleadornombres . ' ' . $d->empleadorapellidos . "\r\n" ;
        $varDoc = ($empleadorData->tipodocumento ? ($empleadorData->tipodocumento) : '*DNI*' ) . ': ' . ($empleadorData->numero_documento ? $empleadorData->numero_documento : '') . "\r\n" ;
        $empleadorDocumento = (($empleadorData->numero_documento) ? ($varDoc) : ('*Número de DNI:* ' . "\r\n" ));
        $empleadorFechaNacimiento = ($empleadorData->fecha_nacimiento ? 'Fecha de nacimiento: ' : '*Fecha de nacimiento:* ') . ($empleadorData->fecha_nacimiento ? date("d/m/Y", strtotime($empleadorData->fecha_nacimiento)) : '') . "\r\n" ;
        $requerimientoDomicilio = ($d->domicilio ? 'Domicilio: ' : '*Domicilio:* ') . ($d->domicilio ? $d->domicilio : '') . (($d->distrito_domicilio && $d->domicilio) ? ' ' . $d->distrito_domicilio : '') . "\r\n" ;
        $empleadorLugarNacimiento = ($empleadorData->paisnacimiento_id ? 'Lugar de nacimiento: ' : '*Lugar de nacimiento:* ') . ($empleadorData->paisnacimiento_id ? ($empleadorData->paisnacimiento_id == 54 ? ($empleadorData->departamentonacimiento ? $empleadorData->departamentonacimiento : '') : ($empleadorData->lugar_nacimiento ? $empleadorData->lugar_nacimiento : '') ) : '' ) . "\r\n" ;
        $empleadorEstadoCivil = ($empleadorData->estadocivil ? 'Estado civil: ' : '*Estado civil:* ') . ($empleadorData->estadocivil ? $empleadorData->estadocivil : '') . "\r\n" ;
        //$empleadorCorreo = ($empleadorData->correo ? 'Correo electrónico: ' : '*Correo electrónico:* ') . ($empleadorData->correo ? $empleadorData->correo : '') . "\r\n" ;
        $comprobante = '*Boleta o factura' . ($empleadorData->rucempresa ? '(RUC: ' . $empleadorData->rucempresa .'):*' : ' (si es factura, ingresar ruc por favor):*') . "\r\n" ;
    }

    if ($d->distrito_domicilio){
        $domicilioDistrito = ($d->distrito_domicilio ? 'Distrito: ' : '*Distrito:* ') . ($d->distrito_domicilio ? $d->distrito_domicilio : '') . "\r\n" ;
    }else{
        if ($d->distrito){
            $domicilioDistrito = ($d->distrito ? 'Distrito: ' : '*Distrito:* ') . ($d->distrito ? $d->distrito : '') . "\r\n" ;
        }
    }

    if ($d->referencia){
        $domicilioReferencia = ($d->referencia ? 'Referencia: ' : '*Referencia:* ') . $d->referencia . "\r\n" ;
    }

    if ($d->domicilioid){
        $dom = Domicilio::find($d->domicilioid);
        $dist = findDistrito($dom->distrito_id);
        $viewDom = str_replace(' ', '%20',generateLinkGoogleMapCopy( $dom->direccion, $dist['distritos']));

        if ($dom->link_opcional){
            $domicilioMapa = 'Mapa: ' . $dom->link_opcional;
        }else{
            $domicilioMapa = 'Mapa: ' . str_replace(' ', '%20',generateLinkGoogleMapCopy( $dom->direccion, $dist['distritos'])) . "\r\n" ;
        }

    }

    $t1 = 'Para generar su contrato, revise y complete los datos por favor. ' . "\r\n" . "\r\n" ;

    $t2 =
        'Le enviaremos por correo, su comprobante, su contrato, la ficha y el compromiso de su trabajador(a) del hogar. Le recordamos algunos *puntos importantes*:' . "\r\n" .
        'a. Le hemos enviado el *celular* y *WhatsApp del postulante*. Ella ya recibió su celular, su dirección y un mapa. Pero *necesitará de su guía para llegar a su domicilio*.' . "\r\n" .
        'b. *Bertha no puede controlar accidentes*, enfermedades o emergencias personales de un postulante, por lo tanto *no es responsable de la ausencia o duración de una trabajadora*. Solicitamos escoger opciones (a) y (b) para disminuir el ausentismo. Si desea un *reemplazo en el futuro*, el tiempo de una nueva selección es de *mínimo 3 días* y máximo 7, de acuerdo a disponibilidad.' . "\r\n" .
        'c. No brinde *adelantos* de sueldo o *préstamos* a su trabajadora.';

    return  $t1 . $empleadorNombres . $empleadorDocumento . $comprobante . $inicioLabores;

}

function getCopyDetallesFinalizacionEntrevista($data, $tipoContrato){

    $abono = ($data->tipocomision == 3) ? $data->monto_comision : (intval($data->monto_comision) - 100);

    if ($data->modalidadid == 3){
        //$abono = 400;
        $primerSueldo = ($data->valor_dia_frecuencia - 20) * $data->frecuenciaservicio_id * 4;
        $sueldoEnAdelante = $data->valor_dia_frecuencia * $data->frecuenciaservicio_id * 4;
        $ahorro = $sueldoEnAdelante - $primerSueldo;
    }else{
        //$abono = 600;
        $sueldoEnAdelante = $data->sueldo;
        if(intval($data->sueldo) >= 1400){
            $ahorro = 400;
            $primerSueldo = intval($data->sueldo) - 400;
        }else if(intval($data->sueldo) == 1350){
            $ahorro = 350;
            $primerSueldo = 1000;
        }else{
            $ahorro = intval($data->sueldo) - 930;
            $primerSueldo = 930;
        }
    }

    $t1 = 'Hemos finalizado las entrevistas. *Solicitamos elegir una opción “a” (de mayor preferencia), “b” y “c”*. Si sucede una enfermedad, accidente o emergencia y la opción “a” no asiste a su inicio de labores, enviaremos a la opción “b” o “c” para que usted reciba apoyo.' . "\r\n"   . "\r\n" ;

    $t2 = 'Agradecemos dar respuesta en máximo 30 minutos, ya que las trabajadoras postulan a varios empleos y empresas para conseguir un empleo por necesidad. Luego de esa hora, si la trabajadora ya no se encuentra disponible, se considerará como ofrecido el servicio.' . "\r\n"   . "\r\n" ;

    $t3 = 'Para enviarle el contrato, comprobante y datos completos de postulante debe abonar S/ ' . $abono . ($data->frecuenciaservicio_id == 1 ? '.' : ('. Recuerde que usted tendrá un ahorro de S/ ' . $ahorro . ' porque al final del primer mes pagará a la postulante S/ ' . $primerSueldo . ' y el segundo mes le pagará S/ ' . $sueldoEnAdelante . '.') ) . "\r\n"   . "\r\n" ;

    $t4 = 'Le enviamos nuestra cuenta bancaria y/o interbancaria' . ($tipoContrato == 1 ? ' inmediata' : '') . ':' . "\r\n" . "\r\n";

    $t5 = 'https://holabertha.com/cuenta-bancaria *(Dar clic)*' . "\r\n" . "\r\n";

    $t6 = 'También puede usar YAPE a este número corporativo a nombre de *Empleos Residencial La Molina*: 999256807' . "\r\n" . "\r\n";

    if ($tipoContrato == 1){
        $result = $t1 . $t2 . (($data->tipocomision == 3) ? '' : $t3 . $t4 . $t5 . $t6);
    }else{
        $result = $t1 . $t2;
    }

    return $result;

}

function getDetallesCopyEmpleador($data, $terminos){

    $t1 = 'Enviamos el resumen de su requerimiento, por favor, revisar y confirmar:' . "\r\n"  . "\r\n" ;

    $copy = getCopyDetalles($data, null, null, null, null, null, null, null, false, $terminos , true, true);

    $comprobante = "\r\n";

    if ($data->comprobante_adelanto_id){
        $comprobante = 'Comprobante: ' . getEncondedLink($data->comprobante_adelanto_id, 'pdf/ver-comprobante-adelanto') . ' (Dar clic)' . "\r\n" . "\r\n" ;
    }


    $t5 = '*Solicitamos elegir una opción “a”* (de mayor preferencia) *y una opción “b”*. Si sucede una enfermedad, accidente o emergencia y la opción “a” no asiste a su inicio de labores, enviaremos a la opción “b” para que usted reciba apoyo.' . "\r\n" ;
    if($data->paispedido_id == 54){
        $t2 = 'Bertha *enviará los currículos* seleccionados *a la fecha y hora agendada*. Si escogió postulantes desde nuestra web, les presentaremos su requerimiento, *si no aceptan, buscaremos un reemplazo*.' . "\r\n"   . "\r\n" ;
        $t3 = 'Bertha selecciona trabajadoras sin antecedentes, buen carácter y experiencia. *Por ley*, *no* selecciona en base a edades, cantidad de hijos, estado civil, lugar de nacimiento o vivienda, peso, color de piel u otro.' . "\r\n"   . "\r\n" ;
        $t4 = ($data->tipocomision == 3 ? '' : 'Para *las entrevistas*, no necesita descargar aplicaciones. Bertha le enviará *un link*, *le dará clic* y podrá entrevistar a las postulantes por separado. ') . '*Luego* de enviado los currículos, agradecemos dar *respuesta en máximo 30 minutos*, ya que las trabajadoras postulan a varios empleos y empresas para conseguir un empleo por necesidad. Luego de esa hora, si la trabajadora ya no se encuentra disponible, se considerará como ofrecido el servicio.' . "\r\n"   . "\r\n" ;
    }else{
        $t2 = '*Bertha enviará los currículos* seleccionados *a la fecha y hora agendada*, usted *podrá ver fotos, videos y documentos*. Si escogió postulantes desde nuestra web, les presentaremos su requerimiento, si no aceptan, buscaremos un reemplazo.' . "\r\n"   . "\r\n" ;
        $t3 = 'Bertha selecciona trabajadoras sin antecedentes, buen carácter y experiencia. *Por ley, no* selecciona en base a edades, cantidad de hijos, estado civil, lugar de nacimiento o vivienda, peso, color de piel u otro.' . "\r\n"   . "\r\n" ;
        $t4 = '*Luego de enviados los currículos*, agradecemos *dar respuesta en máximo 30 minutos*, ya que las trabajadoras postulan a varios empleos y empresas para conseguir un empleo por necesidad. Luego de esa hora, si la trabajadora ya no se encuentra disponible, se considerará como ofrecido el servicio.' . "\r\n"   . "\r\n" ;
    }

    return $t1 . $copy . $comprobante . ($data->estatusrequerimientoid == 4 ? '' : ($t2 . $t3 . $t4 . $t5) );

}

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

        $lll = DistritoView::find($ll);

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

function getNumeroPostulacionesPrevias($idEmpleador, $idReqActual){

    $reqs = Requerimiento::where('empleador_id', $idEmpleador)->whereNotIn('id', array($idReqActual));
    $sum = 0;

    if ($reqs->count() != 0){
        foreach ($reqs->get() as $d){
            $postulaciones = RequerimientoPostulacion::where('requerimiento_id', $d->id)->where('activo', 2);
            foreach ($postulaciones->get() as $p){
                $sum+= 1;
            }
            /*if ($postulaciones->count() != 0){
                $sum+= 1;
            }*/
        }
    }

    return $sum;

}

function saveRangoBusqueda($edadminima, $edadmaxima){

    $result = [];

    if ($edadminima && $edadmaxima){

        $result[] =[
            'edadminima' => $edadminima,
            'edadmaxima' => $edadmaxima,
        ];


    }

    return json_encode($result);

}

function getPostulantesPorColocar($requerimientoid, $filtro){
    $result = [];

    $bds = getQueryPostulaciones($requerimientoid, $filtro);
    foreach ($bds->get() as $bd){
        $f = TrabajadorView::find($bd->trabajador_id);

        $d = [
            'nombres'           => mb_convert_case($f['nombres'], MB_CASE_TITLE, "UTF-8") ,
            'apellidos'         => mb_convert_case((substr($f['apellidos'],0,1) . '.'), MB_CASE_TITLE, "UTF-8"),
            'nacionalidad'      => mb_convert_case($f['nacionalidad'], MB_CASE_LOWER, "UTF-8") ,
            'distrito'          => mb_convert_case($f['distrito_direccion'], MB_CASE_TITLE, "UTF-8") ,
            'link'              => ('https://holabertha.com/ficha-postulante/'. $f['token']),
        ];

        if ($f->estadoid == 1){
            array_push($result, $d);
        }
    }

    return $result;
}

function countPostulaciones($requerimientoid){
    $result = 0;

    if ($requerimientoid){
        $result = RequerimientoPostulacion::borrado(false)->where('requerimiento_id', $requerimientoid)->where('activo', true)->count();
    }

    return $result;
}

function processDataPostulaciones($data){
    $result = [];
    if ($data){
        foreach ($data as $a){
            $tra = Trabajador::find($a->trabajador_id);

            $urlWeb = config('webexperta.url-web');
            $linkform  = $urlWeb . '/registro-postulante/'. $tra->token;
            $diasTrabajoPorDias = $tra->estatus_por_dias == 1 ? getdiasTrabajo($tra->dias_contratados_por_dias) : null;
            $estatusAnterior = getEstatusAnterior($tra->id, $tra->estadoid);
            $distrito = DistritoView::find($tra->distrito_id);
            $n = explode(" ", $tra->nombres);
            $daysPast = $tra->certificado_antecedente_fecha ? getDaysPast($tra->certificado_antecedente_fecha) : null;

            $result[]=[
                'diaspasadoscertificadoantecedente' => $daysPast,
                'contact_name'                  => mb_convert_case(($n[0] . ' ' . $tra->apellidos), MB_CASE_UPPER, "UTF-8"),
                'flag_emoji'                    => $tra->postulando_pais_id == 11 ? '🇨🇱' : '🇵🇪',
                'id'                            => $a->id,
                'vecesBajas'                    => getBajasLengthOptimizado($tra),
                'numeroDocumento'               => $tra->usuario->numero_documento,
                'tiene_cuenta'                  => $tra->tiene_cuenta,
                'antecedentes_pdf'              => $tra->certificado_antecedente_pdf,
                'requerimiento_id'              => $a->requerimiento_id,
                'trabajador_id'                 => $a->trabajador_id,
                'trabajador'                    => mb_convert_case(($tra->trabajador), MB_CASE_UPPER, "UTF-8"),
                'token'                         => $tra->usuario->token,
                'nombres'                       => $tra->usuario->nombres ? $tra->usuario->nombres : 'NO DATA',
                'apellidos'                     => $tra->usuario->apellidos ? $tra->usuario->apellidos : 'NO DATA',
                'genero_id'                     => $tra->usuario->genero_id,
                'genero'                        => $tra->usuario->genero ? $tra->usuario->genero : 'NO DATA',
                'tipodocumento_id'              => $tra->usuario->tipodocumento_id,
                'tipodocumento'                 => findDocumentAcronym($tra->usuario->tipodocumento_id),
                'numero_documento'              => $tra->usuario->numero_documento,
                'correo'                        => $tra->usuario->correo,
                'cama_adentro'                  => $tra->cama_adentro,
                'cama_afuera'                   => $tra->cama_afuera,
                'por_horas'                     => $tra->por_horas,
                'telefono'                      => $tra->usuario->telefono,
                'telefono_whatsapp'             => $tra->usuario->telefono_whatsapp,
                'estatus_postulante_id'         => $tra->estatuspostulante_id,
                'estatus_postulante'            => $tra->estatusPostulante ? $tra->estatusPostulante->nombre : '',
                'foto'                          => $tra->foto,
                'usuario_id'                    => $tra->usuario_id,
                'fecha_postulacion'             => $a->fecha_postulacion,
                'activo'                        => $a->activo,
                'borrado'                       => $a->borrado,
                'creado'                        => $a->creado,
                'actualizado'                   => $a->actualizado,
                'select_emp'                    => $a->select_emp,
                'fue_tra'                       => $a->fue_tra,
                'select_wp'                     => $a->select_wp,
                'telefono_tarjeta'              => separateNumber($tra->usuario->telefono),
                'telefono_tarjeta_whatsapp'     => separateNumber($tra->usuario->telefono_whatsapp),
                'nacionalidad'                  => $tra->usuario->nacionalidad ? $tra->usuario->nacionalidad : 'NO DATA',
                'nacionalidadid'                => $tra->usuario->nacionalidad_id,
                'edad'                          => $tra->usuario && $tra->usuario->fecha_nacimiento ? \Carbon\Carbon::parse($tra->usuario->fecha_nacimiento)->age : '',
                'lugarnacimiento'               => $tra->usuario->lugar_nacimiento,
                'actividades'                   => showActividades($tra->actividad_id, 2, $tra->postulando_pais_id),
                'modalidades'                   => showTiposModalidades($tra->cama_adentro, $tra->cama_afuera, $tra->por_horas, $tra->postulando_pais_id),
                'antecedente'                   => checkAntecedente($tra->id),
                'certificado_antecedente'       => checkEstadoCertificadoAntecedente($tra->certificado_antecedente, $tra->certificado_antecedente_fecha),
                'verificaciones_laborales'      => ($tra->verificaciones_laborales && $tra->verificaciones_laborales != "[]") ? configVerificaciones($tra->verificaciones_laborales) : null,
                'link_form'                     => 'Dale clic a este link ' . $linkform . "\r\n" . "Vas a llenar TODO lo que te pedimos. Hazlo con calma, hazlo bien, de este currículo depende que te contraten.",
                'tuvo_covid'                    => $tra->tuvo_covid ? $tra->tuvo_covid : null,
                'tiene_vacuna'                  => $tra->tiene_vacuna,
                'cartilla_verificada'           => (bool) $tra->cartilla_verificada,
                'adjunto_cartilla'              => $tra->adjunto_cartilla_vacuna ? 'SI' : 'NO',
                'tiene_video'                   => (bool) $tra->video_introduccion_youtube,
                'videointroduccion'             => $tra->videointroduccion,
                'video_introduccion_youtube'    => $tra->video_introduccion_youtube,
                'distrito'                      => $tra->distrito_id ? $distrito->distritostres : ' - ',
                'estatus_por_dias'              => $tra->estatus_por_dias,
                'dias_contratados_por_dias'     => $diasTrabajoPorDias,
                'estatus_anterior'              => $estatusAnterior,
                'documento_vigente'             => $tra->documento_vigente,
                'foto_documento_delantera'      => $tra->foto_documento_delantera,
                'educacion'                     => configEstudios($tra->adjunto_educacion),
                'paisData'                      => setPaisData($tra),
                'historialContacto'             => convertHistorialContacto($tra->historial_contacto),
            ];
        }
    }
    return $result;
}

function getQueryPostulaciones($requerimientoid, $filtro){
    return RequerimientoPostulacion::with(['trabajador.usuario'])
        ->where('requerimiento_id', $requerimientoid)
        ->where('activo', $filtro)
        ->orderBy('select_emp', 'desc')
        ->orderBy('fecha_postulacion', 'desc');
}

function getPostulaciones($requerimientoid, $filtro){

    $result = [];

    if($requerimientoid){

        $query = getQueryPostulaciones($requerimientoid, $filtro);

        $data = $query->orderBy('fecha_postulacion', 'desc')->get();

        $result = processDataPostulaciones($data);

    }

    return $result;

}

function saveFormatSeguimiento($data){

    $result = [];

    if($data){

        foreach($data as $value){

            if($value['detalle'] != null){
                array_push($result, $value);
            }

        }
    }

    return $result == [] ? null : json_encode($result);

}

function getNewRequerimientos($fastsearch = false){

    $query = RequerimientoView::query();

    if ($fastsearch == 'H') {
        $query->whereDate('fechaentrevista', Carbon::now());
    } elseif ($fastsearch == 'T') {
        $query->where('fechaentrevista', '>=', Carbon::now()->subDays(3));
    } else {
        $query->where('actualizado', '>=', Carbon::now()->subDays(3));
    }

    $query->whereIn('estatusrequerimientoid', [1,4])
        ->with([
            'distritoView',
            'tipoDescanso',
            'diaSalida',
            'diaRetorno'
        ]);

    return $query->orderBy('fechaentrevista', 'desc')
        ->orderBy('horaentrevistaformat', 'desc')
        ->limit(10);
}

function getDataRequerimientos($lista, $offset){

    $data = $lista->offset($offset) ->limit(15) ->get();

    return $data;
}

function processDataRequerimiento($data){

    if (!$data) return [];
    $ids = $data->pluck('id');
    $empleadorIds = $data->pluck('empleadorid');
    $paisIds = $data->pluck('paispedido_id');

    $empleadores = EmpleadorView::whereIn('id', $empleadorIds)
        ->get()
        ->mapWithKeys(function($e){
            return [
                $e->id => [
                    'id' => $e->id,
                    'nombres' => $e->empleador,
                    'flag_emoji' => $e->pais_pedido_id == 11 ? '🇨🇱' : '🇵🇪',
                    'telefono' => $e->telefono,
                ]
            ];
        });


    $paises = Pais::whereIn('id', $paisIds)->get()->keyBy('id');

    $postulados = RequerimientoPostulacion::whereIn('requerimiento_id', $ids)
        ->where('activo', 1)
        ->selectRaw('requerimiento_id, COUNT(*) as total')
        ->groupBy('requerimiento_id')
        ->get()
        ->keyBy('requerimiento_id');

    $comprobantes = Comprobante::whereIn('mediofacturacion', $ids)
        ->where('tipomediofacturacion_id', 3)
        ->where('estatuscomprobante_id', 1)
        ->get()
        ->keyBy('mediofacturacion');

    $contratosGroup = Contrato::borrado(false)
        ->activo(true)
        ->whereIn('requerimiento_id', $ids)
        ->orderBy('creado', 'desc')
        ->get()
        ->groupBy('requerimiento_id');

    $tiposcontratosAll = TipoContrato::borrado(false)
        ->orderBy('nombre', 'asc')
        ->get()
        ->keyBy('id');


    $result = [];

    foreach ($data as $d) {

        $newTerms1711 = isNewTerms1711($d->creado);
        $contract = validateNewContrato($d, $d->paispedido_id, $contratosGroup, $tiposcontratosAll);

        // Divisa
        if ($d->paispedido_id == 54) {
            $divisa = 'S/';
            $tooltipdivisa = 'NUEVOS SOLES - PERÚ';
        } else {
            $divisa = $d->codigo_iso_divisa_paispedido;
            $tooltipdivisa = $d->divisa_paispedido . ' - ' . $d->paispedido;
        }

        $n = explode(" ", $d->empleadornombres);

        $result[] = [

            'postulados' => $postulados[$d->id]->total ?? 0,
            'empleador_contact_data' => $empleadores[$d->empleadorid] ?? null,
            'pais_pedido' => $paises[$d->paispedido_id] ?? null,
            'comprobanteadelanto' => $comprobantes[$d->id] ?? null,


            'edades' => $d->rangoedadid ? armarRangoEdad($d->rangoedadid) : ' - ',
            'fechaentrevista' => $d->fechaentrevista ? getFormatFechaEntrevista($d->fechaentrevista) : '',
            'sueldo' => numberToCommas((int)$d->sueldo),
            'empleador' => getNombreCorto($d->empleadornombres, $d->empleadorapellidos),

            'id' => $d->id,
            'contact_name' => $n[0] . ' ' . $d->empleadorapellidos,
            'horaentrevista' => $d->horaentrevista ? Carbon::parse($d->horaentrevista)->format('h:i A') : '',
            'estatusempleadorid' => $d->estatusempleadorid,
            'actividad' => $d->actividad,
            'modalidad' => $d->modalidad,
            'nacionalidad' => $d->nacionalidad,
            'distrito' => $d->distrito,
            'tipobeneficio' => $d->tipobeneficio ?: ' - ',
            'tipocomision' => $d->tipocomision,
            'divisa' => $divisa,
            'monto_comision' => $d->monto_comision,
            'tooltip_divisa' => $tooltipdivisa,
            'newTerms1711' => $newTerms1711,
            'tipocontratoid' => $contract['tipocontratodefault'],
            'tipocontrato' => $contract['tipocontratonombre'],
            'confirmacion_adelanto' => $d->confirmacion_adelanto,
            'estadoid' => $d->estatusrequerimientoid,
            'estado' => $d->estatusrequerimiento,
            'disponibleentrevista' => $d->disponibleentrevista,
        ];
    }

    return $result;
}


function findComprobanteAdelanto($idReq){
    $result = null;

    if ($idReq) {
        $comprobante = Comprobante::where('mediofacturacion', $idReq)->where('tipomediofacturacion_id', 3)->where('estatuscomprobante_id', 1)->first();

        if ($comprobante){
            $result = [
                'comprobanteAdelantoID'     => $comprobante->id,
                'comprobanteAdelantoPDF'    => $comprobante->url_pdf
            ];
        }
    }

    return $result;
}

function getDiasNormalSemanaMS(){

    $result = [];
    $data = DiaSemana::borrado(false)->where('normal', true)->get();

    if($data){

        foreach ($data as $d) {

            $result[] = [
                'label' => ((($d->nombre))),
                'value' => $d->id
            ];
        }

    }

    return $result;

}

function getReqDetails($d){

    $paisPedido = null;
    $empleador = null;
    $modalidad = null;
    $actividad = null;
    $nacionalidad = null;
    $sueldoPD = null;
    $sueldo = null;
    $tipovivienda = null;
    $numpisos = null;
    $distrito = null;
    $numadultos = null;
    $numninos = null;
    $edadninos = null;
    $nummascotas = null;
    $tipodescanso = null;
    $numpacientes = null;
    $edadpacientes = null;
    $diagnostico = null;
    $diasalida = null;
    $horasalida = null;
    $diaretorno = null;
    $horaretorno = null;
    $rangoedad = null;
    $frecuencia = null;
    $tipobeneficio = null;
    $iniciolabores = null;

    $observaciones = null;

    $r = RequerimientoView::find($d->id);

    $arregloRangoEdad = extractRangoEdad($r->rangoedadid);

    $act = $r->actividadid;
    $mod = $r->modalidadid;

    if ($d->fecha_inicio_labores){
        $f = formatFecha(Carbon::parse($d->fecha_inicio_labores));
        $fecha = (mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . mb_convert_case($f['nombreMes'], MB_CASE_TITLE, "UTF-8") . ' del ' . $f['numeroAnio']);
        $iniciolabores = 'Fecha Inicio de Labores: ' . $fecha;
    }

    if ($r->tipobeneficio){
        $tipobeneficio = 'Tipo de Beneficio: ' . mb_convert_case( $r->tipobeneficio , MB_CASE_TITLE, "UTF-8") ;
    }

    if ($r->empleadornombres){
        $empleador = 'Empleador: ' . mb_convert_case( $r->empleador , MB_CASE_TITLE, "UTF-8") ;
    }

    if ($r->paispedido_id){
        $paisPedido = 'País pedido: ' . mb_convert_case( $r->paispedido , MB_CASE_TITLE, "UTF-8") ;
    }

    if ($r->actividad){
        $actividad = 'Actividad: ' .  mb_convert_case( $r->actividad , MB_CASE_TITLE, "UTF-8") ;
    }

    if ($r->modalidad) {
        $modalidad = 'Modalidad: ' . mb_convert_case( $r->modalidad , MB_CASE_TITLE, "UTF-8") ;
    }

    if ($r->rangoedadid){
        $rangoedad = 'Rango de edad: De ' . $arregloRangoEdad['min'] . ' a ' . $arregloRangoEdad['max'] . ' años' ;
    }

    if($mod == 3 ){

        if ($r->sueldo_por_dias){
            $sueldo = 'Sueldo por mes: ' . $r->codigo_iso_divisa_paispedido . ' ' . numberToCommas($r->sueldo_por_dias) ;
        }

        if ($r->valor_dia_frecuencia){
            $sueldoPD = 'Sueldo por día: ' . $r->codigo_iso_divisa_paispedido . ' ' . numberToCommas($r->valor_dia_frecuencia );
        }

    }else{

        if ($r->sueldo){
            $sueldo = 'Sueldo: ' . $r->codigo_iso_divisa_paispedido . ' ' . numberToCommas($r->sueldo) ;
        }

    }


    if ($r->nacionalidadid){
        $nacionalidad = 'Nacionalidad: ' . ucfirst(mb_convert_case( $r->nacionalidad , MB_CASE_LOWER, "UTF-8")) ;
    }

    if ($r->distrito){
        $distrito = 'Distrito: ' . mb_convert_case( $r->distrito , MB_CASE_TITLE, "UTF-8") ;
    }

    if($act == 1){

        $edadninos = 'Edad niño(s): '  . ($r->edad_nino ?  ucfirst(mb_convert_case( getListaEdades($r->edad_nino) , MB_CASE_LOWER, "UTF-8")) : ' - ');
        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $numadultos = ($r->num_adultos ? ('Cantidad de adultos: ' . $r->num_adultos) : '');
        $nummascotas = ($r->num_mascotas ? ('Cantidad de mascotas: ' . $r->num_mascotas) : '');
        $tipovivienda = 'Tipo de vivienda: ' . ($r->tipovivienda ?  mb_convert_case( $r->tipovivienda , MB_CASE_TITLE, "UTF-8") : ' - ');
        $numpisos = ($r->num_pisos ? ('Pisos: ' . $r->num_pisos) : '');

    }else if($act == 5){

        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $numpacientes = ($r->num_adultos ? ('Cantidad de adultos: ' . $r->num_adultos) : '');
        $nummascotas = ($r->num_mascotas ? ('Cantidad de mascotas: ' . $r->num_mascotas) : '');
        $tipovivienda = 'Tipo de vivienda: ' . ($r->tipovivienda ? mb_convert_case( $r->tipovivienda , MB_CASE_TITLE, "UTF-8") : ' - ');
        $numpisos = ($r->num_pisos ? ('Pisos: ' . $r->num_pisos) : '');

    }else if($act == 9){

        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $numpacientes = ($r->num_adultos ? ('Cantidad de adultos: ' . $r->num_adultos) : '');
        $nummascotas = ($r->num_mascotas ? ('Cantidad de mascotas: ' . $r->num_mascotas) : '');
        $tipovivienda = 'Tipo de vivienda: ' . ($r->tipovivienda ? mb_convert_case( $r->tipovivienda , MB_CASE_TITLE, "UTF-8") : ' - ');
        $numpisos = ($r->num_pisos ? ('Pisos: ' . $r->num_pisos) : '');

    }else if($act == 4){

        $tipovivienda = 'Tipo de vivienda: ' . ($r->tipovivienda ? mb_convert_case( $r->tipovivienda , MB_CASE_TITLE, "UTF-8") : ' - ' );
        $numpisos = ($r->num_pisos ? ('Pisos: ' . $r->num_pisos) : '');

    }else if($act == 2){

        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $numpacientes = ($r->num_adultos ? ('Cantidad de adultos: ' . $r->num_adultos) : '');

    }else if($act == 6){

        $numninos = ($r->num_ninos ? ('Cantidad de bebés: ' . $r->num_ninos) : '');
        $edadninos = 'Edad bebé(s): '  . ($r->edad_nino ?  ucfirst(mb_convert_case( getListaEdades($r->edad_nino) , MB_CASE_LOWER, "UTF-8")) : ' - ');

    }else if($act == 7){

        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $edadninos = 'Edad niño(s): '  . ($r->edad_nino ?  ucfirst(mb_convert_case( getListaEdades($r->edad_nino) , MB_CASE_LOWER, "UTF-8")) : ' - ');

    }else if($act == 3){

        $numpacientes = ($r->num_adultos ? ('Cantidad de pacientes: ' . $r->num_adultos) : '');
        $edadpacientes = ($r->actividadid == 3 ? 'Edad de paciente: ' : 'Edad adulto(s): ') . ($r->edad_adulto ?  ucfirst(mb_convert_case( getListaEdades($r->edad_adulto) , MB_CASE_TITLE, "UTF-8")) : ' - ');
        $diagnostico = 'Diagnóstico: ' . ($r->diagnostico ? $r->diagnostico : ' - ');


    }else if($act == 8){

        $numninos = ($r->num_ninos ? ('Cantidad de niños: ' . $r->num_ninos) : '');
        $numpacientes = ($r->num_adultos ? (($r->actividadid == 3 ? 'Cantidad de pacientes: ' : 'Cantidad de adultos: ') . $r->num_adultos) : '');


    }else if($act == 10){

        $numpacientes = ($r->num_adultos ? ('Cantidad de pacientes: ' . $r->num_adultos) : '');
        $edadpacientes = ($r->actividadid == 3 ? 'Edad de paciente: ' : 'Edad adulto(s): ') . ($r->edad_adulto ? ucfirst(mb_convert_case( getListaEdades($r->edad_adulto) , MB_CASE_LOWER, "UTF-8")) : ' - ');
        $diagnostico = 'Diagnóstico: ' . ($r->diagnostico ? $r->diagnostico : ' - ');


    }


    $horarios = '';

    if($r->horarios){

        $horarios .= 'Horario: ' . "" ;

        foreach (json_decode($r->horarios, true) as $h){

            if($mod == 1){
                $horarios .= '' . mb_convert_case( ($h['dia']) , MB_CASE_TITLE, "UTF-8") . ': '  . ($h['isDescanso'] ? ' Descanso' : ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') ) );
            }else if($mod == 2){
                $horarios .= '' . mb_convert_case( ($h['dia']) , MB_CASE_TITLE, "UTF-8") . ': '  . ($h['isDescanso'] ? ' Descanso' : ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') ) );
            }else if($mod == 3){

                if(!$h['isDescanso']){
                    $horarios .= '' . mb_convert_case( ($h['dia']) , MB_CASE_TITLE, "UTF-8") . ': '  . ($h['isDescanso'] ? ' Descanso' : ( Carbon::parse($h['horaingreso'])->format('h:i A') . ' - '. Carbon::parse($h['horasalida'])->format('h:i A') ) );
                }

            }

        }

    }

    if ($mod == 1/*Cama Adentro*/){

        /*if ($r->tiempocuarentena){
            $tipodescanso = 'Tipo Descanso: ' .  mb_convert_case( $r->tiempocuarentena , MB_CASE_TITLE, "UTF-8");
        }*/

        if ($r->dia_salida){
            $diasalida = 'Día de salida: ' .  mb_convert_case( DiaSemana::find($r->dia_salida)->nombre , MB_CASE_TITLE, "UTF-8") ;
        }

        if ($r->hora_salida){
            $horasalida = 'Hora de salida: ' . Carbon::parse($r->hora_salida)->format('h:i A');
        }

        if ($r->dia_ingreso){
            $diaretorno = 'Día de retorno: ' . mb_convert_case( DiaSemana::find($r->dia_ingreso)->nombre , MB_CASE_TITLE, "UTF-8");
        }

        if ($r->hora_ingreso){
            $horaretorno = 'Hora de retorno: ' . Carbon::parse($r->hora_ingreso)->format('h:i A');
        }

    }else if($mod == 3/*Por Dias*/) {

        $frecuencia = 'Frecuencia: ' . ($r->frecuenciaservicio ? $r->frecuenciaservicio : ' - ') . "";

    }

    if($r->observaciones){
        $observaciones = 'Observaciones: ' . $r->observaciones;
    }

    $data = [
        'paisPedido' => $paisPedido,
        'empleador' => $empleador,
        'actividadId' => $act,
        'modalidadId' => $mod,
        'modalidad' => $modalidad,
        'actividad' => $actividad,
        'nacionalidad' => $nacionalidad,
        'rangoedad' => $rangoedad,
        'sueldoPD' => $sueldoPD,
        'sueldo' => $sueldo,
        'tipovivienda' => $tipovivienda,
        'numpisos' => $numpisos,
        'numpacientes' => $numpacientes,
        'edadpacientes' => $edadpacientes,
        'diagnostico' => $diagnostico,
        'numadultos' => $numadultos,
        'numninos' => $numninos,
        'edadninos' => $edadninos,
        'nummascotas' => $nummascotas,
        'distrito' => $distrito,
        'frecuencia' => $frecuencia,
        'tipodescanso' => $mod == '1' ? $tipodescanso : null,
        'horarios' => $mod == '1' ? '' : json_decode($r->horarios),
        'diasalida' => $r->tiempo_cuarentena ? null : $diasalida,
        'horasalida' => $r->tiempo_cuarentena ? null : $horasalida,
        'diaretorno' => $r->tiempo_cuarentena ? null : $diaretorno,
        'horaretorno' => $r->tiempo_cuarentena ? null : $horaretorno,
        'observaciones' => $observaciones,
        'tipobeneficio' => $tipobeneficio,
        'inicioLabores' => $iniciolabores
    ];

    return $data;

};

function getEmpleadorMS($id){

    $result = '';
    $data = EmpleadorView::find($id);

    if($data){

        $result = [
            'label' => ((($data->nombres . ' ' .$data->apellidos))),
            'value' => $data->id
        ];

    }

    return $result;

}

function actualizarActivPostulante($Postulante){
    $dataPost = [
        'actualizado'               => Carbon::now(),
    ];
    $e = Trabajador::where('id', $Postulante)->update($dataPost);
}

function getListaIDPostulantesActivos($requerimientoid){

    $result = [];

    if($requerimientoid){

        $listapostulantesactivos = RequerimientoPostulacion::borrado(false)->activo(true)->where('requerimiento_id', $requerimientoid)->get();

        if($listapostulantesactivos){

            foreach ($listapostulantesactivos as $a){

                array_push($result, $a->trabajador_id);
            }

        }

    }

    return $result;

}

function convertToDateManana($fecha){
    $result = '';
    if ($fecha){
        $result = strtotime("tomorrow");
    }
    return date("Y-m-d", $result);
}

function getIdList($data){
    $result = [];

    if ($data){
        foreach ($data as $d){
            $result[] = [
                'id'        => $d->id
            ];
        }
    }

    return $result;
}

function getPostulacionesPrevias($idEmpleador, $idReqActual){

    $reqs = Requerimiento::where('empleador_id', $idEmpleador)->whereNotIn('id', array($idReqActual));
    $res = [];

    if ($reqs->count() != 0){
        foreach ($reqs->get() as $d){
            $postulaciones = RequerimientoPostulacion::where('requerimiento_id', $d->id)->where('activo', 2);
            foreach ($postulaciones->get() as $p){
                $tra = TrabajadorView::find($p->trabajador_id);

                $res[] = [
                    'idPostulante'          => $tra->id,
                    'postulante'            => $tra->trabajador,
                    'foto'                  => $tra->foto,
                    'fechaPostulacion'      => $p->fecha_postulacion,
                ];
            }
        }
    }

    return $res;

}
