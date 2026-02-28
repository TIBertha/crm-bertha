<?php



use Carbon\Carbon;
function calculateDaysBetweenDates($fechainicial, $fechafinal){

    $newFechaFinal = Carbon::parse($fechafinal);

    $diff = $newFechaFinal->diff($fechainicial);

    $year = $diff->y /** 360*/;
    $month = $diff->m /** 30*/;
    $days = $diff->d;

    $data = [
        'years'     => ($year . ($year != 1 ? ' años' : ' año')),
        'months'    => ($month . ($month != 1 ? ' meses' : ' mes')),
        'days'      => ($days . ($days != 1 ? ' días' : ' día')),
    ];

    $result = ($year ? $data['years'] : null) .  (($year) ? ', ' : null) . ($month ? $data['months'] : null) . (($days) ? ' y ' : null) . ($days ? $data['days'] : null) . '.';
    //return $year + $month + $days ;

    return $result;
}

function getDaysByMonth($start, $end){

    $startDate = $start;
    $endDate = $end;
    $varDate = $startDate;

    $result = [];

    while($varDate <= $endDate){
        $d = date('d', strtotime($varDate));
        $dE = date('d', strtotime($endDate));
        $Y = date('Y', strtotime($varDate));
        $m = date('m', strtotime($varDate));
        $days = 30;

        $time = strtotime($varDate);

        if($varDate == $startDate){

            $time = strtotime(date('Y-m-01', $time));
            //dd($days, $d, $dE);
            $days = ($days - $d) + 1;

        }else if(date("Y-m", strtotime($varDate)) == date("Y-m", strtotime($endDate))){
            $days = date("j", strtotime($endDate)) == 31 ? 30 : date("j", strtotime($endDate));
        }

        $result[date('Y-m', strtotime($varDate))] = (int)$days;
        //echo date('Y-m', strtotime($varDate)). ": ".$days."<br>";
        $varDate = date('Y-m-d', strtotime("+1 month", $time));
    }

    return $result;

}

function getYears($fechainicio, $fechafin){

    $start    = $fechainicio;
    $end      = $fechafin;
    return $getRangeYear = range(   gmdate('Y', strtotime($start)), gmdate('Y', strtotime($end))   );

}

function cacluloFiestasPatrias($fechainicio, $fechafin, $sueldo, $version){

    $result = [];

    $newFechaInicio = Carbon::parse($fechainicio);
    $newFechafin = Carbon::parse($fechafin);

    $start = $newFechaInicio->format('Y-m-d');
    if (in_array($newFechaInicio->format('m-d'), ["01-02", "05-02"])){
        $start = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $newFechaInicio) ) ));
        //dd($start);
    }
    //dd($start);
    $end   = $newFechafin->format('Y-m-d');

    $diasbymes = getDaysByMonth($start, $end);
    $years = getYears($start, $end);

    foreach ($years as $y){

        $sum = 0;
        $flagStart = '';
        $flagEnd = '';

        foreach ($diasbymes as $key => $value){

            if((string)$y.'-01' == $key){
                $sum+=$value;
                //$flagStart = $value == 30 ? '01/01/'.$y : $fechainicio->format('d/m/Y');
                $flagStart = $value == 30 ? 'Enero - '.$y : 'Febrero - '.$y;
                //$flagEnd = $value == 30 ? '30/01/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/01/'.$y;
                $flagEnd = $value == 30 ? 'Enero - '.$y : 'Enero - '.$y;
            }

            if((string)$y.'-02' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/02/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Febrero - '.$y : 'Marzo - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/02/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/02/'.$y;
                $flagEnd = $value == 30 ? 'Febrero - '.$y : 'Enero - '.$y;
            }

            if((string)$y.'-03' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/03/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Marzo - '.$y : 'Abril - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/03/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/03/'.$y;
                $flagEnd = $value == 30 ? 'Marzo - '.$y : 'Febrero - '.$y;
            }

            if((string)$y.'-04' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/04/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Abril - '.$y : 'Mayo - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/04/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/04/'.$y;
                $flagEnd = $value == 30 ? 'Abril - '.$y : 'Marzo - '.$y;
            }

            if((string)$y.'-05' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/05/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Mayo - '.$y : 'Junio - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/05/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/05/'.$y;
                $flagEnd = $value == 30 ? 'Mayo - '.$y : 'Abril - '.$y;
            }

            if((string)$y.'-06' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/06/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Junio - '.$y : 'Junio - '.$y;
                }
                $lastDay = ($newFechafin->day + $value);
                //$flagEnd = $value == 30 ? '30/06/'.$y : str_pad(($lastDay - 1), 2, 0, STR_PAD_LEFT).'/06/'.$y;
                $flagEnd = $value == 30 ? 'Junio - '.$y : 'Mayo - '.$y;
            }
        }

        //$total = ($sum >= 30 ? (float)($sueldo / 180 * $sum) : 0);
        $total = ($sum >= 30 ? (float)($sueldo / 6 * floor($sum / 30)) : 0);

        if($sum != 0){
            $result[] = [
                'ano' => $y,
                'dias' => $sum == 0 ? 'NO' : $sum,
                'meses' => $sum == 0 ? 'NO' : floor($sum / 30),
                'total' => ($version == 'antigua' ? round(($total / 2), 2) : round($total, 2)),
                'fechaingreso' => $sum == 180 ? '01/01/'.$y : '',
                'fechacese' => $sum == 180 ? '30/06/'.$y : '',
                //'start' => $sum == 0 ? $newFechafin->format('d/m/Y') : $flagStart,
                //'end' => $sum == 0 ? '30/06/'.$y : $flagEnd,
                'start' => $sum == 0 ? $newFechafin->format('d/m/Y') : $flagStart,
                'end' => $sum == 0 ? 'JUN/' . $y : $flagEnd,
            ];
        }
    }

    $totalfiestas = 0;
    $diasGratificaciones = 0;

    foreach($result as $item) {

        $totalfiestas = $totalfiestas + $item['total'];
        $diasGratificaciones = $diasGratificaciones + $item['dias'];
    }


    return ['total' => ($totalfiestas), 'registros' => $result, 'diasFiestas' => $diasGratificaciones];

}

