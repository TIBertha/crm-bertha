<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateRequerimientos;
use App\Http\Requests\ValidateRequerimientosEdit;
use App\Http\Requests\ValidateRequerimientosNew;
use App\Models\Actividad;
use App\Models\Contrato;
use App\Models\DiaSemana;
use App\Models\Domicilio;
use App\Models\Empleador;
use App\Models\EstatusEmpleador;
use App\Models\FrecuenciaServicio;
use App\Models\Modalidad;
use App\Models\Nacionalidad;
use App\Models\Pais;
use App\Models\RangoEdad;
use App\Models\Requerimiento;
use App\Models\RequerimientoPostulacion;
use App\Models\TipoBeneficio;
use App\Models\TipoContrato;
use App\Models\TipoDescanso;
use App\Models\TipoVivienda;
use App\Models\Usuario;
use App\Models\UsuarioInterno;
use App\Models\Views\EmpleadorView;
use App\Models\Views\RequerimientoView;
use App\Models\Views\TrabajadorView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function GuzzleHttp\json_encode;

class RequerimientosController extends Controller
{
    public function index(){

        return view('Requerimientos.index');
    }

    public function viewNew(){

        return redirect('/requerimientos');
    }

    public function viewEdit($id){

        return redirect('/requerimientos');
    }

