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
            
            /*-MEJORAR TIEMPO DE CARGA-*/$postulaciones = RequerimientoPostulacionView::where('trabajador_id', $d->id)->where('fechaentrevistaformat', '>=', $fechaHoy )->get();
            

            $diasTrabajoPorDias = null;

            if ($d->estatus_por_dias == 1){
                $findContratosDias = \App\Models\Views\ContratoView::where('trabajadorid', $d->id)->where('culminado',false);

                $diasTrabajoPorDias = $findContratosDias->count() > 0 ? getDiasTrabajoPD($findContratosDias->get()) : null;
            }
            $distrito = DistritoView::find($d->distrito_id);
            $estatusAnterior = getEstatusAnterior($d->id, $d->estadoid);
            $nullFoto = asset('img/user_icon.svg');
            $n = explode(" ", $d->nombres);
            $daysPast = $d->certificado_antecedente_fecha ? getDaysPast($d->certificado_antecedente_fecha) : null;

            $result[] = [
                'tiene_antecedentes'         => $d->antecedente_pdf ? true : false,
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
                //BORRAR'antecedente'                => checkAntecedente($d->id),
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
                'tuvo_covid'                 => $d->tuvo_covid ? $d->tuvo_covid : null,
                'estatus_por_dias'           => $d->estatus_por_dias,
                'dias_contratados_por_dias'  => $diasTrabajoPorDias,
                'estatus_anterior'           => $estatusAnterior,
                'tiene_vacuna'               => $d->tiene_vacuna,
                'cartilla_verificada'        => $d->cartilla_verificada ? boolval($d->cartilla_verificada) : false,
                'adjunto_cartilla'           => ($d->adjunto_cartilla_vacuna || $d->adjunto_cartilla_vacuna_pdf) ? 'SI' : 'NO',
                'nodisponible'               => $d->nodisponible,
                //IMPORTANT'postulaciones'              => getDataPostulacion($postulaciones),
                //IMPORTANT'totalPostulaciones'         => $postulaciones ? count(getDataPostulacion($postulaciones)) : 0,
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