function cacluloNavidad($fechainicio, $fechafin, $sueldo, $version){

    $result = [];

    $newFechaInicio = Carbon::parse($fechainicio);
    $newFechafin = Carbon::parse($fechafin);

    $start = $newFechaInicio->format('Y-m-d');
    if (in_array($newFechaInicio->format('m-d'), ["11-02"])){
        $start = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $newFechaInicio) ) ));
        //dd($start);
    }
    //dd($start);
    $end   = $newFechafin->format('Y-m-d');

    $diasbymes = getDaysByMonth($start, $end);
    $years = getYears($start, $end);

    foreach ($years as $y){

        $sum = 0;
        $flagStart = '';
        $flagEnd = '';

        foreach ($diasbymes as $key => $value){

            if((string)$y.'-07' == $key){
                $sum+=$value;
                //$flagStart = $value == 30 ? '01/07/'.$y : $fechainicio->format('d/m/Y');
                $flagStart = $value == 30 ? 'Julio - '.$y : 'Agosto - '.$y;
                //$flagEnd = $value == 30 ? '30/07/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/07/'.$y;
                $flagEnd = $value == 30 ? 'Julio - '.$y : 'Julio - '.$y;
            }

            if((string)$y.'-08' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/08/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Agosto - '.$y : 'Septiembre - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/08/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/08/'.$y;
                $flagEnd = $value == 30 ? 'Agosto - '.$y : 'Julio - '.$y;
            }

            if((string)$y.'-09' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/09/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Septiembre - '.$y : 'Octubre - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/09/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/09/'.$y;
                $flagEnd = $value == 30 ? 'Septiembre - '.$y : 'Agosto - '.$y;
            }

            if((string)$y.'-10' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/10/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Octubre - '.$y : 'Noviembre - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/10/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/10/'.$y;
                $flagEnd = $value == 30 ? 'Octubre - '.$y : 'Septiembre - '.$y;
            }

            if((string)$y.'-11' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/11/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Noviembre - '.$y : 'Diciembre - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/11/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/11/'.$y;
                $flagEnd = $value == 30 ? 'Noviembre - '.$y : 'Octubre - '.$y;
            }

            if((string)$y.'-12' == $key){
                $sum+=$value;
                if(!$flagStart){
                    //$flagStart = $value == 30 ? '01/12/'.$y : $fechainicio->format('d/m/Y');
                    $flagStart = $value == 30 ? 'Diciembre - '.$y : 'Diciembre - '.$y;
                }
                //$flagEnd = $value == 30 ? '30/12/'.$y : str_pad($value, 2, 0, STR_PAD_LEFT).'/12/'.$y;
                $flagEnd = $value == 30 ? 'Diciembre - '.$y : 'Noviembre - '.$y;
            }
        }

        //$total = $sum >= 30 ? (float)($sueldo / 180 * $sum) : 0;
        $total = ($sum >= 30 ? (float)($sueldo / 6 * floor($sum / 30)) : 0);

        if($sum != 0){
            $result[] = [
                'ano' => $y,
                'dias' => $sum == 0 ? 'NO' : ($sum),
                'meses' => $sum == 0 ? 'NO' : floor($sum / 30),
                'total' => ($version == 'antigua' ? round(($total / 2), 2) : round($total, 2)),
                'fechaingreso' => $sum == 180 ? '01/07/'.$y : '',
                'fechacese' => $sum == 180 ? '30/12/'.$y : '',
                //'start' => $sum == 0 ? $newFechaInicio->format('d/m/Y') : $flagStart,
                //'end' => $sum == 0 ? '30/12/'.$y : $flagEnd,
                'start' => $sum == 0 ? $newFechaInicio->format('m/Y') : $flagStart,
                'end' => $sum == 0 ? 'DIC-'.$y : $flagEnd,
            ];
        }
    }

    $totalfiestas = 0;
    $diasGratificaciones = 0;

    foreach($result as $item) {
        $totalfiestas = $totalfiestas + $item['total'];
        $diasGratificaciones = $diasGratificaciones + $item['dias'];
    }
    return ['total' => ($totalfiestas), 'registros' => $result , 'diasNavidad' => $diasGratificaciones];
}

