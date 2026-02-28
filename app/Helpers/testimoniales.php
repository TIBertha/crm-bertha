<?php

use App\Models\Views\TestimonialesTrabajadorView;
use App\Models\Views\TestimonialesEmpleadorView;

function getNewTestimonialesEmpleador(){

    $data = TestimonialesEmpleadorView::orderBy('fecha_original', 'desc')->orderBy('actualizado', 'desc');

    return $data;
}

function getDataTestimonialesEmpleador($lista,$offset){

    $data = $lista->offset($offset)->limit(10) ->get();

    return $data;

}
function getNewTestimonialesTrabajador(){

    $data = TestimonialesTrabajadorView::orderBy('fecha_format', 'desc');

    return $data;
}

function getDataTestimonialesTrabajador($lista,$offset){

    $data = $lista->offset($offset) ->limit(10) ->get();

    return $data;

}
