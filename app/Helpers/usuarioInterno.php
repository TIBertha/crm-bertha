<?php

use Illuminate\Support\Facades\Auth;

function getAccessFunctions($list = null){

    $usuarioInterno = Auth::user()->id;
    $allowedUsers = $list ? $list : [3,5];

    if (in_array($usuarioInterno, $allowedUsers)){
        $result = true;
    }else{
        $result = false;
    }

    return $result;
}