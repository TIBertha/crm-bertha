<?php

use Illuminate\Support\Facades\Auth;
use App\Models\Contrato;
use App\Models\Trabajador;
use App\Models\Empleador;
use App\Models\Requerimiento;

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

function getDataNueva($meses)
{
    $dataNueva = [];

    foreach ($meses as $m) {

        $year  = $m->year;
        $month = str_pad($m->month, 2, '0', STR_PAD_LEFT);
        $nombreMes = ucwords(strtolower(getMonthName($month))) . ' ' . $year;

        $fechaInicio = $year . '-' . $month . '-01 00:00:00';
        $fechaFin    = date('Y-m-t 23:59:59', strtotime($fechaInicio));

        // ============================
        // 1. TRABAJADORES
        // ============================
        $trabajadoresQuery = Trabajador::whereBetween('creado', [$fechaInicio, $fechaFin]);

        $totalTrab = $trabajadoresQuery->count();

        $trabSinContrato = Trabajador::whereBetween('creado', [$fechaInicio, $fechaFin])
            ->whereDoesntHave('contratos')
            ->count();

        $dataTrabajadores = [
            'total'             => $totalTrab,
            'totalSinContratos' => $trabSinContrato,
            'totalConContratos' => $totalTrab - $trabSinContrato,
        ];

        // ============================
        // 2. EMPLEADORES
        // ============================
        $empleadoresQuery = Empleador::whereBetween('creado', [$fechaInicio, $fechaFin]);

        $totalEmp = $empleadoresQuery->count();

        $empSinContrato = Empleador::whereBetween('creado', [$fechaInicio, $fechaFin])
            ->whereDoesntHave('contratos')
            ->count();

        $dataEmpleadores = [
            'total'             => $totalEmp,
            'totalSinContratos' => $empSinContrato,
            'totalConContratos' => $totalEmp - $empSinContrato,
        ];

        // ============================
        // 3. REQUERIMIENTOS
        // ============================
        $requerimientosQuery = Requerimiento::whereBetween('creado', [$fechaInicio, $fechaFin]);

        $totalReq = $requerimientosQuery->count();

        $reqSinContrato = Requerimiento::whereBetween('creado', [$fechaInicio, $fechaFin])
            ->whereDoesntHave('contratos')
            ->count();

        $dataRequerimiento = [
            'total'             => $totalReq,
            'totalSinContratos' => $reqSinContrato,
            'totalConContratos' => $totalReq - $reqSinContrato,
        ];

        // ============================
        // 4. CONTRATOS
        // ============================
        $contratosQuery = Contrato::whereBetween('creado', [$fechaInicio, $fechaFin]);

        $dataContratos = [
            'total'      => $contratosQuery->count(),
            'apertura'   => Contrato::whereBetween('creado', [$fechaInicio, $fechaFin])->where('tipocontrato_id', 1)->count(),
            'reposicion' => Contrato::whereBetween('creado', [$fechaInicio, $fechaFin])->where('tipocontrato_id', 2)->count(),
            'cambio'     => Contrato::whereBetween('creado', [$fechaInicio, $fechaFin])->where('tipocontrato_id', 3)->count(),

            'totalComision2' => Contrato::whereBetween('creado', [$fechaInicio, $fechaFin])
                ->whereHas('requerimiento', fn($q) => $q->where('tipocomision', 2))
                ->count(),

            'totalComision3' => Contrato::whereBetween('creado', [$fechaInicio, $fechaFin])
                ->whereHas('requerimiento', fn($q) => $q->where('tipocomision', 3))
                ->count(),
        ];

        // ============================
        // ARMAR RESPUESTA
        // ============================
        $dataNueva[] = [
            'nombreMes'     => $nombreMes,
            'mes'           => $month,
            'trabajadores'  => $dataTrabajadores,
            'empleadores'   => $dataEmpleadores,
            'requerimientos'=> $dataRequerimiento,
            'contratos'     => $dataContratos,
        ];
    }

    return $dataNueva;
}

function getUsuariosInternos(){

    $data = \App\Models\UsuarioInterno::orderBy('creado', 'asc')->get();

    return $data;
}