    public function ajaxNew(ValidateRequerimientosNew $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');
            $horaSalida = $request->input('horasalida');
            $horaRetorno = $request->input('horaretorno');
            $horaEntrevista = $request->input('horaentrevista');

            $tipoemp = $data['tipoempleador'];
            $responsable = $data['responsable'];

            if($tipoemp == 2){

                $dataUsu = [
                    'nombres'          => formatText($data['nombres']),
                    'apellidos'        => formatText($data['apellidos']),
                    'correo'           => formatText($data['correo']),
                    'telefono'         => formatText($data['telefono']),
                    'verificar_telefono' => false,
                    'cambiar_password' => false,
                    'cuenta'           => 'BERTHA',
                    'password'         => bcrypt('1234')
                ];

                $usu = Usuario::create($dataUsu);
                $usuarioid = $usu->id;

                $dataEmp = [
                    'estatusempleador_id' => 1,
                    'usuario_id' => $usuarioid,
                    'usuariointerno_id' => $responsable
                ];

                $emp = Empleador::create($dataEmp);
                $idempleador = $emp->id;

                $emp2 = Empleador::find($idempleador);
                $estatusactual = $emp2->estatusempleador_id;

                if(in_array($estatusactual, [1,2])){
                    $estatusnew = isDataEmpleador($idempleador) ? 2 : 1;
                }

                $dataEmp = [
                    'estatusempleador_id'  => $estatusnew
                ];

                $emp2->update($dataEmp);

            }else{

                $empleador = getValueSelectSingle($data['empleador']);

            }

            $dom = getDepartamentoProvinciaDistrito($data['distrito']);

            $actividadid = $data['actividad'];
            $modalidad = $data['modalidad'];
            $listaEdadNinos = $data['edadninos'] ? json_encode($data['edadninos']) : '';
            $listaEdadAdulto = $data['edadadulto'] ? json_encode($data['edadadulto']) : '';
            $rangobusqueda = saveRangoBusqueda($data['rangominimo'], $data['rangomaximo']);

            $getDomicilio = Domicilio::find($data['domicilio']);
            if (!($getDomicilio->tipovivienda_id AND $getDomicilio->numero_pisos)){
                $dataDom = [
                    'tipovivienda_id'   => $data['tipovivienda'],
                    'numero_pisos'      => $data['numpisos'],
                ];
                $f = Domicilio::where('id', $data['domicilio'])->update($dataDom);
            }

            $garantia = 3;
            if ($data['tipoComision'] == 1){
                $garantia = 2;
            }else if ($data['tipoComision'] == 2){
                $garantia = 1;
            }else if ($data['tipoComision'] == 3){
                $garantia = 1;
            }else  if ($data['tipoComision'] == 4){
                $garantia = 1;
            }

            $dataReq = [
                'garantia'          => $garantia,
                'tipocomision'      => $data['tipoComision'],
                'monto_comision'      => $data['montoComision'],
                'paispedido_id'  => $data['paispedido'],
                'confirmacion_adelanto'  => $data['confirmacionAdelanto'],
                'adjunto_adelanto'  => $data['adjuntoAdelanto'],
                //'tipobeneficio_id' => $data['paispedido'] == 54 ? $data['tipoBeneficio'] : null,
                'tipobeneficio_id' => $data['tipoBeneficio'],
                'edad_nino'        => $listaEdadNinos,
                'edad_adulto'      => $listaEdadAdulto,
                'numero_adultos'   => (in_array($actividadid, [3,10])) ? countList($listaEdadAdulto) : $data['numadultos'],
                'numero_ninos'     => (in_array($actividadid, [1,2,4,5,6,7,9])) ? (countList($listaEdadNinos) > 0 ? countList($listaEdadNinos) : 0) : ($data['numninos'] ? $data['numninos'] : 0),
                'empleador_id'     => $tipoemp == 2 ? $idempleador : $empleador,
                'tipocontrato_id'  => $data['tipocontrato'],
                'actividad_id'     => $data['actividad'],
                'modalidad_id'     => $modalidad,
                'nacionalidad_busqueda'  => $data['nacionalidad'],
                'rangoedad_id'     => $rangobusqueda,
                'departamento_id'  => $dom ? $dom['departamento'] : null,
                'provincia_id'     => $dom ? $dom['provincia'] : null,
                'distrito_id'      => $dom ? $dom['distrito'] : null,
                'tiempo_cuarentena'=> $data['cuarentena'] ? $data['cuarentena'] : null,
                'tipovivienda_id'  => $data['tipovivienda'],
                'numero_pisos'     => $data['numpisos'],
                'numero_mascotas'  => $data['nummascotas'] ? $data['nummascotas'] : 0,
                'fecha_entrevista' => $data['fechaentrevista'] ? Carbon::parse($data['fechaentrevista']) : null,
                'fecha_inicio_labores' => $data['fechainiciolabores'] ? Carbon::parse($data['fechainiciolabores']) : null,
                'hora_entrevista'  => $horaEntrevista ? Carbon::parse($horaEntrevista) : null,
                'observaciones'    => $data['observaciones'],
                'observaciones_web'=> $data['observacionesWeb'],
                'diagnostico'      => $data['diagnostico'],
                'fecha'            => Carbon::now(),
                'trabajadores_id'  => saveFormatMultiselect($data['trabajador']),
                'seguimientos'     => saveFormatSeguimiento($data['seguimientos']),
                'cantidad_persona_atender' => ((int)$data['numadultos'] ? (int)$data['numadultos'] : 0) + ((int)$data['numbebes'] ? (int)$data['numbebes'] : 0 ) + ((int)$data['numninos'] ? (int)$data['numninos'] : 0),
                'frecuenciaservicio_id' => $modalidad == 3 ? $data['frecuencia'] : null,
                'valor_dia_frecuencia' => $modalidad == 3 ? $data['valordiafrecuencia'] : null,
                'sueldo'           => $modalidad == 3 ? ($data['frecuencia'] * $data['valordiafrecuencia'] * 4) : $data['sueldo'],
                'sueldo_por_dias' => $modalidad == 3 ? ($data['frecuencia'] * $data['valordiafrecuencia'] * 4) : null,
                'horarios' => $modalidad == 1 ? null : ($data['horarios'] ? json_encode($data['horarios']) : null),
                'dia_salida' => $modalidad == 1 ? ($data['diasalida'] ? $data['diasalida'] : null) : null,
                'hora_salida' => $modalidad == 1 ? ($horaSalida ? Carbon::parse($horaSalida) : null) : null,
                'dia_ingreso' => $modalidad == 1 ? ($data['diaretorno'] ? $data['diaretorno'] : null) : null,
                'hora_ingreso' => $modalidad == 1 ? ($horaRetorno ? Carbon::parse($horaRetorno) : null) : null,
                'estatusrequerimiento_id'  => 1,
                'domicilio_id' => $data['domicilio'],
                'monto_adelanto' => $data['montoAdelanto'],
                'fecha_pago_adelanto' => $data['fechaPagoAdelanto'] ? Carbon::parse($data['fechaPagoAdelanto']) : null,

            ];

            $exito = Requerimiento::create($dataReq);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Requerimiento creado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            dd($e);

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear requerimiento. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateRequerimientosEdit $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');
            $horaSalida = $request->input('horasalida');
            $horaRetorno = $request->input('horaretorno');
            $horaEntrevista = $request->input('horaentrevista');
            $id = $request->input('id');

            $req = Requerimiento::find($id);
            $estatusReq = $req->estatusrequerimiento_id;
            $dom = getDepartamentoProvinciaDistrito($data['distrito']);
            $listaEdadNinos = $data['edadninos'] ? json_encode($data['edadninos']) : null;
            $listaEdadAdulto = $data['edadadulto'] ? json_encode($data['edadadulto']) : null;
            $actividadid = $data['actividad'];
            $modalidad = $data['modalidad'];
            $rangobusqueda = saveRangoBusqueda($data['rangominimo'], $data['rangomaximo']);

            $dataReq = [
                'tipocomision'      => $data['tipoComision'],
                'monto_comision'      => $data['montoComision'],
                'paispedido_id'  => $data['paispedido'],
                'confirmacion_adelanto'  => $data['confirmacionAdelanto'],
                'actividad_id'     => $data['actividad'],
                'modalidad_id'     => $modalidad,
                'tipobeneficio_id' => $data['paispedido'] == 54 ? $data['tipoBeneficio'] : null,
                'edad_nino'        => $listaEdadNinos,
                'edad_adulto'      => $listaEdadAdulto,
                'numero_adultos'   => (in_array($actividadid, [3,10])) ? countList($listaEdadAdulto) : ($data['numadultos']),
                'numero_ninos'     => (in_array($actividadid, [1,2,4,5,6,7,9])) ? (countList($listaEdadNinos) > 0 ? countList($listaEdadNinos) : 0) : ($data['numninos']  ? $data['numninos'] : 0),
                'nacionalidad_busqueda'  => $data['nacionalidad'],
                'rangoedad_id'     => $rangobusqueda,
                'tipovivienda_id'  => $data['tipovivienda'],
                'departamento_id'  => $dom ? $dom['departamento'] : null,
                'provincia_id'     => $dom ? $dom['provincia'] : null,
                'distrito_id'      => $dom ? $dom['distrito'] : null,
                'numero_pisos'     => $data['numpisos'],
                'numero_mascotas'  => $data['nummascotas'] ? $data['nummascotas'] : 0,
                'fecha_entrevista' => $data['fechaentrevista'] ? Carbon::parse($data['fechaentrevista']) : null,
                'fecha_inicio_labores' => $data['fechainiciolabores'] ? Carbon::parse($data['fechainiciolabores']) : null,
                'hora_entrevista'  => $horaEntrevista ? Carbon::parse($horaEntrevista) : null,
                'diagnostico'      => $data['diagnostico'],
                'observaciones'    => $data['observaciones'],
                'observaciones_web'=> $data['observacionesWeb'],
                'trabajadores_id'  => saveFormatMultiselect($data['trabajador']),
                'seguimientos'     => saveFormatSeguimiento($data['seguimientos']),
                'cantidad_persona_atender' => ((int)$data['numadultos'] ? (int)$data['numadultos'] : 0) + ((int)$data['numbebes'] ? (int)$data['numbebes'] : 0 ) + ((int)$data['numninos'] ? (int)$data['numninos'] : 0),
                'frecuenciaservicio_id' => $modalidad == 3 ? $data['frecuencia'] : null,
                'valor_dia_frecuencia' => $modalidad == 3 ? $data['valordiafrecuencia'] : null,
                'sueldo'           => $modalidad == 3 ? ($data['frecuencia'] * $data['valordiafrecuencia'] * 4) : $data['sueldo'],
                'sueldo_por_dias' => $modalidad == 3 ? ($data['frecuencia'] * $data['valordiafrecuencia'] * 4) : null,
                'tiempo_cuarentena'=> ( $data['cuarentena'] ) ? $data['cuarentena'] : null,
                'horarios' => $modalidad == 1 ? null : ($data['horarios'] ? json_encode($data['horarios']) : null),
                'dia_salida' => $modalidad == 1 ? ($data['diasalida'] ? $data['diasalida'] : null) : null,
                'hora_salida' => $modalidad == 1 ? ($horaSalida ? Carbon::parse($horaSalida) : null) : null,
                'dia_ingreso' => $modalidad == 1 ? ($data['diaretorno'] ? $data['diaretorno' ] : null) : null,
                'hora_ingreso' => $modalidad == 1 ? ($horaRetorno ? Carbon::parse($horaRetorno) : null) : null,
                'domicilio_id' => $data['domicilio'],
                'monto_adelanto' => $data['montoAdelanto'],
                'fecha_pago_adelanto' => $data['fechaPagoAdelanto'] ? Carbon::parse($data['fechaPagoAdelanto']) : null,
            ];

            if($estatusReq == 4){
                $dataReq['estatusrequerimiento_id'] = 1;
            }else{
                $dataReq['estatusrequerimiento_id'] = $estatusReq;
            }

            $registro = $req->update($dataReq);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Requerimiento actualizado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            dd($e);

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el requerimiento. Consulte al administrador' ]);

        }

    }

    public function ajaxBuscar(Request $request){

        $data = $request->input('data');

        $codigo           = $data['codigo'];
        $empleador        = $data['empleador'];
        $emptelefono      = $data['empleadortelefono'];
        $fecha            = $data['fecha'] ? Carbon::parse($data['fecha']) : null;
        $fechaentrevista  = $data['fechaentrevista'] ? Carbon::parse($data['fechaentrevista']) : null;
        $actividad        = $data['actividad'];
        $modalidad        = $data['modalidad'];
        $responsable      = $data['responsable'];
        $distrito         = $data['distrito'];
        $estado           = $data['estado'];
        $offset = $request->input('offset');

        $query = $this->queryFind($codigo, $modalidad, $empleador, $distrito, $estado, $fecha, $fechaentrevista, $actividad, $emptelefono, $responsable);

        $lista = $query;
        $cantidad = $lista->count();
        $data = getDataRequerimientos($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'requerimientos' => processDataRequerimiento($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen requerimientos recientes'
        ]);

    }

    public function queryFind($codigo, $modalidad, $empleador, $distrito, $estado, $fecha, $fechaentrevista, $actividad, $empleadortelefono){

        $query = RequerimientoView::whereIn('estatusrequerimientoid', [1,2,3,4]);

        if($codigo){

            $query->where(function ($q) use ($codigo){
                $q->where('id', $codigo);
            });
        }

        if($modalidad){

            $query->where(function ($q) use ($modalidad){
                $q->where('modalidadid', $modalidad);
            });
        }

        if($empleador){

            $query->where(function ($q) use ($empleador){
                $q->where('empleador', 'like', '%'.$empleador .'%');
            });
        }

        if($distrito){

            $query->where(function ($q) use ($distrito){
                $q->where('distrito', 'like', '%'.$distrito .'%');
            });
        }

        if($estado){

            $query->where(function ($q) use ($estado){
                $q->where('estatusrequerimientoid', $estado);
            });

        }

        if($fecha){

            $query->where(function ($q) use ($fecha){
                $q->whereDate('actualizado', $fecha);
            });
        }

        if($fechaentrevista){

            $query->where(function ($q) use ($fechaentrevista){
                $q->whereDate('fechaentrevista', $fechaentrevista);
            });
        }

        if($actividad){

            $query->where(function ($q) use ($actividad){
                $q->where('actividadid', $actividad);
            });
        }

        if($empleadortelefono){

            $query->where(function ($q) use ($empleadortelefono){
                $q->where('telefono', 'like', '%'.$empleadortelefono .'%');
            });
        }

        return $data = $query->orderBy('orden', 'asc')->orderBy('creado', 'desc');

    }

    public function ajaxGetPostulaciones(Request $request){

        $requerimientoid = $request->input('requerimientoid');
        $filtro = $request->input('filtro');

        $postulaciones = getPostulaciones($requerimientoid, $filtro);

        $postPC = [];

        if (intval($filtro) == 2){
            $postPC = getPostulantesPorColocar($requerimientoid, $filtro);
        }

        //$postPC = getPostulantesPorColocar($requerimientoid, 2);

        return response()->json([
            'code' => 200,
            'postuladosPC' => $postPC,
            'totalPostulaciones' => countPostulaciones($requerimientoid),
            'postulaciones' => $postulaciones
        ]);

    }

    public function ajaxGetCopysRequerimiento(Request $request){

        set_time_limit(0);
        ini_set('max_execution_time', 180);
        $idReq = $request->input('idReq');
        $requerimiento = RequerimientoView::find($idReq);
        $newTerms1711  = isNewTerms1711($requerimiento->creado);
        $contract = validateNewContrato($requerimiento, $requerimiento->paispedido_id);
        $linkComprobante = null;

        if ($requerimiento->adjunto_adelanto || $requerimiento->comprobante_adelanto_id){
            $linkComprobante = 'Le enviamos el comprobante de adelanto por entrevista: ' . getEncondedLink($requerimiento->id, 'pdf/ver-adelanto');
        }

        $copys = [
            'detallesTrabajador'    => getCopyDetalles($requerimiento, null, null, null, null, null, null, null, false, $newTerms1711 , true, false),
            'detallesEmpleador'     => getDetallesCopyEmpleador($requerimiento, $newTerms1711),
            'detallesContratos'     => getCopyDetallesCrearContrato($requerimiento),
            'comprobanteAdelanto'   => $linkComprobante,
            'detallesFinEntrevista' => $requerimiento->estatusrequerimientoid ? getCopyDetallesFinalizacionEntrevista($requerimiento, $contract['tipocontratodefault']) : null
        ];

        return response()->json([
            'code'      => 200,
            'copys'     => $copys
        ]);

    }

    public function ajaxGetData(){

        $actividades = Actividad::borrado(false)->ordenar()->get();
        $tiposBeneficios = TipoBeneficio::whereIn('id', [1,2])->get();
        $tipoviviendas = TipoVivienda::borrado(false)->orderBy('nombre','asc')->get();
        $nacionalidades = Nacionalidad::borrado(false)->ordenar()->get();
        $edades = RangoEdad::borrado(false)->orderBy('id', 'asc')->get();
        $cantidades = createArrayCantidad(10, 0);
        $cantidadesPisos = createArrayCantidad(5, 1);
        $tiposcontratos = TipoContrato::borrado(false)->orderBy('nombre', 'asc')->get();
        $responsables = UsuarioInterno::borrado(false)->activo(true)->oficina()->orderBy('nombres', 'asc')->get();
        $frecuencias = FrecuenciaServicio::borrado(false)->orderBy('id', 'asc')->get();
        $tiposdescansos = TipoDescanso::borrado(false)->ordenar()->get();
        $diassemana = DiaSemana::borrado(false)->where('normal', true)->get();
        $paises = Pais::get();

        return response()->json([
            'code' => 200,
            'paises'       => $paises,
            'actividades' =>$actividades,
            'tipoviviendas' => $tipoviviendas,
            'nacionalidades' => $nacionalidades,
            'edades' => $edades,
            'cantidades' => $cantidades,
            'cantidadespisos' => $cantidadesPisos,
            'tiposcontratos' => $tiposcontratos,
            'responsables' => $responsables,
            'frecuencias' => $frecuencias,
            'tiposdescansos' => $tiposdescansos,
            'diassemana' => $diassemana,
            'tiposBeneficios' => $tiposBeneficios
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

    public function ajaxRefreshRequerimientos(Request $request){

        $fastsearch = $request->input('fastsearch');
        $offset = $request->input('offset');

        $lista = getNewRequerimientos($fastsearch);
        $cantidad = $lista->count();
        $data = getDataRequerimientos($lista, $offset);
        $page = 0;
        $fechaHoy = Carbon::now()->toDateString();

        return response()->json([
            'code' => 200,
            'requerimientos' => processDataRequerimiento($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen requerimientos recientes',
            'fechaHoy' => $fechaHoy,
            'accessCom' => getAccessFunctions()
        ]);

    }

    public function ajaxPostulacionesRemover(Request $request){

        $requerimientopostulacionid = $request->input('requerimientopostulacionid');

        if($requerimientopostulacionid){

            $data = RequerimientoPostulacion::find($requerimientopostulacionid);
            $data->activo = 0;

            if($data->update()){

                return json_encode(['code' => 200, 'msj' => 'Cambio realizado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el proceso de descarte del postulante. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al remover postulante. Consulte al Administrador']);
        }

    }

    public function ajaxPostulacionesSelectWhatsapp(Request $request){
        $requerimientopostulacionid = $request->input('requerimientopostulacionid');

        if($requerimientopostulacionid){

            $data = RequerimientoPostulacion::find($requerimientopostulacionid);
            $data->select_wp = 1;

            if($data->update()){

                return json_encode(['code' => 200, 'msj' => 'Cambio realizado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el proceso de descarte del postulante. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al remover postulante. Consulte al Administrador']);
        }

    }

    public function ajaxPostulacionesAscender(Request $request){

        $requerimientopostulacionid = $request->input('requerimientopostulacionid');

        if($requerimientopostulacionid){

            $data = RequerimientoPostulacion::find($requerimientopostulacionid);
            $data->activo = 2;

            $e = actualizarActivPostulante($data->trabajador_id);

            if($data->update()){

                return json_encode(['code' => 200, 'msj' => 'Cambio realizado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el proceso de descarte del postulante. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al remover postulante. Consulte al Administrador']);
        }

    }

    public function ajaxListaPostulantesAdd(Request $request){

        $requerimientoid = $request->input('requerimientoid');
        $search = $request->input('search');

        if($requerimientoid){

            $listapostulantesactivos = getListaIDPostulantesActivos($requerimientoid);

            $query = TrabajadorView::/*where('estadoid', 1)->*/orderBy('actualizado', 'desc');

            if($search){

                $query->where(function ($q) use ($search){
                    $q->where('trabajador', 'like', '%'.$search .'%');
                });

            }

            if($listapostulantesactivos){

                $query->where(function ($q) use ($listapostulantesactivos){
                    $q->whereNotIn('id', $listapostulantesactivos);
                });

            }

            $data = $query->limit(100)->get();

            return json_encode(['code' => 200, 'postulantes' => $data]);

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al buscar postulantes. Consulte al Administrador']);
        }


    }

    public function ajaxActionAddPostulante(Request $request){

        DB::beginTransaction();

        try{

            $rp = RequerimientoPostulacion::create([
                'requerimiento_id'   => $request->input('requerimientoid'),
                'trabajador_id'      => $request->input('trabajadorid'),
                'fecha_postulacion'  => now(),
            ]);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Postulante Agregado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al agregar postulante. Consulte al administrador' ]);

        }


    }

    public function ajaxLoadEntrevistasRequerimiento(Request $request){
        $fecha = $request->input('fecha');
        $entrevistas = RequerimientoView::where('estatusrequerimientoid', 1)->where('fechaentrevista', 'like', '%' . $fecha . '%');

        return response()->json([
            'code' => 200,
            'entrevistas' => processDataRequerimiento($entrevistas->get()),
            'totalEntrevistas' => $entrevistas->count(),
        ]);
    }

    public function ajaxGetEntrevistasRequerimiento(Request $request){
        $f = $request->input('fecha');
        $fecha = Carbon::parse($f)->format('Y-m-d');
        $entrevistas = RequerimientoView::where('estatusrequerimientoid', 1)->where('fechaentrevista', 'like', '%' . $fecha . '%')->orderBy('horaentrevista', 'asc');

        $inputFecha = '';

        if ($f){
            $f = formatFecha($f);
            $inputFecha = (mb_convert_case($f['nombreDia'], MB_CASE_TITLE, "UTF-8") . ', ' . $f['numeroDia'] . ' de ' . mb_convert_case($f['numeroMes'], MB_CASE_TITLE, "UTF-8") . ' del ' . $f['numeroAnio']);
        }

        return response()->json([
            'code' => 200,
            'fechaSeleccionada' => $inputFecha,
            'entrevistas' => processDataRequerimiento($entrevistas->get()),
            'totalEntrevistas' => $entrevistas->count(),
        ]);
    }

    public function ajaxCambiarFechasEntrevista(Request $request){
        $fecha = $request->input('fecha');
        $fechaManana =convertToDateManana($fecha);
        $entrevistas = RequerimientoView::where('estatusrequerimientoid', 1)->where('fechaentrevista', 'like', '%' . $fecha . '%');
        $listaEntrevistas = getIdList ($entrevistas->get());

        return response()->json([
            'code' => 200,
        ]);
    }

    public function ajaxGetCorreoEmpleador(Request $request){

        $id = $request->input('id');

        $emp = EmpleadorView::find($id);
        $domicilios = Domicilio::borrado(false)->activo(true)->where('usuario_id', $emp->usuario_id)->get();

        return json_encode([
            'code' => 200,
            'telefono' => $emp->telefono,
            'domicilios' => $domicilios,
            'paisprocedencia' => $emp->paisnacimiento_id,
        ]);

    }

    public function ajaxGetModalidad(Request $request){

        $actividad = $request->input('actividad');

        $act = Actividad::find($actividad);

        $modalidades = Modalidad::borrado(false)->ordenar()->get();

        return response()->json(['code' => 200,
            'modalidades' => $modalidades,
        ]);

    }

    public function ajaxDuplicarRequerimiento(Request $request){
        $idRequerimiento = $request->input('idRequerimiento');

        DB::beginTransaction();

        try{

            $req = Requerimiento::findOrFail($idRequerimiento);
            $newReq = $req->replicate();

            $newReq->fill([
                'creado'                   => now(),
                'actualizado'              => now(),
                'estatusrequerimiento_id'  => 1,
                'fecha'                    => now(),
                'trabajadores_id'          => null,
                'fecha_entrevista'         => null,
                'hora_entrevista'          => null,
                'fecha_inicio_labores'     => null,
                'fecha_inicio_garantia'    => null,
                'fecha_fin_garantia'       => null,
                'garantia'                 => null,
            ]);

            $newReq->save();
            DB::commit();

            return response()->json([
                'code'          => 200,
                'msj'           => 'Requerimiento duplicado exitosamente',
                'idNew'         => $newReq->id,
            ]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al descartar el cambio. Consulte al administrador' ]);

        }
    }

    public function ajaxGetPostulantesAntiguasMostradas(Request $request){
        $idEmpleador = $request->input('idEmpleador');
        $idRequerimiento = $request->input('idRequerimiento');

        return response()->json([
            'code'          => 200,
            'data'          => getPostulacionesPrevias($idEmpleador, $idRequerimiento),
        ]);
    }

    public function ajaxPendiente(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Requerimiento::find($id);
            $registro->estatusrequerimiento_id = 1;

            if($registro->update()){

                return json_encode(['code' => 200, 'msj' => 'Estado cambiado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el Proceso de cambio de estado. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al cambiar de estado. Consulte al Administrador']);
        }

    }

    public function ajaxCambiarEstadoReq(Request $request){

        $id = $request->input('id');
        $estado = $request->input('estado');

        if($id){

            $registro = Requerimiento::find($id);
            $registro->estatusrequerimiento_id = $estado;

            Contrato::where('requerimiento_id', $id)->update(['culminado' => true]);

            if($registro->update()){

                return json_encode(['code' => 200, 'msj' => 'Estado cambiado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Error en el Proceso de cambio de estado. Consulte al Administrador']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error al cambiar de estado. Consulte al Administrador']);
        }

    }

    public function ajaxEntrevistaSwitch(Request $request){
        $id = $request->input('id');

        if ($id){

            $requerimiento =Requerimiento::find($id);
            $requerimiento->disponible_entrevista = !$requerimiento->disponible_entrevista;
            if($requerimiento->save()){

                return json_encode(['code' => 200, 'msj' => 'Entrevista modificada exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema al modificar. Consulte al administrador']);
            }

        }else{
            return json_encode(['code' => 600, 'msj' => 'No existe ID. Consulte al administrador']);
        }

    }
}
