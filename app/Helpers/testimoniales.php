<?php

use App\Models\TestimonialEmpleador;
use App\Models\TestimonialesTrabajador;
use Carbon\Carbon;
function getNewTestimonialesEmpleador(){

    $data = TestimonialEmpleador::orderBy('fecha', 'desc')->orderBy('actualizado', 'desc');

    return $data;
}

function getDataTestimonialesEmpleador($lista,$offset){

    $data = $lista->offset($offset)->limit(10)->get();

    return $data;

}

function getTestimonialesEmpleador($data){

    $result = [];

    foreach ($data as $d){

        $result[] = [
            'id'                        => $d->id,
            'orden'                     => $d->orden,
            'nombre_cliente'            => $d->empleador->usuario->nombres . ' ' . $d->empleador->usuario->apellidos,
            'disp_mx'                   => $d->disp_mx,
            'disp_pe'                   => $d->disp_pe,
            'activo'                    => $d->activo,
            'fecha'                     => Carbon::parse($d->fecha)->format('d/m/Y'),
            'usuariointerno_nombres'    => $d->usuariointerno->nombres,
            'usuariointerno_apellidos'  => $d->usuariointerno->apellidos,
        ];
    }

    return $result;
}


function getNewTestimonialesTrabajador(){

    $data = TestimonialesTrabajador::orderBy('fecha', 'desc');

    return $data;
}

function getDataTestimonialesTrabajador($lista,$offset){

    $data = $lista->offset($offset) ->limit(10)->get();

    return $data;

}

function getTestimonialesTrabajador($data){

    $result = [];

    foreach ($data as $d){

        $result[] = [
            'id'                        => $d->id,
            'orden'                     => $d->orden,
            'trabajador'                => $d->trabajador->usuario->nombres . ' ' . $d->trabajador->usuario->apellidos,
            'disp_mx'                   => $d->disp_mx,
            'disp_pe'                   => $d->disp_pe,
            'activo'                    => $d->activo,
            'fecha'                     => Carbon::parse($d->fecha)->format('d/m/Y'),
            'usuariointerno_nombres'    => $d->usuariointerno->nombres,
            'usuariointerno_apellidos'  => $d->usuariointerno->apellidos,
        ];
    }

    return $result;
}
