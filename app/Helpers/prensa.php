<?php

use App\Models\Prensa;

function getNewBlogs(){

    $data = Prensa::orderBy('fecha', 'desc');

    return $data;
}

function getDataBlogs($lista,$offset){

    $data = $lista->offset($offset) ->limit(10) ->get();

    return $data;

}
