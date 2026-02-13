<?php

use Jenssegers\Agent\Agent;

function logActivity($logdescripcion_id, $table, $id, $latitud = null, $longitud = null)
{
    /*$agent = new Agent();

    return \App\Models\LogActivity::create([
        'usuariointerno_id'     => Auth::user()->id,
        'logdescripcion_id'     => $logdescripcion_id,
        'metodo'                => formatText(request()->method()),
        'ruta'                  => request()->path(),
        'table'                 => $table,
        'entidad'               => $id,
        'dispositivo'           => $agent->isDesktop() ? 'DESKTOP' : ( $agent->isMobile() ? 'MOBILE' : 'TABLET' ),
        'plataforma'            => $agent->platform(),
        'ip'                    => request()->getClientIp(),
        'latitud'               => $latitud,
        'longitud'              => $longitud
    ]);*/
}