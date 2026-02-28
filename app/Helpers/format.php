<?php

use App\Models\Requerimiento;
use App\Models\TipoDocumento;
use Carbon\Carbon;



function getDivisaDetails($countryID){
    $pais = \App\Models\Views\PaisView::find($countryID);
    return [
        'valor'     => $pais->codigo_iso_divisa,
        'tooltip'   => $pais->divisa . ' - ' . $pais->nombre,
    ];
}

function getMonthName($month){
    $meses = array("ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE");
    return $meses[($month) - 1];
}

function convertToFormatMultiselectDiasDescanso($data){

    $result = [];

    if($data){

        foreach(json_decode($data, true) as $d){

            if(!$d['isDescanso']){

                $dat = \App\Models\DiaSemana::find($d['id']);

                $result[] = [
                    'label' => ((($dat->nombre))),
                    'value' => $dat->id
                ];

            }
        }
    }

    return $result;

}

function formatMultiselectTrabajadoresCont($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => ((($d->nombres. ' ' .$d->apellidos . ' (ID: ' . $d->token . ')' ))),
                'value' => $d->id
            ];

        }
    }

    return $result;

}

function getHoraInicio($data, $modalidad){
    // Modalidades con horarios múltiples
    if (in_array($modalidad, [2, 3, 4, 5])) {
        $horarios = json_decode($data->horarios, true);

        foreach ($horarios as $h) {
            if (empty($h['isDescanso'])) {
                return $h['horaingreso'];
            }
        }

        return null; // por si todos son descanso
    }

    // Modalidad simple
    if ($modalidad == 1) {
        return $data->hora_ingreso;
    }

    return null;
}

function convertToFormatMultiselectPostulantes($data){

    $result = [];

    if($data){
        foreach(json_decode($data) as $d){
            $dat = \App\Models\Views\TrabajadorView::find($d);
            $result[] = [
                'label' => ((($dat->nombres . ' ' .$dat->apellidos))),
                'value' => $dat->id
            ];
        }
    }

    return $result;

}

function getGarantiaComision($tipoComision, $ifNot){
    if ($tipoComision){
        if ($tipoComision == 1){
            return 3;
        }else{
            return 1;
        }
    }else{
        return $ifNot;
    }
}

function formatRequerimientosContratosNoVigentes($data){

    $result = [];
    $search = false;

    if($data){

        foreach ($data as $d){

            if ($d->estatusrequerimientoid == 1){
                $search = true;
            }else{
                if (\App\Models\Contrato::where('requerimiento_id', $d->id)->get()){
                    if (\App\Models\Contrato::where('requerimiento_id', $d->id)->count() >= 1){

                        $findLastContrato = \App\Models\Contrato::where('requerimiento_id', $d->id)->orderBy('creado', 'desc')->first();

                        if ($findLastContrato['culminado'] == 1){
                            $search = true;
                        }

                    }else{
                        $search = true;
                    }
                }else{
                    $search = true;
                }
            }

            if ($search == true){
                $fechaActualizado = $d->actualizado ? \Carbon\Carbon::parse($d->actualizado)->format('d/m/Y') : 'N/A';

                $result[] = [
                    'id' => $d->id,
                    'nombre' => ''.$d->id. ' - '.$fechaActualizado . ' - ' .$d->actividad . ' - ' . $d->modalidad . ' - ' . ' ' . $d->codigo_iso_divisa_paispedido . ' ' . numberToCommas($d->sueldo)
                ];
            }

        }

    }



    return $result;

}

function formatMultiselectTrabajadores($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => ((($d->nombres. ' ' .$d->apellidos))),
                'value' => $d->id
            ];

        }
    }

    return $result;

}

function conveconvertToFormatMultiselectDiasLabor($data){
    $result = [];

    if($data){

        foreach(json_decode($data, true) as $d){

            $dat = \App\Models\DiaSemana::find($d);

            $result[] = [
                'label' => ((($dat->nombre))),
                'value' => $dat->id
            ];
        }
    }

    return $result;
}

function formatMultiselectTrabajador($data, $multi = true){

    $result = [];

    $emp = \App\Models\Views\TrabajadorView::find($data);

    if($multi){

        $result[] = [
            'label' => ((($emp->nombres. ' ' .$emp->apellidos))),
            'value' => $emp->id
        ];

    }else{
        if ($emp){
            $result = [
                'label' => ((($emp->nombres. ' ' .$emp->apellidos))),
                'value' => $emp->id
            ];
        }
    }


    return $result;

}

