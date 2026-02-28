<?php

use App\Models\Views\ReclamoView;

function getNewReclamos(){

    $data = ReclamoView::orderBy('fechaformat', 'DESC');
    //->orderBy('atendido', 'asc');

    return $data;
}

function getDataReclamos($lista, $offset){
    $data = $lista->offset($offset)->limit(10)->get();

    return $data;

}
