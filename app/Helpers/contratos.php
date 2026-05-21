<?php

use Carbon\Carbon;
use App\Models\Requerimiento;
use App\Models\Trabajador;
use App\Models\Contrato;

function isCambioAplicable($contrato)
{
    if (!$contrato || !$contrato->fecha) {
        return false;
    }

    $fechaContrato = Carbon::parse($contrato->fecha)->startOfDay();
    $fechaActual = Carbon::now()->startOfDay();

    // Clonar para no modificar la fecha original
    $fechaContratoAddMonth = Carbon::parse($contrato->fecha)->addMonth()->startOfDay();

    return $fechaActual->isBetween($fechaContrato, $fechaContratoAddMonth, true);
}

function getNewContratos(){

    $data = Contrato::where('creado', '>=', \Carbon\Carbon::now()->subDays(2) )->orderBy('actualizado', 'desc');

    return $data;
}

function getDataContratos($lista, $offset){

    $data = $lista->offset($offset)->limit(10)->get();

    return $data;
}

function processDataContrato($data){
    $result = [];

    if ($data){
        foreach ($data as $d){

            $req= Requerimiento::where('id', $d->requerimiento_id)->first();

            // Calcular días restantes
            $diasRestantes = null;

            if ($req && $req->fecha_fin_garantia) {
                $hoy = now()->startOfDay();
                $fin = \Carbon\Carbon::parse($req->fecha_fin_garantia)->startOfDay();
                $diasRestantes = $hoy->diffInDays($fin, false); // false = puede dar negativo
            }

            $result[] = [
                'empleador_flag_emoji'              => $d->paispedido_id  ? ($d->paispedido_id == 11 ? '🇨🇱' : '🇵🇪') : '🇵🇪',
                'pais_pedido'                       => getDataPaisPedido($req->paispedido_id),
                'id'                                => $d->id,
                'creado'                            => Carbon::parse($d->creado)->format('d/m/Y'),

                'empleador_contact_data'            => getEmpleadorContactData($d),
                'trabajador_contact_data'           => getTrabajadorContactData($d->trabajador),
                'empleador'                         => getNombreCorto($d->empleador->usuario->nombres, $d->empleador->usuario->apellidos),
                'data_trabajador'                   => getDataTrabajadorContrato($d->trabajador_id),

                'trabajador'                        => $d->trabajador && $d->trabajador->usuario
                    ? ($d->trabajador->usuario->nombres . ' ' .  $d->trabajador->usuario->apellidos)
                    : ' - ',
                'trabajador_short'                  => $d->trabajador && $d->trabajador->usuario
                    ? getNombreCorto($d->trabajador->usuario->nombres, $d->trabajador->usuario->apellidos)
                    : ' - ',

                'trabajador_id'                     => $d->trabajador_id,

                'trabajador_b' => $d->trabajadorB && $d->trabajadorB->usuario
                    ? getNombreCorto($d->trabajadorB->usuario->nombres, $d->trabajadorB->usuario->apellidos)
                    : ' - ',
                'trabajador_b_contact_data'         => getTrabajadorContactData($d->trabajadorB),

                'trabajador_c' => $d->trabajadorC && $d->trabajadorC->usuario
                    ? getNombreCorto($d->trabajadorC->usuario->nombres, $d->trabajadorC->usuario->apellidos)
                    : ' - ',
                'trabajador_c_contact_data'         => getTrabajadorContactData($d->trabajadorC),

                'verif_ingreso'                     => $d->verificador_ingreso,

                'actividad'                         => optional(optional($req)->actividad)->nombre,
                'actividad_id'                      => optional($req)->actividad_id,

                'modalidad'                         => optional(optional($req)->modalidad)->nombre,
                'modalidad_id'                      => optional($req)->modalidad_id,

                'sueldo'                            => $d->sueldo,

                'fecha_ini_lab'                     => $d->fechainiciolabores ? date('d/m/Y',strtotime($d->fechainiciolabores)) : null,
                'hora_ini_lab'                      => $d->horainiciolabores ? date('h:i A',strtotime($d->horainiciolabores)) : null,

                'anulado'                           => $d->anulado,
                'culminado'                         => $d->culminado,

                'estatus_req'                       => $req->estatusrequerimientoid,

                'pdf_constancia_colocacion'         => null,

                'antecedentes'                      => getAntecedentesTrabajadorColocado($d),
                'comprobante'                       => getUltimoComprobante($d),

                'tipo_contrato_id'                  => $d->tipocontrato_id,
                'tipo_contrato'                     => optional($d->tipoContrato)->nombre,

                'dias_restantes'                    => $diasRestantes,
                'domicilio_id'                      => $d->domicilio_id,
            ];
        }
    }

    return $result;
}

