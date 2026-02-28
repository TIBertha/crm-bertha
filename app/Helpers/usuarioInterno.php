<?php

use Illuminate\Support\Facades\Auth;

function getAccessFunctions($list = null){

    $usuarioInterno = Auth::user()->id;
    $allowedUsers = $list ? $list : [3,5];

    if (in_array($usuarioInterno, $allowedUsers)){
        $result = true;
    }else{
        $result = false;
    }

    return $result;
}

function getDataNueva($meses){

    $dataNueva = [];

    foreach ($meses as $m){
        $year  = $m->year;
        $month = str_pad($m->month, 2, '0', STR_PAD_LEFT);
        $nombreMes = ucwords(strtolower(getMonthName($month))).' '.$year;
        $fechaInicio = new DateTime($year.'-'.$month.'-01');
        $fechaFin = new DateTime($fechaInicio->format('Y-m-t 23:59:59'));

        $trabajadores = \App\Models\Views\TrabajadorView::where('creado', '>=',$fechaInicio)->where('creado','<=',$fechaFin);
        $empleadores = \App\Models\Views\EmpleadorView::where('creado', '>=',$fechaInicio)->where('creado','<=',$fechaFin);
        $requerimientos = \App\Models\Views\RequerimientoView::where('creado', '>=',$fechaInicio)->where('creado','<=',$fechaFin);
        $contratos = \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin);

        $dataContratos = [
            'total'                     => $contratos->count(),
            'apertura'                  => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocontratoid',1)->count(),
            'reposicion'                => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocontratoid',2)->count(),
            'cambio'                    => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocontratoid',3)->count(),
            'totalComision1'            => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocomision_req',1)->count(),
            'totalComision2'            => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocomision_req',2)->count(),
            'totalComision3'            => \App\Models\Views\ContratoView::where('creadooriginal', '>=',$fechaInicio)->where('creadooriginal','<=',$fechaFin)->where('tipocomision_req',3)->count(),
        ];

        $idReqs = [];

        foreach ($requerimientos->get() as $req){
            $findContrato = \App\Models\Contrato::where('requerimiento_id', $req->id)->first();

            if (!($findContrato)){
                array_push($idReqs, $req->id);
            }
        }

        $dataRequerimiento = [
            'total'                     => $requerimientos->count(),
            'totalSinContratos'         => count($idReqs),
            //'sinContratos'              => $idReqs,
            'totalConContratos'         => $requerimientos->count() - count($idReqs)
        ];

        $idTrab = [];

        foreach ($trabajadores->get() as $trab){
            $findContrato = \App\Models\Contrato::where('trabajador_id', $trab->id)->first();

            if (!($findContrato)){
                array_push($idTrab, $trab->id);
            }
        }

        $dataTrabajadores = [
            'total'                     => $trabajadores->count(),
            'totalSinContratos'         => count($idTrab),
            //'sinContratos'              => $idTrab,
            'totalConContratos'         => $trabajadores->count() - count($idTrab)
        ];

        $idEmp = [];

        foreach ($empleadores->get() as $emp){
            $findContrato = \App\Models\Contrato::where('empleador_id', $emp->id)->first();

            if (!($findContrato)){
                array_push($idEmp, $emp->id);
            }
        }

        $dataEmpleadores = [
            'total'                     => $empleadores->count(),
            'totalSinContratos'         => count($idEmp),
            'totalConContratos'         => $empleadores->count() - count($idEmp)
        ];

        $dataNueva[] = [
            'nombreMes'                         => $nombreMes,
            'mes'                               => $month,
            'trabajadores'                      => $dataTrabajadores,
            'empleadores'                       => $dataEmpleadores,
            'requerimientos'                    => $dataRequerimiento,
            'contratos'                         => $dataContratos,
        ];

    }

    return $dataNueva;
}

function getUsuariosInternos(){

    $data = \App\Models\UsuarioInterno::orderBy('creado', 'asc')->get();

    return $data;
}
