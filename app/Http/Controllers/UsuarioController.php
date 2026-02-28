<?php

namespace App\Http\Controllers;

use App\Models\Empleador;
use App\Models\HistorialToken;
use App\Models\Trabajador;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsuarioController extends Controller
{
    public function ajaxVerificarNumero(Request $request){
        $numero = $request->input('numero');
        $tipo = $request->input('tipo');
        $usuarioPhone = Usuario::where('telefono', removeSpaceNumber($numero))->first();
        $usuarioID = Usuario::where('numero_documento', removeSpaceNumber($numero))->first();
        $defaultMSJ = 'No hay usuario registrado.';

        if ($tipo == 'phone'){
            return response()->json([
                'estatusNumber' => $usuarioPhone ? ('Usuario Registrado: ' . $usuarioPhone->nombres . ' ' . $usuarioPhone->apellidos . ' (USUARIO ID: ' . $usuarioPhone->id . ').') : $defaultMSJ,
                'iconEstatusNumber' => $usuarioPhone ? 'fas fa-times' : 'fas fa-check',
                'existDuplicityNumber' => $usuarioPhone ? 1 : 2,
            ]);
        }else if($tipo == 'ID'){
            return response()->json([
                'estatusDocumentoID' => $usuarioID ? ('Usuario Registrado: ' . $usuarioID->nombres . ' ' . $usuarioID->apellidos . ' (USUARIO ID: ' . $usuarioID->id . ').') : $defaultMSJ,
                'iconEstatusDocumentoID' => $usuarioID ? 'fas fa-times' : 'fas fa-check',
                'existDuplicityDocumentoID' => $usuarioID ? 1 : 2,
            ]);
        }

    }

    public function ajaxVerificarNumeroDocumento(Request $request){
        $numero = $request->input('numero');
        $usuario = Usuario::where('numero_documento', removeSpaceNumber($numero))->first();

        if ($usuario){
            return response()->json([
                'estatusNumber' => 'Usuario Registrado: ' . $usuario->nombres . ' ' . $usuario->apellidos . ' (USUARIO ID: ' . $usuario->id . ').',
                'iconEstatusNumber' => 'fas fa-times',
                'existDuplicity' => 1,
            ]);
        }else{
            return response()->json([
                'estatusNumber' => 'No hay usuario registrado.',
                'iconEstatusNumber' => 'fas fa-check',
                'existDuplicity' => 2,
            ]);
        }
    }

    public function ajaxSearchUsuarios(Request $request){
        $id = $request->input('id');
        $numeroDocumento = $request->input('numeroDocumento');
        $telefono = $request->input('telefono');

        $query = Usuario::orderBy('actualizado', 'DESC');

        if ($id){
            $query->where(function ($q) use ($id){
                $q->where('id', $id);
            });
        }

        if ($numeroDocumento){
            $query->where(function ($q) use ($numeroDocumento){
                $q->where('numero_documento', 'like', '%'.$numeroDocumento .'%');
            });
        }

        if ($telefono){
            $query->where(function ($q) use ($telefono){
                $q->where('telefono', 'like', '%'.$telefono .'%')
                    ->orWhere('telefono_whatsapp', 'like', '%'.$telefono .'%');
            });
        }

        $total = $query->count();
        $items = $query->get();

        return response()->json([
            'code' => 200,
            'usuarios' => formatDataUsuarios($items),
            'total' => $total,
        ]);

    }

    public function ajaxRegistrarUsuarioPostulante(Request $request){
        $id = $request->input('id');
        $data = Usuario::find($id);
        $token = generateTokenFicha(quitarTildes($data->nombres), quitarTildes($data->apellidos));

        DB::beginTransaction();
        $dataTra = [
            'usuario_id'                    => $id,
            'estatuspostulante_id'          => 7,
            'likes'                         => json_encode(["21.234.234.1","11.0.0.2","32.0.0.3","33.0.0.4","0.44.0.5","0.55.0.6","0.2.0.7","0.0.42.8","55.0.0.9","3.0.0.10"]),
            'historial_contacto'            => json_encode([]),
            'token'                         => $token,
        ];
        try{
            $t = Trabajador::create($dataTra);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Postulante creado exitosamente']);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'code' => 500,
                'msj' => 'Ocurrio un problema al crear postulante. Consulte al administrador'
            ]);
        }


    }

    public function ajaxSetPasswordUser(Request $request){

        $s1 = '';

        try{
            $id = $request->input ('id');
            $contra = $request->input ('contra');
            $tipoUser = $request->input ('tipoUser');

            $data = [
                'password'              => bcrypt($contra)
            ];

            if ($tipoUser == 'empleador'){
                $s1 = Empleador::find($id);
            }else if ($tipoUser == 'trabajador'){
                $s1 = Trabajador::find($id);
            }

            $user = Usuario::find($s1->usuario_id);

            $exito = Usuario::where('id', $user->id)->update($data);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Contraseña modificada', 'type' => 'exito']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al modificar la contraseña. Consulte al administrador', 'type' => 'error' ]);

        }

    }

    public function ajaxAlmacenarTokensVarios(Request $request){
        $tipo = $request->input ('tipo');

        if ($tipo == 'EMP'){
            $data = Empleador::whereNotNull('token')->get();
        }else if ($tipo == 'TRA'){
            $data = Trabajador::whereNotNull('token')->get();
        }

        DB::beginTransaction();

        try{

            foreach ($data as $d){

                $info = [
                    'usuario_id'        => $d->usuario_id,
                    'token'             => $d->token,
                    'tipo'              => $tipo,
                    'creado'            => Carbon::now(),
                    'actualizado'       => Carbon::now(),
                ];

                $exito = HistorialToken::create($info);

                DB::commit();
            }

            return response()->json(['code' => 200, 'msj' => 'Tokens creados exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear empleador. Consulte al administrador' ]);

        }
    }
}
