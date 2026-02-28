<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateSearchUser;
use App\Models\Actividad;
use App\Models\Departamento;
use App\Models\Distrito;
use App\Models\Domicilio;
use App\Models\Empleador;
use App\Models\Provincia;
use App\Models\TipoBeneficio;
use App\Models\Usuario;
use App\Models\Views\DistritoView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MasterController extends Controller
{
    public function ajaxSearchDistrito(Request $request){

        $search = $request->input('search');
        $paisPostulando = $request->input('paisPostulando');

        if ($paisPostulando){
            $data = DistritoView::where('pais_id', $paisPostulando)->where('distritostres', 'LIKE','%' . $search . '%')->get();
        }else{
            $data = DistritoView::where('distritostres', 'LIKE','%' . $search . '%')->get();
        }

        return json_encode(['code' => 200, 'data' => convertFormatDistritosSelect($data)]);

    }

    public function ajaxSetDistrito(Request $request){
        $domicilio = $request->input('domicilio');
        $findDom = Domicilio::find($domicilio);
        $distrito = convertDistritoToObject($findDom['distrito_id']);
        $s1 = findDistrito($findDom['distrito_id']);

        $viewDom = str_replace(' ', '%20',(generateLinkGoogleMapCopy( $findDom['direccion'], $s1['distritos'])));

        return response()->json([
            'code' => 200,
            'distrito' => $distrito,
            'referencia' => $findDom['referencia'],
            'linkDomicilio' => $viewDom,
            'tipoVivienda' => $findDom['tipovivienda_id'],
            'numeroPisos'   => $findDom['numero_pisos']
        ]);

    }

    public function ajaxGetActividadesList(Request $request){

        $genero = $request->input('genero');
        $paispostulando = $request->input('paispostulando');

        $actList = [];
        foreach (Actividad::whereIn('id',[1,6,10])->get() as $a){
            $actList[] = [
                'value' => $a->id,
                'label' => $a->nombre
            ];
        }

        return json_encode([
            'code' => 200,
            'actividades' => formatMultiselectActividad($genero, $paispostulando),
            'actividadDefault' => $actList,
        ]);

    }

    public function ajaxGetProvinciasByDepartamento(Request $request){

        $departamento = $request->input('departamento');

        $provincias = Provincia::borrado(false)->where('departamento_id', $departamento)->orderBy('nombre', 'asc')->get();

        return json_encode(['code' => 200, 'provincias' => $provincias]);

    }

    public function ajaxGetDistritosByProvincia(Request $request){

        $provincia = $request->input('provincia');

        $distritos = Distrito::borrado(false)->where('provincia_id', $provincia)->orderBy('nombre', 'asc')->get();

        return json_encode(['code' => 200, 'distritos' => $distritos]);

    }

    public function ajaxGetDepartamentosByNacionalidad(Request $request){

        $paisNacimiento = $request->input('paisNacimiento');

        $departamentos = Departamento::borrado(false)->where('pais_id', $paisNacimiento)->orderBy('nombre', 'asc')->get();

        return json_encode(['code' => 200, 'departamentos' => $departamentos]);

    }

    public function ajaxGetActividadesByGenero(Request $request){

        $genero = $request->input('genero');

        $actividades = Actividad::borrado(false)->genero($genero)->orderBy('nombre', 'asc')->get();

        return json_encode(['code' => 200, 'actividades' => formatMultiselect($actividades)]);

    }

    public function ajaxGetAllDistritos(Request $request){

        $distritos = DistritoView::all();

        return json_encode(['code' => 200, 'distritos' => convertFormatDistritosSelect($distritos), 'distritosverificaciones' => convertFormatDistritosProvinciaSelect($distritos)]);

    }

    public function ajaxSearchDistritoExperiencia(Request $request){

        $search = $request->input('search');

        $data = DistritoView::where('distritostres', 'LIKE','%' . $search . '%')->get();

        return json_encode(['code' => 200, 'data' => convertFormatDistritosSelect($data)]);

    }

    public function ajaxSearchEmpleadores(Request $request){

        $search = $request->input('search');

        $data = \App\Models\Views\EmpleadorView::borrado(false)->activo(true)->where('empleador', 'LIKE','%' . $search . '%')->whereIn('estatusid', [1,2])->orderBy('empleador', 'asc')->get();

        return json_encode(['code' => 200, 'data' => convertFormatEmpleadoresSelect($data)]);

    }

    public function ajaxSearchTrabajadoresPorColocar(Request $request){

        $search = $request->input('search');

        $data = \App\Models\Views\TrabajadorView::whereIn('estadoid', [1])->where('trabajador', 'LIKE','%' . $search . '%')->orderBy('nombres', 'asc')->get();

        return json_encode(['code' => 200, 'data' => convertFormatTrabajadoresSelect($data)]);

    }

    public function ajaxSearchUser(ValidateSearchUser $request){

        $search = $request->input('search');

        $usuDocumento = Usuario::where('numero_documento', $search)->first();

        if($usuDocumento){
            return json_encode(['code' => 200, 'usuario' => $usuDocumento, 'trabajador' => $usuDocumento->isTrabajador(), 'empleador' => $usuDocumento->isEmpleador()]);
        }

        $usuCorreo = Usuario::where('correo', $search)->first();

        if($usuCorreo){
            return json_encode(['code' => 200, 'usuario' => $usuCorreo, 'trabajador' => $usuCorreo->isTrabajador(), 'empleador' => $usuCorreo->isEmpleador()]);
        }

        $usuTelefono = Usuario::where('telefono', $search)->first();

        if($usuTelefono){
            return json_encode(['code' => 200, 'usuario' => $usuTelefono, 'trabajador' => $usuTelefono->isTrabajador(), 'empleador' => $usuTelefono->isEmpleador()]);
        }

        return json_encode(['code' => 500, 'msj' => 'No existe usuario']);

    }

    public function ajaxEliminarEmpleador(Request $request){
        $id = $request->input('id');

        if ($id) {
            $emp = Empleador::find($id);
            $usu = Usuario::find($emp->usuario_id);

            $exito = $emp->delete();
            $exito1 = $usu->delete();

            if (!(Empleador::find($id))) {
                return json_encode(['code' => 200, 'msj' => 'Empleador eliminado exitosamente']);
            } else {
                return json_encode(['code' => 500, 'msj' => 'Error en el Proceso de eliminado de empleador. Consulte al Administrador']);
            }

        } else {

            return json_encode(['code' => 600, 'msj' => 'Error al eliminar el empleador. Consulte al Administrador']);
        }
    }

    public function ajaxSetNewTiposBeneficios(Request $request){
        $paisID = intval($request->input('paisID'));
        $l = [1,2];

        if ($paisID == 49){
            $l = [7,8,9];
        }else if ($paisID == 11){
            $l = [5,6];
        }

        return response()->json([
            'code' => 200,
            'tiposBeneficios' => TipoBeneficio::whereIn('id', $l)->get(),
        ]);

    }

    public function ajaxSetDivisaPais(Request $request){
        $paisID = $request->input('paisID');

        return response()->json([
            'code' => 200,
            'divisa' => getDivisaDetails($paisID),
        ]);

    }

    public function ajaxSaveNewEmpleador(Request $request){
        DB::beginTransaction();

        try{
            $empleador = $request->input('nuevoEmpleador');

            $dataUsu = [
                'nombres'           => $empleador['nombres'],
                'apellidos'         => $empleador['apellidos'],
                'telefono'          => $empleador['telefono'],
                'telefono_whatsapp' => $empleador['telefono'],
                'cuenta'            => 'BERTHA',
                'tipo_usuario_login'=> 'CLI',
                'password'          => bcrypt('1234'),
                'creado'            => Carbon::now(),
                'actualizado'       => Carbon::now(),
            ];

            $exito = Usuario::create($dataUsu);

            $idUsu = $exito->id;

            $token = generateTokenEmpleador( quitarTildes($empleador['nombres']) , quitarTildes($empleador['apellidos']) );

            $dataEmp = [
                'usuario_id'            => $idUsu,
                'estatusempleador_id'   => '1',
                'token'                 => $token,
                'creado'                => Carbon::now(),
                'actualizado'           => Carbon::now(),

            ];

            $work = almacenarToken($token, $idUsu, 'EMP');

            $exito1 = Empleador::create($dataEmp);

            DB::commit();

            return response()->json([
                'code'      => 200,
                'type'      => 'exito' ,
                'msj'       => 'Empleador creado exitosamente',
                'telefono'  => $empleador['telefono'],
                'domicilio' => $exito1->id,
                'empleador' => getEmpleadorMS($exito1->id),
            ]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'type' => 'error' , 'msj' => 'Ocurrio un problema al crear empleador. Consulte al administrador' ]);

        }

    }

    public function ajaxSaveNewDomicilioEmpleador(Request $request){
        DB::beginTransaction();

        try{

            $idEmpleador = $request->input('empleador');
            $domicilio = $request->input('nuevoDomicilio');
            $distrito = findDistrito($domicilio['distrito']['value']);
            $usuario = findUsuario($idEmpleador);

            $dataDom = [
                'nombre'            => 'PRINCIPAL',
                'direccion'         => $domicilio['direccion'],
                'referencia'        => $domicilio['referencia'],
                'latitud'           => $domicilio['latitud'],
                'longitud'          => $domicilio['longitud'],
                'usuario_id'        => $usuario,
                'principal'         => 1,
                'departamento_id'   => $distrito['departamento_id'],
                'provincia_id'      => $distrito['provincia_id'],
                'distrito_id'       => $distrito['id'],
                'creado'            => Carbon::now(),
                'actualizado'       => Carbon::now(),

            ];

            $exito = Domicilio::create($dataDom);

            DB::commit();

            $domicilios = Domicilio::borrado(false)->activo(true)->where('usuario_id', $usuario)->get();

            $viewDom = str_replace(' ', '%20',generateLinkGoogleMapCopy( $domicilio['direccion'], $distrito['distritos']));

            return response()->json([
                'code' => 200,
                'type' => 'exito' ,
                'msj' => 'Domicilio creado exitosamente',
                'referencia' => $exito->referencia,
                'domicilio' => $exito->id,
                'domicilios' => $domicilios,
                'linkDomicilio' => $viewDom,
                'distrito' => convertDistritoToObject($distrito['id'])
            ]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'type' => 'error' , 'msj' => 'Ocurrio un problema al crear empleador. Consulte al administrador' ]);

        }

    }

    public function ajaxGetDomicilioData(Request $request){
        $domicilioid = $request->input('domicilioid');
        $domicilio = Domicilio::find($domicilioid);
        return response()->json([
            'code'  => 200,
            'data'  => $domicilio,
        ]);
    }
}
