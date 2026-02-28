<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateAdministradores;
use App\Models\Cargo;
use App\Models\EstadoCivil;
use App\Models\Nacionalidad;
use App\Models\Pais;
use App\Models\Rol;
use App\Models\TipoDocumento;
use App\Models\UsuarioInterno;
use App\Models\Views\DistritoView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function GuzzleHttp\json_encode;

class AdministradorController extends Controller
{
    public function index(){

        return view('Administradores.index');
    }

    public function viewNew(){

        return redirect('/usu-int');
    }

    public function viewEdit($id){

        return redirect('/usu-int');
    }

    public function ajaxNew(ValidateAdministradores $request){

        DB::beginTransaction();

        try{
            $data = $request->input('data');

            $imagen = $data['foto'] ?? null;
            $pathImagen = '';

            if($imagen){
                $extension = getBase64Extension($imagen);
                $pathImagen = saveImageGeneralS3($imagen, '', null,'administrador', $extension);
            }

            $ubicacion = formatText($data['ubicacion']);

            $dataUs = [
                'nombres'               => formatText($data['nombres']),
                'apellidos'             => formatText($data['apellidos']),
                'documentodelatera'     => $data['fotoDocumentoD'],
                'documentoposterior'    => $data['fotoDocumentoP'],
                'correo'                => formatText($data['correo']),
                'prefijo'               => 51,
                'telefono'              => formatText($data['telefono']),
                'cargo_id'              => formatText($data['cargo']),
                'fecha_nacimiento'      => $data['fechaNacimiento'] ? Carbon::parse($data['fechaNacimiento']) : null,
                'paisnacimiento_id'     => formatText($data['paisNacimiento']),
                'nacionalidad_id'       => formatText($data['nacionalidad']),
                'tipodocumento_id'      => formatText($data['tipoDocumento']),
                'numero_documento'      => formatText($data['numeroDocumento']),
                'domicilio'             => formatText($data['domicilio']),
                'departamento_id'       => saveUbicacion($ubicacion, 'departamento'),
                'provincia_id'          => saveUbicacion($ubicacion, 'provincia'),
                'distrito_id'           => saveUbicacion($ubicacion, 'distrito'),
                'sueldo'                => formatText($data['sueldo']),
                'foto'                  => $pathImagen,
                'password'              => bcrypt('1234')
            ];

            $exito = UsuarioInterno::create($dataUs);
            DB::commit();
            return response()->json(['code' => 200, 'msj' => 'Usuario creado exitosamente']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear usuario. Consulte al administrador' ]);
        }

    }

    public function ajaxEdit(ValidateAdministradores $request){

        $id = $request->input('id');
        $data = $request->input('data');

        $user = UsuarioInterno::find($id);
        $fotoOld = $user->foto;

        $imagen = $data['foto'] ? $data['foto'] : null;

        $pathImagen = $fotoOld; // mantener la foto actual por defecto

        if ($imagen && !isURL($imagen)) {
            $extension = getBase64Extension($imagen);
            $pathImagen = saveImageGeneralS3($imagen,'foto', $fotoOld, 'administrador', $extension, 'foto');
        }


        $ubicacion = formatText($data['ubicacion']);

        $dataUs = [
            'nombres'               => formatText($data['nombres']),
            'apellidos'             => formatText($data['apellidos']),
            'correo'                => formatText($data['correo']),
            'telefono'              => formatText($data['telefono']),
            'cargo_id'              => formatText($data['cargo']),
            'fecha_nacimiento'      => $data['fechaNacimiento'] ? Carbon::parse($data['fechaNacimiento']) : null,
            'paisnacimiento_id'     => formatText($data['paisNacimiento']),
            'nacionalidad_id'       => formatText($data['nacionalidad']),
            'tipodocumento_id'      => formatText($data['tipoDocumento']),
            'numero_documento'      => formatText($data['numeroDocumento']),
            'domicilio'             => formatText($data['domicilio']),
            'departamento_id'       => saveUbicacion($ubicacion, 'departamento'),
            'provincia_id'          => saveUbicacion($ubicacion, 'provincia'),
            'distrito_id'           => saveUbicacion($ubicacion, 'distrito'),
            'sueldo'                => formatText($data['sueldo']),
            'foto'                  => $pathImagen,
        ];

        DB::beginTransaction();

        try{
            $exito = UsuarioInterno::where('id', $id)->update($dataUs);
            DB::commit();
            return response()->json(['code' => 200, 'msj' => 'Usuario actualizado exitosamente']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el usuario. Consulte al administrador' ]);
        }

    }

    public function ajaxRefreshUsuariosInternos(){

        $result = [];

        $usu = getUsuariosInternos();

        if($usu){

            foreach ($usu as $d) {

                $o = UsuarioInterno::find($d->id);

                $result[] = [
                    'id'          => $d->id,
                    'nombres'     => $d->nombres,
                    'apellidos'   => $d->apellidos,
                    'correo'      => $d->correo,
                    'telefono'    => $d->telefono,
                    'cargo'       => Cargo::find($d->cargo_id)->nombre,
                    'online'      => $o->isOnline(),
                    'foto'        => $d->foto,
                    'activo'      => $d->activo,
                ];
            }
        }

        return response()->json([
            'code' => 200,
            'usuarios' => $result,
            'total' => count($result),
            'accessCom' => getAccessFunctions([3,5,7])
        ]);

    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = UsuarioInterno::find($id);

            return json_encode(['code' => 200, 'usuario' => $data]);


        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetData(){

        $cargos = Cargo::borrado(false)->orderBy('nombre', 'asc')->get();
        $tiposDocumento = TipoDocumento::whereIn('id', [1,4,7,8])->get();
        $paises = Pais::get();
        $nacionalidades= Nacionalidad::get();
        $ubicaciones = DistritoView::get();

        return response()->json([
            'code' => 200,
            'cargos' => $cargos,
            'tiposDocumento' => $tiposDocumento,
            'paises' => $paises,
            'nacionalidades' => $nacionalidades,
            'ubicaciones' => $ubicaciones,
        ]);

    }

    public function ajaxDelete(Request $request){
        $id = $request->input('id');
        $usuario = UsuarioInterno::find($id);
        if ($usuario){
            $exito = $usuario->delete();
            if (!(UsuarioInterno::find($id))){
                return json_encode(['code' => 200, 'msj' => 'Usuario eliminado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en al eliminar usuario. Consulte al Administrador']);
            }
        }else{
            return json_encode(['code' => 600, 'msj' => 'Error al eliminar usuario. Consulte al Administrador']);
        }
    }

    public function ajaxActive(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = UsuarioInterno::find($id);
            $registro->activo = !$registro->activo;

            if($registro->save()){

                return json_encode(['code' => 200, 'msj' => 'Usuario modificado exitosamnete']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema al modificar. Consulte al administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'No existe ID. Consulte al administrador']);
        }

    }

    public function ajaxGetUsuariosInternos(){
        $usuarios = UsuarioInterno::get();
        return json_encode(['code' => 200, 'usuarios' => $usuarios]);
    }

    public function ajaxResetPasswordUserInterno(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = UsuarioInterno::find($id);
            $registro->password = bcrypt('1234');

            if($registro->save()){

                return json_encode(['code' => 200, 'msj' => 'Contraseña reiniciada a 1234']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un error al resetear contraseña. Consulte al administrador']);
            }

        }else{

            return json_encode(['code' => 500, 'msj' => 'Ocurrio un error al resetear contraseña. Consulte al administrador']);
        }

    }

    public function ajaxSetPasswordUsuarioInterno(Request $request){


        try{

            $id = $request->input('id');
            $contra = $request->input('contra');

            $data = [
                'password'              => bcrypt($contra)
            ];

            $exito = UsuarioInterno::where('id', $id)->update($data);

            DB::commit();


            return response()->json(['code' => 200, 'msj' => 'Contraseña modificada', 'type' => 'exito']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al modificar la contraseña. Consulte al administrador', 'type' => 'error' ]);

        }
    }
}
