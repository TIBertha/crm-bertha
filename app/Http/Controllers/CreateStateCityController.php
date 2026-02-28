<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Pais;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreateStateCityController extends Controller
{
    public function ajaxGetPaises(Request $request){
        $paisSelected = $request->input('paisID');
        $estados = [];
        if ($paisSelected){
            $e = Departamento::where('pais_id', $paisSelected);
            if ($e->count() > 0){
                $estados = $e->get();
            }
        }
        $paises = Pais::orderBy('nombre', 'asc')->get();

        return response()->json([
            'paises'        => $paises,
            'estados'       => $estados
        ]);
    }

    public function ajaxSaveEstado(Request $request){
        $paisID = $request->input('paisID');
        $newEstado = $request->input('newEstado');

        DB::beginTransaction();

        try{

            $dataEstado = [
                'nombre'    => $newEstado,
                'pais_id'   => $paisID,
            ];

            $e = Departamento::create($dataEstado);

            DB::commit();

            return response()->json([
                'code'              => 200,
                'estadoId'          => $e->id,
                'estados'           => Departamento::where('pais_id', $paisID)->get(),
                'estadoNombre'      => $e->nombre,
                'msj'               => 'Postulante creado exitosamente',
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            return response()->json([
                'code'              => 500,
                'msj'               => 'Ocurrio un problema al crear postulante. Consulte al administrador'
            ]);
        }
    }
}