function formatMultiselectEmpleadores($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => ((($d->nombres. ' ' .$d->apellidos))),
                'value' => $d->id
            ];

        }
    }

    return $result;

}

function getDataTrabajadorContrato($trabajador){
    $data = \App\Models\Views\TrabajadorView::find($trabajador);

    $result = [
        'nombres'                       => $data->nombres,
        'antecedentes_pdf'              => $data->antecedente_pdf,
        'numeroDocumento'               => $data->numero_documento,
        'tiene_cuenta'                  => $data->tiene_cuenta,
        'certificado_antecedente'       => checkEstadoCertificadoAntecedente($data->certificado_antecedente, $data->certificado_antecedente_fecha),
    ];

    return $result;
}

function getAntecedentesTrabajadorColocado($contrato){
    $result = '';

    if ($contrato){

        $trabajador = \App\Models\Views\TrabajadorView::find($contrato->trabajadorid);

        if ($trabajador->antecedente_pdf){

            $result = [
                'iconAntecedente'       => 'fas fa-portrait text-success',
                'msjAntecedente'        => 'Tiene certificado único laboral',
                'estatusAntecedente'    => 10,
            ];

        }else{

            $antecedente = Antecedente::where('trabajador_id', $contrato->trabajadorid)->orderBy('creado', 'DESC')->first();


            if ($antecedente){
                $estatusAntecedente = $antecedente->estatusantecedente_id;
                $iconAntecedente = null;
                $msjAntecedente = null;

                if ($estatusAntecedente == 1){

                    $iconAntecedente = 'fas fa-user-clock text-warning';
                    $msjAntecedente = 'Los antecedentes están pendientes a recibirse.';

                }else if ($estatusAntecedente == 3){
                    $formatFechaAntecedente = date('d/m/Y', strtotime ($antecedente->fecha_entrega));
                    $fechaAntecedente = date('Y-m-d', strtotime ($antecedente->fecha_entrega));
                    $fechaHoy = Carbon::now()->format('Y-m-d');

                    $diff = date_diff(date_create_from_format('Y-m-d', $fechaAntecedente), date_create_from_format('Y-m-d', $fechaHoy));

                    $diasPasados = $diff->days;

                    if($diasPasados <= 90){
                        $iconAntecedente = 'fas fa-user-check text-success';
                        $msjAntecedente = 'Antecedentes con emitidos el ' . $formatFechaAntecedente . ' (' .  $diasPasados . ($diasPasados == 1 ? ' día)' : ' días)');
                    }else{
                        $iconAntecedente = 'fas fa-user-minus text-secondary';
                        $msjAntecedente = 'Antecedentes con antiguedad mayor a 90 días, se recomienda solicitar nuevos';
                    }

                }

                $result = [
                    'iconAntecedente'       => $iconAntecedente,
                    'msjAntecedente'        => $msjAntecedente,
                    'estatusAntecedente'    => $estatusAntecedente
                ];
            }else{
                $result = [
                    'iconAntecedente'       => 'fas fa-user-times text-secondary',
                    'msjAntecedente'        => 'No cuenta con antecedentes.',
                    'estatusAntecedente'    => null
                ];
            }

        }

    }

    return $result;
}

function getArregloFrecuencia($data){
    $result = [];

    if ($data){
        foreach ($data as $d){
            array_push($result, $d['value']);
        }
    }

    return json_encode($result);
}

function validateExistTrabajador($trabajador){

    $result = null;

    if ($trabajador){
        $d = \App\Models\Trabajador::find($trabajador['value']);

        if ($d){
            $result = $d->id;
        }
    }

    return $result;
}

function getTrabajadorContactData($trabajadorID){

    $result = null;

    if ($trabajadorID){
        $trabajador = \App\Models\Views\TrabajadorView::find($trabajadorID);

        if($trabajador){
            $result = [
                'exist'                    => true,
                'id'                       => $trabajadorID,
                'nombres'                  => $trabajador->trabajador,
                'short_name'               => getNombreCorto($trabajador->nombres , $trabajador->apellidos),
                'flag_emoji'               => $trabajador->postulando_pais_id ? ($trabajador->postulando_pais_id == 11 ? '🇨🇱' : '🇵🇪') : '🇵🇪',
                'telefono'                 => $trabajador->telefono,
                'telefono_whatsapp'        => $trabajador->telefono_whatsapp,
            ];
        }else{
            $result = [
                'exist'                    => false,
                'id'                       => $trabajadorID,
            ];
        }
    }

    return $result;
}

