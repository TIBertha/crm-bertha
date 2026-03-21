<?php

use App\Models\Views\TestimonialesTrabajadorView;
use App\Models\TestimonialEmpleador;
use App\Models\Views\EmpleadorView;
use App\Models\UsuarioInterno;

function getNewTestimonialesEmpleador(){

    $data = TestimonialEmpleador::orderBy('fecha', 'desc')->orderBy('actualizado', 'desc');

    return $data;
}

function getDataTestimonialesEmpleador($lista,$offset){

    $data = $lista->offset($offset)->limit(10) ->get();

    return $data;

}

function getTestimonialesEmpleador($data){

    foreach ($data as $d){
        $e = EmpleadorView::find($d->empleador_id);
        $u = UsuarioInterno::find($d->usuariointerno_id);

        $result[] = [
            'id'                        => $d->id,
            'orden'                     => $d->orden,
            'nombre_cliente'            => $e->empleador,
            'disp_mx'                   => $d->disp_mx,
            'disp_pe'                   => $d->disp_pe,
            'activo'                    => $d->activo,
            'fecha'                     => $d->fecha,
            'usuariointerno_nombres'    => $u->nombres,
            'usuariointerno_apellidos'  => $u->apellidos,
        ];
    }

    return $result;
}


function getNewTestimonialesTrabajador(){

    $data = TestimonialesTrabajadorView::orderBy('fecha_format', 'desc');

    return $data;
}

function getDataTestimonialesTrabajador($lista,$offset){

    $data = $lista->offset($offset) ->limit(10) ->get();

    return $data;

}
