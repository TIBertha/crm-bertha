<?php


function generateLinkGoogleMap($direccion, $distrito){
    return 'https://www.google.com/maps/search/?api=1&query=' . $direccion . '%2C' . $distrito;
}

function generateLinkGoogleMapCopy($direccion, $distrito){
    return 'google.com/maps/search/?api=1&query=' . $direccion . '%2C' . $distrito;
}
function saveDomiciliosEmpleador($data, $usuarioid){

    if(!empty($data)){

        foreach($data as $d){

            if( (!$d['new']) AND $d['distrito']){

                $distritoid = $d['distrito']['value'];
                $distrito = \App\Models\Distrito::find($distritoid);
                $provincia = \App\Models\Provincia::find($distrito->provincia_id);
                $departamento = \App\Models\Departamento::find($provincia->departamento_id);

                $dom = \App\Models\Domicilio::find($d['id']);
                $dom->departamento_id = $departamento->id;
                $dom->provincia_id = $provincia->id;
                $dom->distrito_id = $distritoid;
                $dom->direccion = $d['direccion'];
                $dom->latitud = $d['latitud'];
                $dom->longitud = $d['longitud'];
                $dom->referencia = $d['referencia'];
                $dom->activo = $d['activo'];
                $dom->link_opcional = $d['linkOpcional'];
                $dom->update();

            }else{

                if($d['distrito'] AND $usuarioid AND $d['direccion']){

                    $distritoid = $d['distrito']['value'];
                    $distrito = \App\Models\Distrito::find($distritoid);
                    $provincia = \App\Models\Provincia::find($distrito->provincia_id);
                    $departamento = \App\Models\Departamento::find($provincia->departamento_id);

                    $dom = new \App\Models\Domicilio;
                    $dom->departamento_id = $departamento->id;
                    $dom->provincia_id = $provincia->id;
                    $dom->distrito_id = $distritoid;
                    $dom->direccion = $d['direccion'];
                    $dom->latitud = $d['latitud'];
                    $dom->longitud = $d['longitud'];
                    $dom->activo = $d['activo'];
                    $dom->referencia = $d['referencia'];
                    $dom->usuario_id = $usuarioid;
                    $dom->nombre = 'PRINCIPAL';
                    $dom->principal = true;
                    $dom->link_opcional = $d['linkOpcional'];
                    $dom->save();

                }
            }

        }

    }

}

function convertDomiciliosToObject($data){

    $result = [];

    if($data){

        foreach($data as $d){

            $isDelete = isDeleteDomicilio($d->id);

            $distrito = \App\Models\Distrito::find($d->distrito_id);
            $provincia = \App\Models\Provincia::find($distrito->provincia_id);
            $departamento = \App\Models\Departamento::find($provincia->departamento_id);

            $distritoObject = [
                'label' => ((($distrito->nombre))) . ' - ' . ((($provincia->nombre))) . ' - ' .((($departamento->nombre))),
                'value' => $distrito->id
            ];

            $result[] = [
                'id' => $d->id,
                'distrito' => $distritoObject,
                'nombredistrito' => $distrito->nombre,
                'direccion' => $d->direccion,
                'latitud' => $d->latitud,
                'longitud' => $d->longitud,
                'referencia' => $d->referencia,
                'activo' => $d->activo,
                'linkOpcional' =>  $d->link_opcional ?? null,
                'new' => false,
                'delete' => $isDelete
            ];
        }
    }

    return $result;

}

function isDeleteDomicilio($id){

    $delete = true;

    $contratos = \App\Models\Contrato::where('domicilio_id', $id)->first();

    if($contratos){
        $delete = false;
    }

    return $delete;
}
