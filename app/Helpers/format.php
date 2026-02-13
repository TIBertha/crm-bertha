<?php

use App\Models\Requerimiento;
use App\Models\TipoDocumento;
use Carbon\Carbon;

function getNombreCorto($nombre, $apellido, $nombresCompletos = false){

    if($nombre AND $apellido){

        $n = explode(' ', $nombre);
        $a = explode(' ', $apellido);
        $ape = '';

        if(count($a) > 1){

            if( strlen($a[0]) <= 3){

                if(strlen($a[1]) <= 3){

                    if(count($a) > 2){
                        $ape = $a[0] . ' ' . $a[1] . ' ' . $a[2];
                    }else{
                        $ape = $a[0] . ' ' . $a[1];
                    }
                }else{
                    $ape = $a[0] . ' ' . $a[1];
                }

            }else{
                $ape = $a[0];
            }

        }else{
            $ape = $a[0];
        }

        return ($nombresCompletos == true ? $nombre : $n[0]) . ' ' . $ape;

    }

    return '';
}

function convertDataMultiSelect($data){

    $result = [];

    if($data){
        foreach(json_decode($data) as $d){
            $result[] = [
                'label' => $d->nombre,
                'value' => $d->id
            ];
        }
    }

    return $result;

}

function setPaisData($paisID){
     $result = null;
     if ($paisID){
         $p = \App\Models\Pais::find($paisID);
         $result = [
             'id'       => $paisID,
             'code'     => strtolower($p->country_code),
             'name'     => ucfirst($p->nombre),
         ];
     }

     return $result;
}

function separateNumber($numero){

    $result = strlen($numero) == 9 ? ( substr($numero,0,3) . ' ' . substr($numero,3,3) . ' ' . substr($numero,6,3) ) : $numero;

    return $result;
}

function findDocumentAcronym($documentID){
     $result = '';

     if ($documentID){
         $documento = TipoDocumento::find($documentID);
         $result = $documento->acronym;
     }

     return $result;
}

function getLinkFirma($firma){
    $link = '';

    if ($firma){
        $urlWeb = config('webexperta.url-web');
        $link = $urlWeb . '/firma/'. base64_encode($firma) . "\r\n" . 'Dale clic, lee, firma con tu dedo y dale *GUARDAR*.';
    }

    return $link;
}

function unaccent($string){

    $string = trim($string);

    $string = str_replace(
        array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
        array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
        $string
    );

    $string = str_replace(
        array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
        array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
        $string
    );

    $string = str_replace(
        array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
        array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
        $string
    );

    $string = str_replace(
        array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
        array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
        $string
    );

    $string = str_replace(
        array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
        array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
        $string
    );

    $string = str_replace(
        array('ç', 'Ç'),
        array('c', 'C',),
        $string
    );

    $string = str_replace(
        array('ñ', 'Ñ', 'Ñ'),
        array('ñ', 'Ñ', 'Ñ'),
        $string
    );

    return $string;

}

function valueNull($string){

    $text = trim((is_null($string) || empty($string) ? NULL : $string));

    if($text){
        return false;
    }else{
        return true;
    }

}

function formatText($string){

    if(valueNull($string)){
        return NULL;
    }else{
        return strtoupper(unaccent(trim($string)));
    }

}

function formatTextFirstCharacterToUpper($string){

    if(valueNull($string)){
        return NULL;
    }else{
        return ucfirst(strtolower(unaccent(trim($string))));
    }

}

function removeSpaceNumber($number){
    return str_replace(' ', '', $number);
}

function formatWordFirstCharacterToUpper($string){

    if(valueNull($string)){
        return NULL;
    }else{
        return ucwords(strtolower(unaccent(trim($string))));
    }

}

function convertHistorialContacto($data){
     $result = [];

     if($data){
        foreach (json_decode($data, true) as $d){

            $today = new DateTime(Carbon::now());
            $date = new DateTime($d['fecha']);
            $daysPast = $today->diff($date);

            $ui = \App\Models\UsuarioInterno::find($d['usuarioInterno']);

            if ($ui) {
                $result[] = [
                    'usuarioInterno' => $ui->nombres . ' ' . $ui->apellidos,
                    'fecha' => $d['fecha'],
                    'hora' => $d['hora'],
                    'diasPasados' => $daysPast->days,
                ];
            }
        }
     }

     return json_encode($result);

 }

 function formatFecha($fecha){
    $fecha = substr($fecha, 0, 10);
    $numeroDia = date('d', strtotime($fecha));
    $numeroMes = date('m', strtotime($fecha));
    $numeroAnio = date('Y', strtotime($fecha));
    $dia = date('l', strtotime($fecha));
    $mes = date('F', strtotime($fecha));
    $anio = date('Y', strtotime($fecha));
    $dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    $dias_ES = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
    $dias_ES_CO = array("Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom");
    $nombreDia = str_replace($dias_EN, $dias_ES, $dia);
    $nombreDiaCorto = str_replace($dias_EN, $dias_ES_CO, $dia);
    $meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    $meses_ES = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    $meses_ES_CO = array("Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic");
    $nombreMes = str_replace($meses_EN, $meses_ES, $mes);
    $nombreMesCorto = str_replace($meses_EN, $meses_ES_CO, $mes);
    return[
        'numeroDia'         => $numeroDia,
        'numeroMes'         => $numeroMes,
        'numeroAnio'        => $numeroAnio,
        'nombreDia'         => $nombreDia,
        'nombreMes'         => $nombreMes,
        'nombreDiaCorto'    => $nombreDiaCorto,
        'nombreMesCorto'    => $nombreMesCorto
    ];
}

function getEncondedLink($link , $ruta){
    $result = '';

    if ($link){
        $urlWeb = config('webexperta.url-web');
        $result = $urlWeb . '/' . ($ruta ? ($ruta . '/') : '') . base64_encode($link);
    }

    return $result;
}

function numberToCommas($num){
     return number_format( $num, 2, ".", ",");
}

function getText1($monto, $frecuencia, $divisa, $cfc){
    return($cfc == false ? ( ' ( ' . $divisa . ' ' . numberToCommas($monto) . ' x ' . $frecuencia * 4 . ' días ' . ( '(' .$frecuencia . ' veces x 4 semanas) )'))  : ( ' ( ' . $divisa . ' ' . numberToCommas($monto) . ' x ' . $frecuencia * 4 . ' días ' . ( '(' .$frecuencia . ' veces x 4 semanas) )')) );
}

function addCommas($num){
    $pattern = "/\B(?=(\d{3})+(?!\d))/";
    $replace = ",";
    return preg_replace($pattern, $replace, $num);
}

function getListaEdades($edades){

    $result = [];

    if ($edades){
        foreach (json_decode($edades, true) as $e){
            $result[] = $e['text'];
        }

        sort($result);
        return implode(' | ',$result);
    }

    return $result;
}

function getDiasTrabajoPD($data){
    $result = [];

    if ($data){

        foreach (json_decode($data) as $key =>  $d){

            $req = Requerimiento::find($d->requerimientoid);

            if ($req->horarios){

                $res = [];

                foreach (json_decode($req->horarios, true) as $h){
                    if (!$h['isDescanso']){

                        $day = \App\Models\DiaSemana::find($h['id']);

                        /*$s = ['label' => ((($dat->nombre))), 'value' => $dat->id];*/

                        $res[] = $day->nombre;

                    }
                }

                $res =  implode(' - ', $res);

                $title = 'CONTRATO ' . ($key + 1) . ': ';

                $title2 = $title . $res;

                $result[] = ((($title2)));
            }
        }

        $result = implode(' | ', $result);
    }
    return $result;
}