function formatRequerimientosContratos($data){

    $result = [];

    if($data){

        foreach ($data as $d){

            $fechaActualizado = $d->actualizado ? \Carbon\Carbon::parse($d->actualizado)->format('d/m/Y') : 'N/A';

            $result[] = [
                'id' => $d->id,
                'nombre' => ''.$d->id. ' - '.$fechaActualizado . ' - ' .$d->actividad . ' - ' . $d->modalidad . ' - ' . ' ' . $d->codigo_iso_divisa_paispedido . ' ' . numberToCommas($d->sueldo)
            ];
        }

    }

    return $result;

}

function formatMultiselectEmpleador($data){

    $emp = \App\Models\Views\EmpleadorView::find($data);

    $result = [
        'label' => ((($emp->nombres. ' ' .$emp->apellidos))),
        'value' => $emp->id
    ];

    return $result;

}

function cleaner($text){

    $utf8 = array(
        '/[áàâãªä]/u'   =>   'a',
        '/[ÁÀÂÃÄ]/u'    =>   'A',
        '/[ÍÌÎÏ]/u'     =>   'I',
        '/[íìîï]/u'     =>   'i',
        '/[éèêë]/u'     =>   'e',
        '/[ÉÈÊË]/u'     =>   'E',
        '/[óòôõºö]/u'   =>   'o',
        '/[ÓÒÔÕÖ]/u'    =>   'O',
        '/[úùûü]/u'     =>   'u',
        '/[ÚÙÛÜ]/u'     =>   'U',
        '/ç/'           =>   'c',
        '/Ď/'           =>   'D',
        '/Ç/'           =>   'C',
        '/ñ/'           =>   'n',
        '/Ñ/'           =>   'N',
        '/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
        '/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
        '/[“”«»„]/u'    =>   ' ', // Double quote
        '/ /'           =>   ' ' // nonbreaking space (equiv. to 0x160)
    );

    return preg_replace(array_keys($utf8), array_values($utf8), $text);
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

function convertFormatDistritosSelect($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => $d->distritostres,
                'value' => $d->id
            ];
        }
    }

    return $result;

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

function getValueSelectSingle($data){

    return $data['value'];

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

function convertFormatTrabajadoresSelect($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => ($d->trabajador),
                'value' => $d->id
            ];
        }
    }

    return $result;

}

function convertFormatEmpleadoresSelect($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => ((($d->nombres . ' ' .$d->apellidos))),
                'value' => $d->id
            ];
        }
    }

    return $result;

}

function convertFormatDistritosProvinciaSelect($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'label' => $d->distritostres,
                'value' => $d->id
            ];
        }
    }

    return $result;

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

function quitarTildes($cadena) {
    $no_permitidas= array ("á","é","í","ó","ú","Á","É","Í","Ó","Ú","ñ","Ñ","À","Ã","Ì","Ò","Ù","Ã™","Ã ","Ã¨","Ã¬","Ã²","Ã¹","ç","Ç","Ã¢","ê","Ã®","Ã´","Ã»","Ã‚","ÃŠ","ÃŽ","Ã”","Ã›","ü","Ã¶","Ã–","Ã¯","Ã¤","«","Ò","Ã","Ã„","Ã‹");
    $permitidas= array ("a","e","i","o","u","A","E","I","O","U","n","N","A","E","I","O","U","a","e","i","o","u","c","C","a","e","i","o","u","A","E","I","O","U","u","o","O","i","a","e","U","I","A","E");
    $texto = str_replace($no_permitidas, $permitidas ,$cadena);
    return $texto;
}

function saveIdiomaFormatMultiselect($data){

    if($data){

        $r = [];

        foreach($data as $d){
            array_push($r, $d['value']);
        }

        return json_encode($r);
    }else{
        return json_encode([4]);
    }

}

function saveFormatContactos($data){

    $result = null;

    if($data){

        $r = [];

        foreach($data as $key => $value){

            if(array_filter($value)){
                array_push($r, $value);
            }

        }

        $result = json_encode($r);
    }

    return $result;

}

