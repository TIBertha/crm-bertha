<?php

use Carbon\Carbon;

function getDataFicha($id, $restringida = false, $descanso = false, $fechaContrato = null, $antecedentesLimpios = false, $camesFromContrato = false){

    $data = \App\Models\Views\TrabajadorView::find($id);
    $check = verificacionDocumentosPostulante($data);
    //$ant = ShowDataAntecedente($id);

    if($restringida){
        $nDocumento = restringirInformacion($data->numero_documento);
        $formatedNombrePostulante = $data->nombres . ' ' . restringirInformacion($data->apellidos);
        $formatedDireccionPostulante = restringirTexto($data->direccion);
        $formatedCelular = restringirInformacion($data->telefono);
        $formatedCelularWhatsapp = restringirInformacion($data->telefono_whatsapp);

    }else{
        $nDocumento = $data->numero_documento;
        $formatedNombrePostulante = $data->nombres . ' ' . $data->apellidos;
        $formatedDireccionPostulante = $data->direccion;
        $formatedCelular = formatInternationalNumber($data->telefono);
        $formatedCelularWhatsapp = formatInternationalNumber($data->telefono_whatsapp);
    }

    if ($descanso){
        $tiempodescanso = in_array($descanso, [1]) ? false : true;
    }else{
        $tiempodescanso = null;
    }

    $whatShow = '';

    if ($data->adjunto_cartilla_vacuna){
        $whatShow = 'cartilla';
    }else{
        if ($data->tuvo_covid){
            $whatShow = 'prueba';
        }
    }

    //$isPendienteAntecedentes = findAntecedentesPendientes($data->id);
    $fecha = formatFecha(Carbon::now());

    $distritoView = \App\Models\Views\DistritoView::find($data->distrito_id);

    $vacunas = $data->tiene_vacuna ? (int)$data->tiene_vacuna : 0;
    $tieneVacunas = 'CERO';

    if($vacunas == 1){
        $tieneVacunas = 'UNA';
    }else if($vacunas == 2){
        $tieneVacunas = 'DOS';
    }else if($vacunas == 3){
        $tieneVacunas = 'TRES';
    }else if($vacunas == 4){
        $tieneVacunas = 'CUATRO';
    }else if($vacunas == 5){
        $tieneVacunas = 'CINCO';
    }

    $tra = [
        'title'                    =>      setTitlePdf($data->nombres, $restringida ? 'R' : $data->apellidos, 'ficha'),
        'newTerms1711'             =>      isNewTerms1711($data->creado),
        'adjuntoCartillaVacuna'    =>      $data->adjunto_cartilla_vacuna,
        'whatShow'                 =>      $whatShow,
        'id'                       =>      $data->id,
        'ca'                       =>      $data->cama_adentro,
        'cf'                       =>      $data->cama_afuera,
        'ph'                       =>      $data->por_horas,
        'telefono'                 =>      $formatedCelular,
        'telefono_whatsapp'        =>      $formatedCelularWhatsapp,
        'modalidad'                =>      $data->modalidad_id,
        'nombres'                  =>      $formatedNombrePostulante,
        'nombreapellido'           =>      $formatedNombrePostulante,
        'genero'                   =>      $data->genero_id ? $data->genero : ' ',
        'estadocivil'              =>      $data->estadocivil_id ? $data->estadocivil : ' ',
        'tipodocumentoid'          =>      $data->tipodocumento_id ? $data->tipodocumento_id : null,
        'tipodocumento'            =>      $data->tipodocumento_id ? $data->tipodocumento : " ",
        'numerodocumento'          =>      $nDocumento,
        'paisnacionalidad'         =>      $data->pais_id,
        'pais'                     =>      $data->pais_id ? $data->pais : ' ',
        'domiciliodeclaracion'     =>      $formatedDireccionPostulante . ', ' . $distritoView->distritoscinco,
        'fechanacimiento'          =>      Carbon::parse($data->fecha_nacimiento)->format('d/m/Y'),
        'nacionalidadficha'        =>      $data->nacionalidad,
        'nacionalidaddeclaracion'  =>      $data->genero_id ? $data->nacionalidad : null,
        'departamentonacimiento'   =>      $data->pais_id == 54 ? $data->departamentonacimiento : $data->lugarnacimiento,
        'direccion'                =>      $formatedDireccionPostulante,
        'actividades'              =>      showActividades($data->actividad_id, $data->postulando_pais_id),
        'tiposervicio'             =>      showTiposModalidades($data->cama_adentro, $data->cama_afuera, $data->por_horas, $data->postulando_pais_id),
        'checkdocumentoidentidad'  =>      $check['documentoidentidad'],
        //'checkantecedentes'        =>      $check['antecedentes'],
        'checkcertiadulto'         =>      $check['certiadulto'],
        'camesFromContrato'        =>      $camesFromContrato,
        'checkreportepsicologico'  =>      $check['reportepsicologico'],
        'checkcompromiso'          =>      $check['actacompromiso'],
        'checkdeclaracioncovid19'  =>      $check['declaracioncovid19'],
        'checkcartillavacuna'      =>      $check['cartillavacuna'],
        'checkdeclaracionjurada'   =>      $check['declaracionjurada'],
        'checkrecibo'              =>      $check['reciboservicio'],
        'checkrecomendaciones'     =>      $check['recomendaciones'],
        'checkverificacioneslaborales' =>  $check['verificaciones_laborales'],
        'checkeducacion'           =>      $check['certificados'],
        'verificaciones'           =>      showVerificaciones($data->verificaciones_laborales, $restringida),
        'firma'                    =>      empty($data->firma) ? null : $data->firma,
        'nombre_apoderado'         =>      $data->nombre_apoderado,
        'documento_apoderado'      =>      $data->documento_apoderado,
        'firma_apoderado'          =>      $data->firma_apoderado,
        'foto'                     =>      verifyS3Photo($data->foto),
        'ajunto_covid'             =>      $data->adjunto_prueba_covid,
        'ajunto_informe_covid'     =>      $data->adjunto_informe_covid,
        'foto_documento_delantera' =>      $data->foto_documento_delantera,
        'foto_documento_posterior' =>      $data->foto_documento_posterior,
        //'isPendienteAntecedentes'  =>      $isPendienteAntecedentes,
        //'antecedente'              =>      $ant,
        //'cant_ant_pol'             =>      $ant ? count($ant['policiales']) : null,
        //'cant_ant_jud'             =>      $ant ? count($ant['judiciales']) : null,
        //'cant_ant_pen'             =>      $ant ? count($ant['penales']) : null,
        'recibos'                  =>      $data->recibos,
        'recomendaciones'          =>      getRecomendacionesUrl($data->verificaciones_laborales),
        'educacion'                =>      showEducacion($data->adjunto_educacion, $restringida),
        'isnewpageestudio'         =>      isNewPageSeccionEstudio($data->adjunto_educacion, $data->verificaciones_laborales, $check),
        'chofer'                   =>      $data->chofer,
        'licencia_delantera'       =>      $data->foto_licencia_delantera,
        'licencia_trasera'         =>      $data->foto_licencia_trasera,
        'edadpostulante'           =>      getAge($data->fecha_nacimiento),
        'diaregistro'              =>      Carbon::now()->format('d'),
        'mesregistro'              =>      mb_convert_case($fecha['nombreMes'], MB_CASE_TITLE, "UTF-8"),
        'anioregistro'             =>      Carbon::now()->format('Y'),
        'restringida'              =>      $restringida,
        'tiempodescanso'           =>      $tiempodescanso,
        'cuarentenaFicha'          =>      verifyFechaRegistro(Carbon::parse($data->creado)),
        'resultado_covid'          =>      $data->resultado_covid,
        'tuvo_covid'               =>      $data->tuvo_covid,
        'tienevacunas'             =>      $tieneVacunas,
        'numero_hijos'             =>      $restringida ? null : $data->numero_hijos,
        'certificado_antecedente'  =>      $data->certificado_antecedente,
        'video_introduccion_youtube' =>    $data->video_introduccion_youtube ? $data->video_introduccion_youtube : null,
        'idiomas'                  =>      showIdiomas($data->idioma_id, ', '),
        'contactos'                =>      showContactoEmergencia($data->contactos),
        'fechaContrato'            =>      $fechaContrato,
        'antecedentesLimpios'      =>      $antecedentesLimpios,
        'fechaHoy'                 =>      Carbon::now()->format('d/m/Y'),
    ];

    return $tra;
}