function showDiasHorariosContrato($modalidad, $horarios, $diaretorno = null, $diasalida = null, $tipo = 'descanso'){

    $result = [];

    if($modalidad == 1){

        $dia_r = $diaretorno ? \App\Models\DiaSemana::find($diaretorno)->nombre : '';
        $dia_s = $diasalida ? \App\Models\DiaSemana::find($diasalida)->nombre : '';

        $result = ($dia_r AND $dia_s) ? ( ($dia_s == $dia_r) ? $dia_r : ($dia_r . ' A ' . $dia_s) ) : ' - ';

    }else{

        if($horarios){

            foreach (json_decode($horarios, true) as $h){

                if($tipo == 'descanso'){

                    if($h['isDescanso']){

                        $result[] = mb_substr( mb_strtoupper($h['dia']) , 0, 3);
                    }

                }else if($tipo == 'laboral'){

                    if(!$h['isDescanso']){
                        $result[] = mb_substr( mb_strtoupper($h['dia']) , 0, 3);
                    }

                }

            }

            $result = implode(' | ',$result);

        }

    }

    return $result;
}

function getTerminoID($requerimientoid){

    $lastApertura = \App\Models\Contrato::borrado(false)->where('requerimiento_id',  $requerimientoid )->where('tipocontrato_id', 1)->orderBy('creado', 'desc')->first();

    if($lastApertura){

        $fechaContrato = $lastApertura->fecha;

        $fechaNewTerminos05062020 = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', '2020-06-05 00:00:00');
        $fechaNewTerminos04082020 = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', '2020-08-04 00:00:00');
        $fechaNewTerminos05042021 = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', '2021-04-05 00:00:00');

        if( ($fechaContrato->gte($fechaNewTerminos05062020)) AND $fechaContrato->lt($fechaNewTerminos05042021)){
            return 2;
        }else if($fechaContrato->gte($fechaNewTerminos05042021)){
            return 4;
        }else if($fechaContrato->gte($fechaNewTerminos04082020)){
            return 3;
        }else{
            return 1;
        }

    }else{
        return 3;
    }

}

function getNumeroPostulantes($requerimientoid){

    $lastApertura = \App\Models\Contrato::where('requerimiento_id',  $requerimientoid )->where('tipocontrato_id', 1)->orderBy('creado', 'desc')->first();

    if($lastApertura){

        $fechaContrato = $lastApertura->fecha;
        $fechaNewTerminos = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', '2020-07-15 00:00:00');

        if($fechaContrato->gte($fechaNewTerminos)){
            return mesesEnLetra(3);
        }else{
            return mesesEnLetra(5);
        }

    }else{
        return mesesEnLetra(3);
    }

}

function getCopyTrabajadorBC($token, $opcion){
    $t1 = 'Estamos tratando de comunicarnos con ella y no nos responde.' . "\r\n" . "\r\n";
    $t2 = 'Lamentamos la inasistencia de la trabajadora y las demoras que esto pueda ocasionar.' . "\r\n" . "\r\n";
    $t3 = 'Cuando una trabajadora no va a trabajar la expulsamos  de la plataforma y no vuelve a postular a ningún trabajo a través de Bertha. Por transparencia usted también tiene sus datos a donde puede comunicarse con ella.' . "\r\n" . "\r\n";
    $t4 = 'La opción ' . $opcion . ':' . "\r\n";
    $CV = 'https://holabertha.com/ficha-postulante/' . $token . "\r\n" . "\r\n";
    $t5 = 'Está disponible, por contrato la podemos enviar. Ella está lista para salir de inmediato a pesar de haberle avisado a última hora, usted puede recibirla. Recuerde que toda trabajadora cuenta con un mes de prueba donde cuenta con reemplazos gratis, de esta manera usted tendría apoyo el día de hoy inmediato. En caso que no desee recibirla usted deberá esperar entre 3 y 7 días útiles para nuevas entrevistas conforme a disponibilidad de la agencia, nuestra recomendación es que no espere más y pueda recibir a su opción b de inmediato.' . "\r\n" . "\r\n";
    $t6 = 'Esperamos su confirmación.';

    return ($t1 . $t2 . $t3 . $t4 . $CV . $t5 . $t6);
}