function saveFormatMultiselect($data){

    $result = null;

    if($data){

        $r = [];

        foreach($data as $d){
            array_push($r, $d['value']);
        }

        $result = json_encode($r);
    }

    return $result;

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

function formatMultiselect($data){

    $result = [];

    if($data){
        foreach($data as $d){
            $result[] = [
                'label' => ((($d->nombre))),
                'value' => $d->id
            ];
        }
    }

    return $result;

}

function formatMultiselectActividad($genero, $paisPostulando){

    $result = [];
    $data = \App\Models\Actividad::borrado(false)->genero($genero)->orderBy('nombre', 'asc')->get();

    if ($data){
        foreach($data as $d){
            $nombreAct = $d->nombre;
            if($paisPostulando == '11'){
                $nombreAct = $d->nombre_ch;
            }else if($paisPostulando == '49'){
                $nombreAct = $d->nombre_mx;
            }
            $res = [
                'label' => ((($nombreAct))),
                'value' => $d->id
            ];
            array_push($result, $res);
        }
    }

    return $result;

}

function convertVerificacionesToObject($data){

    $result = [];

    if($data){

        foreach(json_decode($data, true) as $d){

            if($d['distrito']){

                $distrito = \App\Models\Views\DistritoView::find($d['distrito']);

                $distritoObject = [
                    'label' => ($distrito->distritostres),
                    'value' => $distrito->id
                ];

            }else{
                $distritoObject = NULL;
            }

            if($d['actividad']){

                $actividadObject = convertToFormatMultiselectActividad($d['actividad']);

            }else{
                $actividadObject = NULL;
            }

            $result[] = [
                "nombre" => $d['nombre'],
                "apellidos" => isset($d['apellidos']) ? $d['apellidos'] : NULL,
                "departamento" => NULL,
                "provincia" => NULL,
                "distrito" => $distritoObject,
                "telefono" => $d['telefono'],
                "inicioLabores" => isset($d['inicioLabores']) ? $d['inicioLabores'] : NULL,
                "finLabores" => isset($d['finLabores']) ? $d['finLabores'] : NULL,
                "actividad" => $actividadObject,
                "tiempo" => $d['tiempo'],
                'motivoretiro' => isset($d['motivoretiro']) ? $d['motivoretiro'] : NULL,
                "verificado" => $d['verificado'],
                "adjuntos" => isset($d['adjuntos']) ? $d['adjuntos'] : [],
                "adjuntosrecomendaciones" => isset($d['adjuntosrecomendaciones']) ? $d['adjuntosrecomendaciones'] : [],
                "ejecutivo" => isset($d['ejecutivo']) ? $d['ejecutivo'] : '',
                "llamar" => isset($d['llamar']) ? $d['llamar'] : false,
            ];

        }
    }

    return ($result == [] ? NULL : $result);

}

function convertToFormatMultiselectIdioma($data){

    $result = [];

    if($data){

        foreach(json_decode($data) as $d){

            $idioma = \App\Models\Idioma::find($d);

            $result[] = [
                'label' => ((($idioma->nombre))),
                'value' => $idioma->id
            ];

        }
    }

    return $result;

}

function convertToFormatMultiselectActividad($actividades, $paisPostulando = 54){

    $result = [];

    if($actividades){

        foreach(json_decode($actividades) as $ac){

            $actividad = \App\Models\Actividad::find($ac);

            $nombreAct = $actividad->nombre;
            if($paisPostulando == '11'){
                $nombreAct = $actividad->nombre_ch;
            }else if($paisPostulando == '49'){
                $nombreAct = $actividad->nombre_mx;
            }

            $result[] = [
                'label' => ((($nombreAct))),
                'value' => $actividad->id
            ];

        }
    }

    return $result;

}

function convertAdjuntoEducacionToObject($data){

    $result = [];

    if($data){

        foreach(json_decode($data, true) as $d){

            $result[] = [
                "tipocertificado" => $d['tipocertificado'] ? $d['tipocertificado'] : null,
                "centro"          => $d['centro'] ? $d['centro'] : null,
                "titulo"          => $d['titulo'] ? $d['titulo'] : null,
                //"fechainicio"     => isset($d['fechainicio']) ? $d['fechainicio'] : null,
                //"fechafin"        => isset($d['fechafin']) ? $d['fechafin'] : null,
                //"tiempo"          => isset($d['tiempo']) ? $d['tiempo'] : null,
                "adjuntos"        => isset($d['adjuntos']) ? $d['adjuntos'] : []
            ];

        }
    }

    return ($result == [] ? null : $result);

}

function setTitlePdf($nombres, $apellidos, $title){

    $arrNombre = explode(' ',trim($nombres));
    $arrApellido = explode(' ',trim($apellidos));

    return strtoupper($arrNombre[0].'-'.$arrApellido[0].'-'.$title);

}

function convertDistritoToObject($data){

    $result = [];

    if($data){

        $distritoView = \App\Models\Views\DistritoView::find($data);

        return [
            'label' => $distritoView->distritostres,
            'value' => $distritoView->id
        ];

    }

    return $result;

}

function formatMultiselectFixed($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $result[] = [
                'is_fixed' => $d->is_fixed,
                'label' => ((($d->nombre))),
                'value' => $d->id
            ];

        }
    }

    return $result;

}