function calculateNumberYears($fechainicial, $fechafinal){

    $newFechaInicio = Carbon::parse($fechainicial);
    $newFechaFinal = Carbon::parse($fechafinal);

    $diff = $newFechaFinal->diff($newFechaInicio);

    $diasrestantes = $diff->d;
    $totalanios= $diff->y;

    if ($diasrestantes != 0 ){
        $totalanios = $totalanios + 1;
    }else{
        $totalanios = $totalanios;
    }
    return ['anios' => $totalanios, 'diasRestantes' => $diasrestantes ] ;
}

function diff360($fechaI, $fechaF){
    $fecha1 = new DateTime($fechaI);
    $fecha2 = new DateTime($fechaF);
    $diff = $fecha1->diff($fecha2);
    $dias = ($fecha2->format('d') + 30 - $fecha1->format('d')) % 30;

    $result = $diff->y * 360 + $diff->m * 30 + $dias;

    return $result;
}

function calculoCTSNuevo($fechainicio, $fechafin, $sueldo, $version){

    $result = [];

    $newFechaInicio = Carbon::parse($fechainicio);
    $newFechaFinal = Carbon::parse($fechafin);

    $start = $newFechaInicio->format('Y-m-d');
    $startYear = $newFechaInicio->format('Y');
    $end = $newFechaFinal->format('Y-m-d');
    $endYear = $newFechaFinal->format('Y');
    $diff = $newFechaInicio->diff($newFechaFinal);
    $diasrestantes = $diff->d;
    $total = calculateNumberYears($newFechaInicio,$newFechaFinal);
    $totalYears = bcdiv($diff->days , 365 , 2);

    $flag = '';
    $flagInter = 1;

    $totalPago = 0;

    $whole = floor($totalYears);
    $fraction = $totalYears - $whole;

    //dd((int)($totalYears), $fraction, $whole);

    for ($i = 1; $i <= (int)ceil($totalYears); $i++){

        //echo var_dump($flagInter, (int)ceil($totalYears));
        if($flag){
            if($flagInter == (int)ceil($totalYears)){
                $fechaDeInicio = $flag->addDays(1);
                $fechaDeFin = $fraction == 0 ? Carbon::parse($fechaDeInicio)->addYear()->subDays(1) : Carbon::parse($newFechaFinal) ;
                $dias = diff360($fechaDeInicio,$fechaDeFin)+1;
            }else{
                $fechaDeInicio = $flag->addDays(1);
                $fechaDeFin = Carbon::parse($flag)->addYear()->subDays(1);
                $dias = diff360($fechaDeInicio,$fechaDeFin)+1;
            }
        }else{
            $fechaDeInicio = $newFechaInicio;
            $fechaDeFin = (int)($totalYears) >= 1 ? Carbon::parse($fechaDeInicio)->addYear() : Carbon::parse($newFechaFinal) ;
            $dias = diff360($fechaDeInicio,$fechaDeFin)==360 ? diff360($fechaDeInicio,$fechaDeFin) : diff360($fechaDeInicio,$fechaDeFin)+1;
        }

        $flag = $fechaDeFin;

        $diasTot = $dias;
        $pago = round($diasTot /360 * (int)$sueldo, 2);
        $pago2 = ($version == 'antigua' ? ($pago / 2) : $pago);
        $fechaI = $fechaDeInicio->format('d-m-Y');
        $fechaF = $fechaDeFin->format('d-m-Y');

        $result[$i] = [
            'fechaActual' => $fechaDeInicio->format('Y'),
            'fechaI' => $fechaI,
            'fechaF' => $fechaF,
            'fecha' => $fechaI.' - '. $fechaF,
            'dias' => $diasTot,
            'total' => $pago2
        ];

        $flagInter++;

        $totalPago = ($totalPago + $pago2);

    }

    return ['montoTotal' => $totalPago,'intervaloFechas' => $result ] ;
}
