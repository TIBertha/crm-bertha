<?php

use App\Models\views\PrensaView;

function getNewBlogs(){

    $data = PrensaView::orderBy('fechaoriginal', 'desc');

    return $data;
}

function getDataBlogs($lista,$offset){

    $data = $lista->offset($offset) ->limit(10) ->get();

    return $data;

}