function formatMoney($string){

    if(valueNull($string)){
        return '0.00';
    }else{
        return number_format($string, 2, '.', ',');
    }

}

function formatSelectMotivoBajas(){

    $result = [];

    $baja = \App\Models\Baja::borrado(false)->orderBy('tipobaja_id', 'asc')->get();

    if($baja){

        foreach($baja as $b){

            $tipobaja = \App\Models\TipoBaja::find($b->tipobaja_id);

            $result[] = [
                'id' => $b->id,
                'nombre' => $b->nombre . ' - ' . ($tipobaja->penalizacion_dias == 0 ? 'PERMANENTE' : $tipobaja->penalizacion_dias . ' DIAS')
            ];

        }
    }

    return $result;

}

function getFormatFechaEntrevista($fecha){
    $result = '';

    if ($fecha){
        $f = formatFecha($fecha);
        $result = ( mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ' ' . $f['numeroDia'] . '/' . $f['numeroMes'] . '/' . $f['numeroAnio']);
    }

    return $result;
}

function setHorarioCamaAfuera($horario){
    $result = [];

    $hr = json_decode($horario,true);

    if ($hr[0]['isDescanso'] == false && $hr[1]['isDescanso'] == false && $hr[2]['isDescanso'] == false && $hr[3]['isDescanso'] == false && $hr[4]['isDescanso'] == false && $hr[5]['isDescanso'] == true){
        $result1 = [
            'dia'           => 'Lunes a Viernes',
            'ingreso'       => formatHora($hr[0]['horaingreso']),
            'salida'        => formatHora($hr[0]['horasalida']),
        ];

        array_push($result, $result1);
    }else if ($hr[0]['isDescanso'] == false && $hr[1]['isDescanso'] == false && $hr[2]['isDescanso'] == false && $hr[3]['isDescanso'] == false && $hr[4]['isDescanso'] == false && $hr[5]['isDescanso'] == false){

        if ((formatHora($hr[0]['horaingreso']) == formatHora($hr[5]['horaingreso'])) && (formatHora($hr[0]['horasalida']) == formatHora($hr[5]['horasalida']))){
            $result1 = [
                'dia'           => 'Lunes a Sábados',
                'ingreso'       => formatHora($hr[0]['horaingreso']),
                'salida'        => formatHora($hr[0]['horasalida']),
            ];

            array_push($result, $result1);
        }else{
            $result1 = [
                'dia'           => 'Lunes a Viernes',
                'ingreso'       => formatHora($hr[0]['horaingreso']),
                'salida'        => formatHora($hr[0]['horasalida']),
            ];

            array_push($result, $result1);

            $result2 = [
                'dia'           => 'Sábados',
                'ingreso'       => formatHora($hr[5]['horaingreso']),
                'salida'        => formatHora($hr[5]['horasalida']),
            ];

            array_push($result, $result2);
        }
    }else {
        foreach ($hr as $key => $h){
            if ($h['isDescanso'] == false){
                $data = [
                    'dia'          => $h['dia'],
                    'ingreso'      => formatHora($h['horaingreso']),
                    'salida'       => formatHora($h['horasalida'])
                ];
                array_push($result, $data);
            }
        }
    }

    return $result;
}

function getEmpleadorContactData($empleadorID){

    if ($empleadorID){
        $empleador = \App\Models\Views\EmpleadorView::find($empleadorID);

        return [
            'id'                       => $empleadorID,
            'nombres'                  => $empleador->empleador,
            'flag_emoji'              => $empleador->pais_pedido_id ? ($empleador->pais_pedido_id == 11 ? '🇨🇱' : '🇵🇪') : '🇵🇪',
            'telefono'                 => $empleador->telefono,

        ];
    }else{
        return null;
    }
}

function formatHora($date){
    $dt = new DateTime($date);

    return $dt->format('h:i') . ' ' . $dt->format('a');
}