function getDetallesContratosCopy($d){

    $linkAdjuntos = '';
    $t1 = 'Le enviamos la información de su contrato:' . "\r\n" . "\r\n";

    if ($d->id){
        $linkAdjuntos = ' - Detalles: ' . getEncondedLink($d->id, 'mis-contratos') . "\r\n" ;
    }

    return ($t1 . $linkAdjuntos);
}
function getConstDetallesEmpleador($d){
    $trabajador = '';
    $telefono = '';
    $whatsApp = '';
    $exempleadores = '';
    $fechaIngreso = '';
    $pdfFichaTrabajador = '';
    $pdfComprobante = '';
    $trabajadorData = \App\Models\Views\TrabajadorView::find($d->trabajadorid);
    $adjuntoAntecedente = ($trabajadorData->antecedente_pdf ? ' - Antecedentes Adjunto: ' . getEncondedLink($d->id, 'mis-contratos/antecedentes-trabajador') . "\r\n"  : null);
    $domicilioTrabajador = ' - Domicilio: ' . $trabajadorData->direccion . ', ' . $trabajadorData->distrito_direccion . ', ' . $trabajadorData->provincia_direccion . ', ' . $trabajadorData->departamento_direccion . ', ' . $trabajadorData->distrito_pais . "\r\n" ;
    $declaracionjurada = ' - Declaración Jurada de Domicilio; y de Gozar Buena Salud Física y Mental; y Vacuna COVID: ACEPTADO Y DECLARADO ELECTRÓNICAMENTE CON ID ' . $d->id . "\r\n" ;

    $recomendaciones = null;

    if ($trabajadorData->verificaciones_laborales){
        $recomendaciones = ' - Ex-empleador(es): ' . "\r\n" ;
        foreach (json_decode($trabajadorData->verificaciones_laborales, true) as $r){
            $recomendaciones .= '    ' . $r['nombre'] . ' ' . $r['apellidos'] . ' (+' . $r['telefono'] . ')' . "\r\n" ;
        }
    }

    $pdfFichaTrabajador = ' - Ficha web:  https://holabertha.com/ficha-postulante/' . $trabajadorData->token . "\r\n" ;



    $t1 = 'Información de su contrato:' . "\r\n" . "\r\n";
    $t2 = '*- DETALLES DE LA TRABAJADORA:*' . "\r\n";

    if ($d->trabajador){
        $trabajador = ' - Nombre: ' . $d->trabajador . "\r\n";
    }

    if ($d->trabajadortelefono){
        $telefono = ' - Celular: ' . $d->trabajadortelefono . "\r\n";
    }

    if ($d->trabajadorwhatsapp){
        $whatsApp = ' - WhatsApp: wa.me/' . $d->trabajadorwhatsapp . ' (Dar clic)' . "\r\n";
    }

    $t3 = '*- DETALLES DE LA COLOCACIÓN:*' . "\r\n";

    $divisa = ($d->paispedido_id == 54 ? 'S/' : $d->codigo_iso_divisa_paispedido);

    $montoPagado = ' - Monto pagado: ' . $divisa . ' ' . numberToCommas($d->descuentoejecutivo) . "\r\n" ;

    if ($d->fecha_inicio_labores){
        $f = formatFecha($d->fecha_inicio_labores);
        $fecha = ( mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . $f['nombreMes'] . ' del ' . $f['numeroAnio'] );
        $h = date_create($d->hora_inicio_labores);
        $ho = date_format($h, 'g:i A');
        $newHora12 = date_format($h, 'g:i A');

        if ($d->modalidadid == 1){
            if ($ho == "7:00 AM"){
                $newHora12 = '8:00 AM (Por ser el primer día que conoce su hogar).';
            }
        }

        $hora = ($d->hora_inicio_labores ? ( ', ' . $newHora12 ) : '' );
        $fechaIngreso = ' - Inicio de labores: ' .  $fecha . $hora . "\r\n";
    }

    $inicioGarantia = null;
    $finGarantia = null;

    if ($d->fecha_inicio_garantia){
        $f1 = formatFecha($d->fecha_inicio_garantia);
        $fecha1 = ( mb_convert_case($f1['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f1['numeroDia'] . ' de ' . $f1['nombreMes'] . ' del ' . $f1['numeroAnio'] );
        $inicioGarantia = ' - Inicio de garantía: ' . $fecha1 . "\r\n";
    }

    if ($d->fecha_fin_garantia){
        $f2 = formatFecha($d->fecha_fin_garantia);
        $fecha2 = ( mb_convert_case($f2['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f2['numeroDia'] . ' de ' . $f2['nombreMes'] . ' del ' . $f2['numeroAnio'] );
        $finGarantia = ' - Fin de garantía: ' . $fecha2 . "\r\n";
    }

    if ($d->pdf_contrato){
        $pdfContrato = ' - Contrato de selección: ' . getEncondedLink($d->id, 'pdf/ver-contrato') . "\r\n" ;
    }

    $comprobante = \App\Models\Comprobante::where('mediofacturacion', $d->id)->where('estatuscomprobante_id', 1)->first();

    if ($d->monto_total_contrato != 0){
        if ($d->paispedido_id == 54){
            if ($d->pdf_comprobante_ext){
                $pdfComprobante = ' - Comprobante: ' . getEncondedLink($d->id, 'pdf/ver-comprobante') . "\r\n" ;
            }else{
                if ($comprobante){
                    $pdfComprobante = ' - Comprobante: ' . getEncondedLink($d->id, 'pdf/ver-comprobante') . "\r\n" ;
                }
            }
        }else{
            $pdfComprobante = ' - Recibo de pago: ' . getEncondedLink($d->id, 'pdf/ver-recib-opago') . "\r\n" ;
        }
    }

    $t4 = "\r\n" . '*Puntos importantes*:' . "\r\n" ;
    $t5 = 'a. *Le hemos enviado el celular y WhatsApp del postulante*. Ella ya recibió su celular, su dirección y un mapa. Pero *necesitará de su guía para llegar a su domicilio*.' . "\r\n" ;
    $t6 = 'b. *Bertha no puede controlar accidentes, enfermedades o emergencias personales de un postulante*, por lo tanto *no es responsable de la ausencia o duración de una trabajadora*. Solicitamos escoger opciones (a) y (b) para disminuir el ausentismo. Si desea un *reemplazo en el futuro*, el tiempo de una nueva selección es de *mínimo 3 días* y máximo 7, de acuerdo a disponibilidad.' . "\r\n" ;
    $t7 = 'c. *No* brinde *adelantos* de sueldo o *préstamos* a su trabajadora.' . "\r\n" ;
    $t8 = 'd. *No* compre *uniforme* o hágalo hasta después del período de prueba, ya que el uniforme no es descontable y si usted la despide o ella renuncia, la nueva trabajadora no querrá vestir un uniforme usado. ' . "\r\n" ;
    $t9 = 'e. Toda la comunicación de *Bertha* será con el titular del contrato (*no terceros*) y *a través del Canal Chat*, así generamos un historial escrito de los acuerdos. El canal telefónico y/o de videollamadas se usan solo para entrevistas.' . "\r\n" ;
    $t10 = 'f. El *tiempo de respuesta para una consulta es por orden de llegada*, *hasta 24 horas* luego de recibido el mensaje y dentro del horario laboral de lunes a viernes de 8 am a 6 pm y sábados de 8 am a 1 pm.' . "\r\n" ;
    $t11 = 'g. *Por ley, el sueldo es pagado por el empleador*, si se incumple, la trabajadora podrá realizar una denuncia llamando al Ministerio del Trabajo, 01 630 6000, opción "trabajadora del hogar" o a través del siguiente link: https://aplicativosweb2.sunafil.gob.pe/si.denunciasVirtuales/inicio' . "\r\n" ;
    $t12 = 'h. *El uso de nuestros servicios implica que el empleador aceptó nuestra cotización, términos y condiciones*. Por lo tanto, no procede ningún tipo de devolución.' . "\r\n" . "\r\n" ;
    $t13 = 'El día de inicio de labores, le escribiremos a usted para que nos confirme cuando la trabajadora haya llegado a su domicilio. Muchas gracias y buen día.' . "\r\n" ;

    return $t1 . $t2 . $trabajador . $telefono . $whatsApp . $pdfFichaTrabajador . $domicilioTrabajador . $declaracionjurada . $adjuntoAntecedente . $recomendaciones .  "\r\n" . $t3 . $fechaIngreso . $montoPagado . $inicioGarantia . $finGarantia . $t4 . $t5 . $t6 . $t7 . $t8 . $t9 . $t10 . $t11 . $t12 . $t13;
}

function getConstDetalles($d, $newTerms1711){
    $empleador = '';
    $telefono = '';
    $whatsApp = '';
    $direccion = '';
    $referencia = '';
    $constanciaColocacion = '';
    $mapa = '';
    $fechaIngreso = '';

    $empleadorData = \App\Models\Views\EmpleadorView::find($d->empleadorid);

    if ($d->empleador){
        $empleador = '*Nombres y Apellidos*: ' . $d->empleador . "\r\n";
    }

    $dniEmpleador = '*' . $empleadorData->acronym_tipodocumento .'*: ' . $d->empleadornumerodocumento . "\r\n";

    if ($d->empleadortelefono){
        $telefono = '*Teléfono*: ' . $d->empleadortelefono . "\r\n";
        $whatsApp = '*WhatsApp*: wa.me/' . $d->empleadortelefono . ' (Dale clic)'  . "\r\n";
    }

    if($d->domicilio){
        $direccion = '*Dirección*: ' . $d->domicilio . "\r\n";
    }

    if ($d->domicilio_referencia){
        $referencia = '*Referencia*: ' . $d->domicilio_referencia . "\r\n";
    }

    if ($d->pdf_constancia_colocacion){
        $constanciaColocacion = '*Constancia de colocación*: ' . getEncondedLink($d->id, 'contrato/ver-constancia') . ' (Dale clic)' . "\r\n";
    }

    $dom = \App\Models\Domicilio::find($d->domicilio_id);

    $mapa = '*Mapa:*  ' . getEncondedLink($d->id, 'contrato/ver-direccion') . ' (Dale clic)' . "\r\n" ;

    if ($d->fecha_inicio_labores){
        $f = formatFecha($d->fecha_inicio_labores);
        $fecha = ( mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . $f['nombreMes'] . ' del ' . $f['numeroAnio'] );
        $h = date_create($d->hora_inicio_labores);
        $hora = ($d->hora_inicio_labores ? ( ', ' . date_format($h, 'g:i A') ) : '' );
        $fechaIngreso = '*Inicio de labores*: ' . mb_convert_case(($fecha . $hora), MB_CASE_UPPER, "UTF-8") . "\r\n";
    }

    $t1 = '*El empleador te ha contratado.* La EMPRESA BERTHA con Registro N° 12-2016-DRTELM/DPECL - SDRAFPCL del Ministerio del Trabajo y Promoción del Empleo certifica este contrato:' . "\r\n";
    $tituloColocacion = '*DETALLES DE LA COLOCACIÓN:*' . "\r\n";
    $tituloRequerimiento = '*DETALLES DEL REQUERIMIENTO:*' . "\r\n";

    $t2 = '*IMPORTANTE:*' . "\r\n" .
        'a. *Bertha te ha conseguido un empleo formal*, al darte un empleo a ti, se lo quitamos a otra trabajadora. Por lo tanto, debes cuidar tu trabajo.' . "\r\n" .
        'b. *El día que inicias a trabajar es obligatorio que nos escribas a penas salgas de tu casa*, para saber que estás camino a tu trabajo. Si no lo haces, asumimos que no asistirás a tu trabajo.' . "\r\n" .
        'c. *Si no asistes a tu primer día de labores, te expulsaremos definitivamente* y no podrás postular a más empleos.' . "\r\n" .
        'd. *Si eres responsable y asistes a tu trabajo*, *Bertha te brinda el derecho de probar el trato de tu empleador*. Si no estás cómoda y deseas renunciar, haremos que te paguen tus días trabajados y te buscaremos otro empleo, pero *debes durar mínimo 1 mes*.';

    $t3 = 'Cuida tu trabajo, muchas gracias. *Confírmanos que leíste toda la información.*';

    $detallesReq = getCopyDetalles(\App\Models\Views\RequerimientoView::find($d->requerimientoid), null, $d->actividad, $d->actividadid, $d->modalidad, $d->modalidadid,  null,  null, true, $newTerms1711);

    return $t1 . "\r\n" . $tituloColocacion . $empleador . $dniEmpleador . $telefono . $whatsApp . $direccion . $referencia . $mapa . $fechaIngreso . $constanciaColocacion . "\r\n"  .  $tituloRequerimiento . $detallesReq . "\r\n" . "\r\n" . $t2 . "\r\n" . "\r\n" . $t3;
}

function formatSelectPostulantes($data){
    $result = [];

    if($data){

        foreach ($data as $d) {

            $result[] = [
                'label' => ((($d->nombres . ' ' .$d->apellidos))),
                'value' => $d->id
            ];
        }
    }

    return $result;
}

function postulanteSelectedFormat($post){
    $result = '';

    if($post){
        $result = [
            'label' => ((($post->nombres . ' ' . $post->apellidos))),
            'value' => $post->id
        ];
    }

    return $result;
}
