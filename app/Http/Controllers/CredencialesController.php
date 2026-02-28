<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateCredencial;
use App\Models\CredencialPlataforma;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CredencialesController extends Controller
{
    public function index(){
        return view('Credenciales.index');
    }

    public function viewNew(){
        return redirect('/credenciales');
    }

    public function viewEdit($id){
        return redirect('/credenciales');
    }

    public function ajaxNew(ValidateCredencial $request){

        DB::beginTransaction();

        try{
            $data = $request->input('data');

            $inf = [
                'nombre_plataforma'     => $data['nombrePlataforma'],
                'usuario'               => $data['usuario'],
                'contra'                => $data['contra'],
                'link_plataforma'       => $data['linkPlataforma'],
                'nivel_credencial'      => $data['nivelCredencial'],
                'creado'                => Carbon::now(),
                'actualizado'           => Carbon::now(),
            ];

            $exito = CredencialPlataforma::create($inf);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Credencial creada exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear la credencial. Consulte al administrador' ]);

        }
    }

    public function ajaxEdit(ValidateCredencial $request){
        $id = $request->input('id');
        $credencial = CredencialPlataforma::find($id);

        $data = [
            'nombre_plataforma'     => $request->input('nombrePlataforma'),
            'usuario'               => $request->input('usuario'),
            'contra'                => $request->input('contra'),
            'link_plataforma'       => $request->input('linkPlataforma'),
            'nivel_credencial'      => $request->input('nivelCredencial'),
            'creado'                => Carbon::now(),
            'actualizado'           => Carbon::now(),
        ];

        DB::beginTransaction();

        try{
            $exito = CredencialPlataforma::where('id', $id)->update($data);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Credencial actualizado exitosamente']);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar la credencial. Consulte al administrador' ]);

        }
    }

    public function ajaxRefreshCredenciales(Request $request){

        $nivelAcceso = Auth::user()->acceso_credencial ? Auth::user()->acceso_credencial : 1;

        $offset = $request->input('offset');

        $lista = getNewCredenciales($nivelAcceso);
        $cantidad = $lista->count();
        $data = getDataCredenciales($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'credenciales' => armarCredencialesData($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen credenciales recientes',
            'accessCom' => getAccessFunctions()
        ]);

    }

    public function ajaxEliminarCredencial(Request $request){
        $id = $request->input('id');

        if ($id) {
            $cred = CredencialPlataforma::find($id);

            $exito = $cred->delete();

            if (!(CredencialPlataforma::find($id))) {
                return json_encode(['code' => 200, 'msj' => 'Credencial eliminado exitosamente']);
            } else {
                return json_encode(['code' => 500, 'msj' => 'Error en el Proceso de eliminado de credencial. Consulte al Administrador']);
            }

        } else {

            return json_encode(['code' => 600, 'msj' => 'Error al eliminar el credencial. Consulte al Administrador']);
        }
    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){
            $data = CredencialPlataforma::find($id);

            return json_encode(['code' => 200, 'credencial' => $data]);
        }else{
            return json_encode(['code' => 500]);
        }

    }

    public function ajaxBuscar(Request $request){
        $data = $request->input('data');
        $offset = $request->input('offset');

        $nombrePlataforma           = $data['nombrePlataforma'];
        $nivelCredencial            = $data['nivelCredencial'];

        $query = CredencialPlataforma::whereNotNull('nombre_plataforma');

        if ($nombrePlataforma){
            $query->where(function ($q) use ($nombrePlataforma){
                $q->where('nombre_plataforma', 'like', '%'.$nombrePlataforma .'%');
            });
        }

        if($nivelCredencial){

            $query->where(function ($q) use ($nivelCredencial){
                $q->where('nivel_credencial', $nivelCredencial);
            });

        }

        $lista = $query;
        $cantidad = $lista->count();
        $data = getDataCredenciales($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'credenciales' => armarCredencialesData($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen credenciales recientes'
        ]);
    }
}