function setHorarioCamaAdentro($data){

    $result = null;

    if ($data->dia_ingreso && $data->dia_salida && $data->hora_ingreso && $data->hora_salida){
        $diaI= \App\Models\DiaSemana::find($data->dia_ingreso)->nombre;
        $diaS= \App\Models\DiaSemana::find($data->dia_salida)->nombre;

        $horaI = formatHora($data->hora_ingreso);
        $horaS = formatHora($data->hora_salida);

        $result = [
            'diaingreso'        =>  $diaI,
            'diasalida'         =>  $diaS,
            'horaingreso'       =>  $horaI,
            'horasalida'        =>  $horaS,
        ];
    }

    return $result;

}

function getNombre($nombre){

    if($nombre){

        $n = explode(' ', $nombre);

        return $n[0];
    }

    return '';
}

function getPostulados($id){
    $result = 0;

    if ($id){
        $result = \App\Models\RequerimientoPostulacion::where('requerimiento_id', $id)
            ->where('activo',1)
            ->orderBy('select_emp', 'desc')
            ->orderBy('fecha_postulacion', 'desc')
            ->count();
    }

    return $result;

}

function getDataPaisPedido($idPais){
    $p = \App\Models\Pais::find($idPais);


    $dataPaisPedido = [
        'id'            => $p->id,
        'name'          => $p->nombre,
        'code'          => strtolower($p->country_code),
    ];

    return $dataPaisPedido;
}

function setHorarioPorDias($horario){
    $result = [];

    foreach (json_decode($horario,true) as $h){
        if ($h['isDescanso'] == false){

            $data = [
                'dia'          =>  $h['dia'],
                'ingreso'      => formatHora($h['horaingreso']),
                'salida'       => formatHora($h['horasalida'])
            ];
            array_push($result, $data);
        }
    }

    return $result;
}

function fechaCompletaSpanish($fecha, $del = false){

    $fecha = substr($fecha, 0, 10);
    $numeroDia = date('d', strtotime($fecha));
    $dia = date('l', strtotime($fecha));
    $mes = date('F', strtotime($fecha));
    $anio = date('Y', strtotime($fecha));
    $dias_ES = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
    $dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    $nombredia = str_replace($dias_EN, $dias_ES, $dia);
    $meses_ES = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    $meses_EN = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    $nombreMes = str_replace($meses_EN, $meses_ES, $mes);
    return $nombredia . ", " . $numeroDia . " de " . $nombreMes . ", " . $anio;
}

function saveFormatSeguimientoReclamo($data){
    $result = null;
    if ($data){
        $r = [];
        foreach ($data as $key => $value){

            if (array_filter($value)){
                $d = [
                    'fecha'         => $value['fecha'] ? \Carbon\Carbon::parse($value['fecha'])->format('Y-m-d') : null,
                    'adjuntos'      => isset($value['adjuntos']) ? $value['adjuntos'] : null,
                ];
                array_push($r, $d);
            }
        }
        $result = json_encode($r);
    }
    return $result;
}

function saveFormatAdjuntosRespuesta($data){
    $result = null;
    if ($data){
        $r = [];
        foreach ($data as $key => $value){

            if (array_filter($value)){
                $d = [
                    'fecha'         => $value['fecha'] ? \Carbon\Carbon::parse($value['fecha'])->format('Y-m-d') : null,
                    'adjuntos'      => isset($value['adjuntos']) ? $value['adjuntos'] : null,
                ];
                array_push($r, $d);
            }
        }
        $result = json_encode($r);
    }
    return $result;
}

function armarFechaDeEnvio($fecha){
    $result = null;
    if ($fecha){
        $fechaEnvio = formatFecha($fecha);
        $horaEnvio = date("h:i a", strtotime($fecha));
        $result = $fechaEnvio['numeroDia'] . '/' .$fechaEnvio['numeroMes'] . '/' .$fechaEnvio['numeroAnio'] . ' ' . $horaEnvio;
    }

    return $result;
}

function convertirAdjuntoSeguimiento($data){
    $result = [];

    if ($data){
        foreach(json_decode($data, true) as $d) {

            $result[] = [
                'fecha'         => $d['fecha'] ? $d['fecha'] : null,
                "adjuntos"      => isset($d['adjuntos']) ? $d['adjuntos'] : null,
            ];
        }
    }

    return ($result == [] ? null : $result);
}

function convertirAdjuntosRespuesta($data){
    $result = [];

    if ($data){
        foreach(json_decode($data, true) as $d) {

            $result[] = [
                'fecha'         => $d['fecha'] ? $d['fecha'] : null,
                "adjuntos"      => isset($d['adjuntos']) ? $d['adjuntos'] : null,
            ];
        }
    }

    return ($result == [] ? null : $result);
}
