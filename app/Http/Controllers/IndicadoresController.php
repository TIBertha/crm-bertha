<?php

namespace App\Http\Controllers;

use App\Models\Beneficio;
use App\Models\Contrato;
use App\Models\DiaTrabajado;
use App\Models\Requerimiento;
use App\Models\TransaccionBaja;
use Carbon\Carbon;
use Illuminate\Http\Request;
use \App\Models\VistasWeb;

class IndicadoresController extends Controller
{

    private $mesActual;
    private $mesPasado;
    private $mesAntePrevio;
    private $yearActual;
    private $yearPasado;
    private $yearAntePrevio;

    public function __construct()
    {

        $now = \Carbon\Carbon::now();
        $dia = $now->day;

        if($dia == 31){
            $now2 = \Carbon\Carbon::now()->subMonth(1)->subDays(1);
            $now3 = \Carbon\Carbon::now()->subMonth(2)->subDays(1);
        }else{
            $now2 = \Carbon\Carbon::now()->subMonth(1);
            $now3 = \Carbon\Carbon::now()->subMonth(2);
        }

        $this->mesActual = $now->month;
        $this->yearActual = $now->year;

        $this->mesPasado = ($now->month - 1);
        $this->yearPasado = $now2->year;

        $this->mesAntePrevio = ($now->month - 2);
        $this->yearAntePrevio = $now3->year;

    }

    public function index(){

        return view('Indicadores.index');

    }

    public function ajaxGetIndicadores()
    {
        $fechas = $this->getDates(5);

        // Rango total (desde el mes más antiguo hasta hoy)
        $fechaInicio = $fechas[count($fechas)-1]->copy()->startOfMonth();
        $fechaFin    = $fechas[0]->copy()->endOfMonth();

        // ============================
        // 1. CONSULTAS AGRUPADAS
        // ============================

        $sanciones = TransaccionBaja::borrado(false)
            ->whereBetween('fecha_pago_monto', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(fecha_pago_monto) as y, MONTH(fecha_pago_monto) as m, SUM(monto_pagado) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        $liquidaciones = Beneficio::whereBetween('fecha_pago_monto', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(fecha_pago_monto) as y, MONTH(fecha_pago_monto) as m, SUM(monto_pagado) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        $adelantos = Requerimiento::borrado(false)
            ->where('total_contratos', 0)
            ->whereBetween('fecha_pago_adelanto', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(fecha_pago_adelanto) as y, MONTH(fecha_pago_adelanto) as m, SUM(monto_adelanto) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        $tiempoCompleto = Contrato::borrado(false)
            ->whereBetween('creado', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(creado) as y, MONTH(creado) as m, SUM(monto_total_contrato) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        $tiempoCompletoAnulados = Contrato::borrado(false)
            ->where('anulado', true)
            ->whereBetween('creado', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(creado) as y, MONTH(creado) as m, SUM(montoanulacion) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        $diasTrabajados = DiaTrabajado::borrado(false)
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->selectRaw('YEAR(fecha) as y, MONTH(fecha) as m, SUM(descuento) as total')
            ->groupBy('y','m')
            ->get()
            ->keyBy(fn($i) => $i->y.'-'.$i->m);

        // ============================
        // 2. ARMAR INDICADORES
        // ============================

        $indicadores = [];

        foreach ($fechas as $f) {
            $key = $f->year.'-'.$f->month;

            $pagoSanciones     = $sanciones[$key]->total ?? 0;
            $pagoLiquidaciones = $liquidaciones[$key]->total ?? 0;
            $pagoAdelantos     = $adelantos[$key]->total ?? 0;
            $pagoTiempoCompleto = ($tiempoCompleto[$key]->total ?? 0) - ($tiempoCompletoAnulados[$key]->total ?? 0);
            $pagoDiasTrabajados = $diasTrabajados[$key]->total ?? 0;

            $total = $pagoSanciones + $pagoLiquidaciones + $pagoAdelantos + $pagoTiempoCompleto + $pagoDiasTrabajados;

            $indicadores[] = [
                'mes'              => $this->getNameMonth($f->year, $f->month),
                'pagoLiquidaciones'=> formatMoney($pagoLiquidaciones),
                'pagosanciones'    => formatMoney($pagoSanciones),
                'tiempocompleto'   => formatMoney($pagoTiempoCompleto),
                'adelantos'        => formatMoney($pagoAdelantos),
                'diastrabajados'   => formatMoney($pagoDiasTrabajados),
                'total'            => formatMoney($total),
            ];
        }

        // ============================
        // 3. VISTAS WEB (esto está bien)
        // ============================

        /*$vistasWeb = VistasWeb::orderBy('orden')->get()->map(function($v){
            return [
                'id'         => $v->id,
                'url_name'   => $v->url_pathname,
                'num_vistas' => number_format($v->num_vistas, 0, ".", ","),
                'ult_vista'  => $v->actualizado ? date('m/d/Y H:i:s', strtotime($v->actualizado)) : 'SIN VISITAS'
            ];
        });*/

        return response()->json([
            'code'        => 200,
            'indicadores' => $indicadores,
            //'vistasWeb'   => $vistasWeb,
            'accessCom'   => getAccessFunctions(),
            'dataNueva'   => getDataNueva($fechas),
        ]);
    }


    public function getDates($cantidadMeses = 1){

        $result = [];

        for ($ie = 0; $ie < $cantidadMeses; $ie++) {

            $fecha = Carbon::today()->startOfMonth()->subMonth($ie);

            $result[] = $fecha;

        }

        return $result;

    }

    public function getNameMonth($year, $month){

        return ucwords(strtolower(getMonthName($month))).' '.$year;
    }

    public function calculoPagoSanciones($year, $month){

        $sanciones = TransaccionBaja::borrado(false)->whereMonth('fecha_pago_monto', $month)->whereYear('fecha_pago_monto', $year)->sum('monto_pagado');

        return $sanciones ? $sanciones : 0;

    }

    public function calculoAdelantos($year, $month){

        $adelantos = Requerimiento::borrado(false)->whereMonth('fecha_pago_adelanto', $month)->whereYear('fecha_pago_adelanto', $year)->where('total_contratos', 0)->sum('monto_adelanto');

        return $adelantos ? ($adelantos) : 0;

    }

    public function calculoLiquidaciones($year, $month){

        $adelantos = Beneficio::whereMonth('fecha_pago_monto', $month)->whereYear('fecha_pago_monto', $year)->sum('monto_pagado');

        return $adelantos ? ($adelantos) : 0;

    }

    public function calculoTiempoCompleto($year, $month){

        $contratos = Contrato::borrado(false)->whereMonth('creado', $month)->whereYear('creado', $year)->sum('monto_total_contrato');
        $contratosAnulacionDevolucion = Contrato::borrado(false)->where('anulado', true)->whereMonth('creado', $month)->whereYear('creado', $year)->sum('montoanulacion');

        $subMontoTiempoCompletoActual = ($contratos ? $contratos : 0) - ($contratosAnulacionDevolucion ? $contratosAnulacionDevolucion : 0);

        return $subMontoTiempoCompletoActual ? $subMontoTiempoCompletoActual : 0;

    }

    public function calculoDiasTrabajados($year, $month){

        $diastrabajados = DiaTrabajado::borrado(false)->whereMonth('fecha', $month)->whereYear('fecha', $year)->sum('descuento');
        return $diastrabajados ? ($diastrabajados) : 0;

    }
}
