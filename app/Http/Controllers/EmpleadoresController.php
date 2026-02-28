<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateEmpleador;
use App\Http\Requests\ValidateEmpleadoresEdit;
use App\Http\Requests\ValidateEmpleadoresNew;
use App\Http\Requests\ValidateEmpleadorNew;
use App\Models\Departamento;
use App\Models\Domicilio;
use App\Models\Empleador;
use App\Models\EstadoCivil;
use App\Models\EstatusEmpleador;
use App\Models\Pais;
use App\Models\Requerimiento;
use App\Models\RequerimientoLink;
use App\Models\TipoDocumento;
use App\Models\TipoPersona;
use App\Models\Usuario;
use App\Models\UsuarioInterno;
use App\Models\Views\EmpleadorView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmpleadoresController extends Controller
{
    public function index(){

        return view('Empleadores.index');
    }

    public function viewNew(){

        return redirect('/empleadores');
    }

    public function viewEdit($id){

        return redirect('/empleadores');
    }

    public function ajaxNew(ValidateEmpleadoresNew $request){

        DB::beginTransaction();

        try{
            $data = $request->input('data');
            $usuid = $data['usuarioid'];

            $nombresEmleador = formatText($data['nombres']);
            $apellidosEmpleador = formatText($data['apellidos']);
            $telefonoEmpleador = formatText($data['telefono']);

            if($usuid){

                $dataUsu = [
                    'nombres'      => $nombresEmleador,
                    'apellidos'    => $apellidosEmpleador,
                    'correo'       => formatText($data['correo']),
                    'telefono'     => removeSpaceNumber($telefonoEmpleador),
                    'tipodocumento_id' => $data['tipodocumento'],
                    'numero_documento'  => $data['documento'],
                    'estadocivil_id'  => $data['estadocivil'],
                    'fecha_nacimiento' => $data['fechanacimiento'] ? Carbon::parse($data['fechanacimiento']) : null,
                    'paisnacimiento_id'  => $data['paisnacimiento'],
                    'departamentonacimiento_id'  => $data['departamentonacimiento'],
                    'lugar_nacimiento'  => formatText($data['lugarnacimiento'])
                ];

                $exito1 = Usuario::where('id', $usuid)->update($dataUsu);
                $idusuario = $usuid;

            }else{

                $dataUsu = [
                    'nombres'      => $nombresEmleador,
                    'apellidos'    => $apellidosEmpleador,
                    'correo'       => formatText($data['correo']),
                    'telefono'     => removeSpaceNumber($telefonoEmpleador),
                    'tipodocumento_id' => $data['tipodocumento'],
                    'numero_documento'  => $data['documento'],
                    'estadocivil_id'  => $data['estadocivil'],
                    'fecha_nacimiento' => $data['fechanacimiento'] ? Carbon::parse($data['fechanacimiento']) : null,
                    'paisnacimiento_id'  => $data['paisnacimiento'],
                    'departamentonacimiento_id'  => $data['departamentonacimiento'],
                    'lugar_nacimiento'  => formatText($data['lugarnacimiento']),
                    'verificar_telefono' => false,
                    'cambiar_password' => false,
                    'cuenta' => 'BERTHA',
                    'password'     => bcrypt('1234')
                ];

                $exito1 = Usuario::create($dataUsu);

                $idusuario = $exito1->id;
            }

            $token = generateTokenEmpleador( quitarTildes($nombresEmleador) , quitarTildes($apellidosEmpleador) );

            $dataEmp = [
                'pais_pedido_id' => $data['paispedido'],
                'nombre_empresa'    => $data['nombreempresa'],
                'ruc_empresa'    => $data['rucempresa'],
                'observaciones'  => formatText($data['observaciones']),
                'estatusempleador_id' => ($nombresEmleador && $apellidosEmpleador && $data['tipodocumento'] && $data['documento']) ? 2 : 1,
                'usuario_id' => $idusuario,
                'token' => $token,
            ];

            $work = almacenarToken($token, $idusuario, 'EMP');

            $exito2 = Empleador::create($dataEmp);

            $idempleador = $exito2->id;

            $domicilios = saveDomiciliosEmpleador($data['domicilios'], $idusuario);

            $emp = Empleador::find($idempleador);
            $estatusactual = $emp->estatusempleador_id;

            if( in_array($estatusactual, [1,2]) ){
                $estatusnew = isDataEmpleador($idempleador) ? 2 : 1;
            }

            $emp->update(['estatusempleador_id'  => $estatusnew]);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Empleador creado exitosamente']);

        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear postulante. Consulte al administrador' ]);
        }

    }

    public function ajaxEdit(ValidateEmpleadoresEdit $request){

        DB::beginTransaction();

        try{
            $data = $request->input('data');

            $id = $data['id'];

            $emp = Empleador::find($id);

            $nombresEmleador = formatText($data['nombres']);
            $apellidosEmpleador = formatText($data['apellidos']);
            $telefonoEmpleador = formatText($data['telefono']);

            //dd($data['domicilios']);

            $isTheSameEmpleador = ValidateNombresApellidos($id, $nombresEmleador, $apellidosEmpleador ,'empleador');

            $dataUsu = [
                'nombres'      => $nombresEmleador,
                'apellidos'    => $apellidosEmpleador,
                'correo'       => formatText($data['correo']),
                'telefono'     => removeSpaceNumber($telefonoEmpleador),
                'tipodocumento_id' => $data['tipodocumento'],
                'numero_documento'  => $data['documento'],
                'estadocivil_id'  => $data['estadocivil'],
                'fecha_nacimiento' => $data['fechanacimiento'] ? Carbon::parse($data['fechanacimiento']) : null,
                'paisnacimiento_id'  => $data['paisnacimiento'],
                'departamentonacimiento_id'  => $data['departamentonacimiento'],
                'lugar_nacimiento'  => formatText($data['lugarnacimiento'])
            ];

            $exito = Usuario::where('id', $emp->usuario_id)->update($dataUsu);

            $newToken = generateTokenFicha(quitarTildes($nombresEmleador), quitarTildes($apellidosEmpleador));

            $validateDuplicity = ($isTheSameEmpleador ==  true && $emp->token) ? true : false;

            $dataEmp = [
                'pais_pedido_id'        => $data['paispedido'],
                'nombre_empresa'        => $data['nombreempresa'],
                'ruc_empresa'           => $data['rucempresa'],
                'observaciones'         => formatText($data['observaciones']),
                'token'                 => $validateDuplicity == true ? $emp->token : $newToken,
                'usuariointerno_id'     => $data['responsable'] ? $data['responsable'] : null,
            ];

            if($validateDuplicity == false){
                $work = almacenarToken($newToken, $emp->usuario_id, 'EMP');
            }

            $exito2 = Empleador::where('id', $emp->id)->update($dataEmp);

            $domicilios = saveDomiciliosEmpleador($data['domicilios'], $emp->usuario_id);

            $emp = Empleador::find($id);
            $estatusactual = $emp->estatusempleador_id;

            if( in_array($estatusactual, [1,2]) ){
                $estatusnew = isDataEmpleador($id) ? 2 : 1;
            }else if($estatusactual == 3){
                $estatusnew = $estatusactual;
            }

            $emp->update(['estatusempleador_id'  => $estatusnew]);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Empleador actualizado exitosamente']);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar empleador. Consulte al administrador' ]);

        }

    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = EmpleadorView::find($id);
            $domicilios = Domicilio::borrado(false)->where('usuario_id', $data->usuario_id)->get();
            $dataUsuario = Usuario::find($data->usuario_id);

            $departamentos = Departamento::borrado(false)->where('pais_id', $dataUsuario->paisnacimiento_id ?? 54)->orderBy('nombre', 'asc')->get();

            return json_encode([
                'code' => 200,
                'data' => $data,
                'domicilios' => convertDomiciliosToObject($domicilios),
                'departamentos' => $departamentos

            ]);

        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetData(){

        $tipospersonas = TipoPersona::borrado(false)->orderBy('nombre', 'asc')->get();
        $tiposdocumentos = TipoDocumento::borrado(false)->orderBy('nombre', 'asc')->get();
        $estadosciviles = EstadoCivil::borrado(false)->orderBy('nombre', 'asc')->get();
        $paises = Pais::borrado(false)->orderBy('nombre', 'asc')->get();
        $departamentos = Departamento::borrado(false)->where('pais_id', 54)->orderBy('nombre', 'asc')->get();

        return response()->json(['code' => 200,
            'tipospersonas' =>$tipospersonas,
            'tiposdocumentos' => $tiposdocumentos,
            'estadosciviles' => $estadosciviles,
            'paises' => $paises,
            'departamentos' =>$departamentos,
        ]);

    }

    public function ajaxRefreshEmpleadores(Request $request){

        $offset = $request->input('offset');

        $lista = getNewEmpleadores();
        $cantidad = $lista->count();
        $data = getEmpleadores($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'empleadores' => formatDataEmpleador($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen empleadores actualizados para los últimos 7 días'
        ]);

    }

    public function ajaxGetDataInicial(){

        $estados = EstatusEmpleador::borrado(false)->orderBy('nombre', 'ASC')->get();
        $responsables = UsuarioInterno::borrado(false)->whereIn('id',[6,7,8])->orderBy('nombres', 'asc')->get();

        return response()->json([
            'code' => 200,
            'estados' => $estados,
            'responsables' => $responsables
        ]);

    }

    public function ajaxDtActive(Request $request){

        DB::beginTransaction();

        try{

            $estado = $request->input('estado');
            $empleadores = $request->input('empleadores');

            if($empleadores){

                foreach ($empleadores as $e){

                    $id = $e['id'];
                    $emp = Empleador::find($id);
                    $emp->activo = $estado ? true : false;
                    $emp->save();

                }

                DB::commit();

                return json_encode(['code' => 200, 'msj' => 'Estado cambiado exitosamente']);

            }else{

                return json_encode(['code' => 600, 'msj' => 'Error al cambiar de estado. Consulte al Administrador']);
            }

        }catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al modificar los empleadores. Consulte al administrador' ]);

        }

    }

    public function ajaxActive(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Empleador::find($id);
            $registro->activo = !$registro->activo;

            if($registro->save()){

                return json_encode(['code' => 200, 'msj' => 'Estado cambiado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el Proceso de cambio de estado. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al cambiar de estado. Consulte al Administrador']);
        }

    }

    public function ajaxGetLinkFormRequerimiento(Request $request){

        $link = '';

        $empleador_id = $request->input('id');

        if($empleador_id){

            $r = RequerimientoLink::borrado(false)->where('empleador_id', $empleador_id)->first();

            if($r){
                $link = 'https://holabertha.com//requerimiento/'. $r->token;
            }
        }

        return json_encode(['code' => 200, 'link' => $link]);

    }

    public function ajaxGenerateLinkFormRequerimiento(Request $request){

        DB::beginTransaction();

        try{

            $empleador_id = $request->input('empleador');

            $dataReq = [];

            if($empleador_id){

                $dataReq = [
                    'empleador_id'              => $empleador_id,
                    'creado'                    => Carbon::now(),
                    'actualizado'               => Carbon::now(),
                    'usuariointerno_id'           => 7
                ];

                $d = Requerimiento::create($dataReq);
                $idReq = $d->id;

                $empName = getPrimerNombre(EmpleadorView::find($empleador_id)->nombres);

                $r = new RequerimientoLink;
                $r->empleador_id = $empleador_id;
                $r->crm = 1;
                $r->token = mb_convert_case(quitarTildes($empName), MB_CASE_LOWER, "UTF-8") . '-' . generarTokenFormRequerimiento();
                $r->requerimiento_id = $idReq;
                $r->save();

                $link = config('webexperta.url-web') . '/requerimiento/' . $r->token;

                DB::commit();

                return json_encode(['code' => 200, 'msj' => 'Link generado exitosamente', 'link' => $link]);

            }else{

                return json_encode(['code' => 500, 'msj' => 'Error al generar link del formulario de requerimiento. Consulte al Administrador']);
            }

        }catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al generar link del formulario de requerimiento. Consulte al administrador' ]);

        }

    }

    public function ajaxRemoveLinkFormRequerimiento(Request $request){

        DB::beginTransaction();

        try{

            $empleador_id = $request->input('empleador');

            if($empleador_id){

                $r = RequerimientoLink::borrado(false)->where('empleador_id', $empleador_id)->first();
                $r->borrado = true;
                $r->save();

                DB::commit();

                return json_encode(['code' => 200, 'msj' => 'Link borrado exitosamente']);

            }else{

                return json_encode(['code' => 500, 'msj' => 'Error al borrar link. Consulte al Administrador']);
            }

        }catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al borrar link. Consulte al administrador' ]);

        }

    }

    public function ajaxBuscar(Request $request){

        $offset = $request->input('offset');
        $data = $request->input('data');

        $fechaactdesde      =   $data['fechaactdesde'] ? Carbon::parse($data['fechaactdesde']) : null;
        $fechaacthasta      =   $data['fechaacthasta'] ? Carbon::parse($data['fechaacthasta']) : null;
        $nombre             =   $data['empleador'];
        $documento          =   $data['documento'];
        $telefono           =   $data['telefono'];
        $estado             =   $data['estado'];
        $activo             =   $data['activo'];

        $query = EmpleadorView::orderBy('creado', 'DESC');

        if($fechaactdesde AND $fechaacthasta){

            $query->where(function ($q) use ($fechaactdesde, $fechaacthasta){
                $q->whereDate('actualizado', '>=', $fechaactdesde);
                $q->whereDate('actualizado', '<=', $fechaacthasta);
            });
        }

        if($fechaactdesde AND $fechaacthasta == null){

            $query->where(function ($q) use ($fechaactdesde){
                $q->whereDate('actualizado', '>=', $fechaactdesde);
            });
        }

        if($fechaactdesde == null AND $fechaacthasta){

            $query->where(function ($q) use ($fechaacthasta){
                $q->whereDate('actualizado', '<=', $fechaacthasta);
            });
        }

        if($nombre){

            $query->where(function ($q) use ($nombre){
                $q->where('empleador', 'like', '%'.$nombre .'%');
            });
        }

        if($documento){

            $query->where(function ($q) use ($documento){
                $q->where('numero_documento', 'like', '%'.$documento.'%');
            });
        }

        if($telefono){

            $query->where(function ($q) use ($telefono){
                $q->where('telefono', 'like', '%'.$telefono.'%');
            });
        }

        if($estado){

            $query->where(function ($q) use ($estado){
                $q->where('estatusid', $estado);
            });
        }

        if($activo){

            $query->where(function ($q) use ($activo){
                $q->where('activo', $activo == 'TRUE' ? true : false );
            });

        }else{

            $query->where(function ($q) use ($activo){
                $q->where('activo', true);
            });
        }

        $lista = $query;
        $cantidad = $lista->count();
        $data = getEmpleadores($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'empleadores' => formatDataEmpleador($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen empleadores recientes'
        ]);

    }

    public function ajaxBuscarVinculosEmpleador(Request $request){

        $idEmpleador = $request->input('idEmpleador');
        $vinculos = buscarVinculosEmpleador($idEmpleador);
        $listEmp = [];

        if ($vinculos['total'] != 0){
            $otrosEmpleadores = EmpleadorView::whereNotIn('id', [$idEmpleador])->get();

            foreach ($otrosEmpleadores as $emp){
                $d = [
                    'id'                => $emp->id,
                    'name'              => $emp->empleador,
                    'value'             => $emp->id,
                    'label'             => $emp->empleador,
                ];

                array_push($listEmp, $d);
            }
        }

        return response()->json([
            'code' => 200,
            'data' => $vinculos['total'] != 0 ? $vinculos : null,
            'listEmp'  => $listEmp,
        ]);
    }

    public function ajaxTransferirDataEmpleador(Request $request){
        $idOldEmpleador = $request->input('idOldEmpleador');
        $newEmpleador = $request->input('newEmpleador');
        $idNewEmpleador = $newEmpleador['id'];

        DB::beginTransaction();
        try {
            $r = transferirDatosEmpleador($idOldEmpleador, $idNewEmpleador);

            $emp = Empleador::find($idOldEmpleador);
            $usu = Usuario::find($emp->usuario_id);

            $e1 = $emp->delete();
            $e2 = $usu->delete();

            DB::commit();

            return json_encode(['code' => 200, 'msj' => 'Transferencia exitosa']);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return json_encode(['code' => 500, 'msj' => 'Error al transferir data. Consulte al Administrador']);
        }

    }

    public function ajaxEliminarDataEmpleador(Request $request){
        $idOldEmpleador = $request->input('idOldEmpleador');

        DB::beginTransaction();
        try {
            $r = eliminarDatosEmpleador($idOldEmpleador);

            $emp = Empleador::find($idOldEmpleador);
            $usu = Usuario::find($emp->usuario_id);

            $e1 = $emp->delete();
            $e2 = $usu->delete();

            DB::commit();

            return json_encode(['code' => 200, 'msj' => 'Eliminación exitosa']);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return json_encode(['code' => 500, 'msj' => 'Error al eliminar al trabajador. Consulte al Administrador']);
        }

    }
}
