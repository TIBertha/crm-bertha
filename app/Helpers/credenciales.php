<?php

use App\Models\CredencialPlataforma;

function getNewCredenciales($nivelAcceso){

    $data = CredencialPlataforma::where('nivel_credencial','<=',$nivelAcceso)->orderBy('nombre_plataforma', 'asc');

    return $data;
}

function getDataCredenciales($lista, $offset){

    $data = $lista->offset($offset)->limit(10)->get();

    return $data;
}

function armarCredencialesData($credenciales){
    $result = [];

    if ($credenciales){
        foreach ($credenciales as $c){

            $result[] = [
                'id'                        => $c->id,
                'nombre_plataforma'         => $c->nombre_plataforma,
                'usuario'                   => $c->usuario,
                'contra'                    => $c->contra,
                'link_plataforma'           => $c->link_plataforma,
                'nivel_credencial'          => $c->nivel_credencial
            ];
        }
    }

    return $result;
}
