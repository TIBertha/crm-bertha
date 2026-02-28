<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateContrato;
use App\Http\Requests\ValidateContratoEdit;
use App\Http\Requests\ValidateContratoNew;
use App\Models\Actividad;
use App\Models\Contrato;
use App\Models\DiaTrabajado;
use App\Models\Domicilio;
use App\Models\FormaPago;
use App\Models\FrecuenciaServicio;
use App\Models\ModoPago;
use App\Models\Requerimiento;
use App\Models\RequerimientoPostulacion;
use App\Models\TipoComision;
use App\Models\TipoContrato;
use App\Models\Trabajador;
use App\Models\UsuarioInterno;
use App\Models\Views\DiaTrabajadoView;
use App\Models\Views\ContratoView;
use App\Models\Views\DistritoView;
use App\Models\Views\EmpleadorView;
use App\Models\Views\RequerimientoView;
use App\Models\Views\TrabajadorView;
use Carbon\Carbon;
use DB, Storage, File, Auth;

use Illuminate\Http\Request;
use function GuzzleHttp\json_encode;

class ContratosController extends Controller
{
    public function index(){

        return view('Contratos.index');
    }

    public function viewNew(){

        return redirect('/contratos');
    }

    public function viewEdit($id){

        return redirect('/contratos');
    }

    public function ajaxRefreshContratos(Request $request){

        set_time_limit(0);
        ini_set('max_execution_time', 180);

        $offset = $request->input('offset');

        $lista = getNewContratos();
        $cantidad = $lista->count();
        $data = getDataContratos($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            //'contratos' => armarContratosAndHistorial($data),
            'contratos' => processDataContrato($data),
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen contratos recientes'
        ]);

    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');
        $viewDom = '';

        if($id){

            $contrato  = Contrato::find($id);

            $formaspagos = FormaPago::borrado(false)->orderBy('nombre', 'asc')->get();
            $modospagos = ModoPago::borrado(false)->contrato(true)->orderBy('nombre', 'asc')->get();
            $modospagosdt = ModoPago::borrado(false)->diasTrabajados(true)->orderBy('nombre', 'asc')->get();
            $trabajadores  = TrabajadorView::where('estadoid', 1)->orderBy('trabajador', 'asc')->get();
            $tiposcontratos = TipoContrato::borrado(false)->orderBy('nombre', 'asc')->get();
            $emp = EmpleadorView::find($contrato->empleador_id);
            $req = RequerimientoView::where('empleadorid', $contrato->empleador_id)->get();
            $dom = Domicilio::borrado(false)->activo(true)->where('usuario_id', $emp->usuario_id)->get();
            $requerimiento = Requerimiento::find($contrato->requerimiento_id);
            $diastrabajados = DiaTrabajado::borrado(false)->where('contrato_id', $id)->first();
            $actividades = Actividad::borrado(false)->orderBy('nombre', 'asc')->get();
            $responsables = UsuarioInterno::borrado(false)->activo(true)->oficina()->orderBy('nombres', 'asc')->get();
            $frecuencias = FrecuenciaServicio::borrado(false)->orderBy('id', 'asc')->get();
            $diasnormal = getDiasNormalSemanaMS();
            $tiposcomisiones = TipoComision::borrado(false)->orderBy('nombre', 'desc')->get();
            $divisa = getDivisaDetails($requerimiento->paispedido_id);

            $validateContrato = validateNewContrato($requerimiento, $requerimiento->paispedido_id);

            $diaslaborablesfrecuencia = $requerimiento->horarios ? convertToFormatMultiselectDiasDescanso($requerimiento->horarios) : '';

            if ($requerimiento->domicilio_id){
                $domi = Domicilio::find($requerimiento->domicilio_id);
                $dist = DistritoView::find($domi->distrito_id);
                $viewDom = $domi->link_opcional ? $domi->link_opcional : str_replace(' ', '%20',generateLinkGoogleMapCopy( $domi->direccion, $dist['distritos']));
            }

            return json_encode([
                'code' => 200,
                'divisa'  => $divisa,
                'paispedido' => $requerimiento->paispedido_id,
                'linkDomicilio' => $requerimiento->domicilio_id ? $viewDom : '',
                'formaspagos' => $formaspagos,
                'modospagos' => $modospagos,
                'trabajadores' => formatMultiselectTrabajadoresCont($trabajadores),
                'contrato' => $contrato,
                'tiposcontratos' => $tiposcontratos,
                'empleador_id' => formatMultiselectEmpleador($contrato->empleador_id),
                'requerimientos' => formatRequerimientosContratos($req),
                'domicilios' => $dom,
                'trabajador_id' => formatMultiselectTrabajador($contrato->trabajador_id),
                'trabajador_b_id' => $contrato->trabajador_b_id ? formatMultiselectTrabajador($contrato->trabajador_b_id, false) : null,
                'trabajador_c_id' => $contrato->trabajador_c_id ? formatMultiselectTrabajador($contrato->trabajador_c_id, false) : null,
                'requerimiento' => $requerimiento,
                'garantias' => createArrayCantidad(12, $validateContrato['garantiainiciocantidad']),
                'diastrabajados' => $diastrabajados ? $diastrabajados : '',
                'modospagosdt' => $modospagosdt,
                'actividades' => $actividades,
                'responsables' => $responsables,
                'valordiafrecuencia' => $requerimiento->valor_dia_frecuencia,
                'diaslaborablesfrecuencia' => $diaslaborablesfrecuencia,
                'modalidad' => $requerimiento->modalidad_id,
                'frecuencia' => $requerimiento->frecuenciaservicio_id,
                'frecuencias' => $frecuencias,
                'sueldomensual' => $contrato->sueldo_por_dias,
                'dias' => $diasnormal,
                'tiposcomisiones' => $tiposcomisiones,
                'requerimientoDetalles' => getReqDetails($requerimiento),
            ]);

        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetData(){

        $reqPend = RequerimientoView::where('estatusrequerimientoid', 1)->get();
        $list = [];

        if ($reqPend){
            foreach ($reqPend as $r){
                $list[] = $r->empleadorid;
            }
        }

        $empleadores = EmpleadorView::borrado(false)->activo(true)->whereIn('id', array_unique($list))->whereNotNull('nombres')->whereNotNull('apellidos')->whereNotNull('tipodocumento')->whereNotNull('numero_documento')->orderBy('empleador', 'asc')->get();
        $formaspagos = FormaPago::borrado(false)->orderBy('nombre', 'asc')->get();
        $modospagos = ModoPago::borrado(false)->contrato(true)->orderBy('nombre', 'asc')->get();
        $cantidades = createArrayCantidad(13, 0);
        $actividades = Actividad::borrado(false)->orderBy('nombre', 'asc')->get();
        $responsables = UsuarioInterno::borrado(false)->activo(true)->oficina()->orderBy('nombres', 'asc')->get();
        $frecuencias = FrecuenciaServicio::borrado(false)->orderBy('id', 'asc')->get();
        $diasnormal = getDiasNormalSemanaMS();
        $tiposcomisiones = TipoComision::borrado(false)->orderBy('nombre', 'desc')->get();

        return json_encode([
            'code' => 200,
            'empleadores' => formatMultiselectEmpleadores($empleadores),
            'formaspagos' => $formaspagos,
            'modospagos' => $modospagos,
            'garantias' => $cantidades,
            'actividades' => $actividades,
            'responsables' => $responsables,
            'frecuencias' => $frecuencias,
            'dias' => $diasnormal,
            'tiposcomisiones' => $tiposcomisiones
        ]);

    }


    public function ajaxNew(ValidateContratoNew $request){

        DB::beginTransaction();

        try{

            $formapago = $request->input('formapago');

            $re = Requerimiento::find($request->input('requerimiento'));
            $modalidad = $re->modalidad_id;
            $frecuencia = $re->frecuenciaservicio_id;
            $valordiafrecuencia = $re->valor_dia_frecuencia;

            $monto_total_contrato = $request->input('montototalcontrato');

            $idTrabajador = $request->input('postulante')[0]['value'];

            if ($re->paispedido_id != 54){
                $cont = ContratoView::whereNotIn('paispedido_id', [54])->whereNotNull('numero_recibopago')->count();
            }

            $data = [
                'numero_recibopago'  => $re->paispedido_id != 54 ? ($cont + 1) : null,
                'empleador_id'       => $request->input('empleador')['value'],
                'requerimiento_id'   => $request->input('requerimiento'),
                'actividad_id'       => $request->input('actividad') ? $request->input('actividad') : $re->actividad_id,
                'domicilio_id'       => $request->input('domicilio'),
                'trabajador_id'      => $idTrabajador,
                'trabajador_b_id'    => $request->input('postulanteB') ? $request->input('postulanteB')['value'] : null,
                'trabajador_c_id'    => $request->input('postulanteC') ? $request->input('postulanteC')['value'] : null,
                'tipocontrato_id'    => $request->input('tipocontrato'),
                'tipocomision_id'    => $request->input('tipocomision'),
                'total_pago'         => $request->input('totalpago'),
                'formapago_id'       => $request->input('formapago'),
                'pago1'              => $formapago == 1 ? $request->input('pago1') : null,
                'pago2'              => $formapago == 1 ? $request->input('pago2') : null,
                'modopago1'          => $formapago == 1 ? $request->input('modopago1') : null,
                'modopago2'          => $formapago == 1 ? $request->input('modopago2') : null,
                'fechapago'          => $formapago == 1 ? Carbon::parse($request->input('fechapago')) : null,
                'adelanto'           => $formapago == 2 ? $request->input('adelanto') : null,
                'debe'               => $formapago == 2 ? $request->input('debe') : null,
                'modopagoadelanto'   => $formapago == 2 ? $request->input('modopagoadelanto') : null,
                'modopagodebe'       => $formapago == 2 ? $request->input('modopagodebe') : null,
                'fechapagoadelanto'  => $formapago == 2 ? Carbon::parse($request->input('fechapagoadelanto')) : null,
                'fechapagodebe'      => $formapago == 2 ? Carbon::parse($request->input('fechapagodebe')) : null,
                'fecha'              => Carbon::now(),
                'fechainiciolabores' => $request->input('fechainiciolabores') ? Carbon::parse($request->input('fechainiciolabores')) : null,
                'fechainiciolaboresb' => $request->input('fechainiciolaboresb') ? Carbon::parse($request->input('fechainiciolaboresb')) : null,
                'fechainiciolaboresc' => $request->input('fechainiciolaboresc') ? Carbon::parse($request->input('fechainiciolaboresc')) : null,
                'horainiciolabores'  => $request->input('horainiciolabores') ? Carbon::parse($request->input('horainiciolabores')) : null,
                'sueldopactado'      => $modalidad == 3 ?  ($frecuencia < 4 ? ($valordiafrecuencia * 4 * $frecuencia) : $valordiafrecuencia * 16) : $request->input('sueldo'),
                'sueldoprimermes'    => $modalidad == 3 ?  ($frecuencia < 4 ? ( ($valordiafrecuencia * 4 * $frecuencia) * 0.7 ) : ( ($valordiafrecuencia * 16) * 0.7 )) : $request->input('sueldo') * 0.7,
                'sueldo_por_dias'    => $modalidad == 3 ? ($frecuencia * $valordiafrecuencia * 4) : null,
                'descuentoejecutivo' => $request->input('descuentoejecutivo'),
                'monto_total_contrato' => $monto_total_contrato,
                'montodiferencia'    => $request->input('montodescontado'),
                'garantia'           => $request->input('garantia'),
                'fecha_inicio_garantia' => $request->input('fechainiciogarantia') ? Carbon::parse($request->input('fechainiciogarantia')) : null,
                'fecha_fin_garantia'    => $request->input('fechafingarantia') ? Carbon::parse($request->input('fechafingarantia')) : null,
                'observaciones'      => $request->input('observaciones'),
                'creado'             =>  Carbon::parse($request->input('creado')),
            ];

            $tra = Trabajador::find($request->input('postulante')[0]['value']);

            $frecuenciaPorDias = getArregloFrecuencia($request->input('diaslaborablesfrecuencia'));

            $dataTra = [
                'estatuspostulante_id' => ($re->modalidad_id == 3) ? 1 : 2,
                'estatus_por_dias' => ($re->modalidad_id == 3) ? 1 : 0,
                'dias_contratados_por_dias' => ($re->modalidad_id == 3) ? ($tra->dias_contratados_por_dias ? $tra->dias_contratados_por_dias : $frecuenciaPorDias) : null,
            ];

            $dataReq = [
                'estatusrequerimiento_id'   => 2,
                'trabajadores_id'           => json_encode([$data['trabajador_id']]),
                'garantia'                  => $request->input('garantia'),
                'fecha_inicio_garantia'     => $request->input('fechainiciogarantia') ? Carbon::parse($request->input('fechainiciogarantia')) : null,
                'fecha_fin_garantia'        => $request->input('fechafingarantia') ? Carbon::parse($request->input('fechafingarantia')) : null,
                'total_contratos'           => (intval($re->total_contratos)+1),
            ];

            $exito1 = Contrato::create($data);
            $exito2 = Trabajador::where('id', $data['trabajador_id'])->update($dataTra);
            $exito3 = Requerimiento::where('id', $data['requerimiento_id'])->update($dataReq);

            $idContrato = $exito1->id;

            $exito4 = Contrato::find($idContrato);
            $exito4->codificacion_contrato = codificacionContrato($idContrato);
            $exito4->save();

            $msjExito = 'Contrato creado exitosamente.';

            DB::commit();

            return response()->json(['code' => 200, 'msj' => $msjExito, 'contrato' => $idContrato]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear contrato. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateContratoEdit $request){

        $id = $request->input('id');

        DB::beginTransaction();

        try{

            $formapago = $request->input('formapago');

            $re = Requerimiento::find($request->input('requerimiento'));
            $modalidad = $re->modalidad_id;
            $frecuencia = $re->frecuenciaservicio_id;
            $valordiafrecuencia = $re->valor_dia_frecuencia;

            $data = [
                'empleador_id'       => $request->input('empleador')['value'],
                'requerimiento_id'   => $request->input('requerimiento'),
                'actividad_id'       => $request->input('actividad'),
                'domicilio_id'       => $request->input('domicilio'),
                'trabajador_id'      => $request->input('postulante')[0]['value'],
                'trabajador_b_id'    => validateExistTrabajador($request->input('postulanteB')),
                'trabajador_c_id'    => validateExistTrabajador($request->input('postulanteC')),
                'tipocontrato_id'    => $request->input('tipocontrato'),
                'total_pago'         => $request->input('totalpago'),
                'formapago_id'       => $formapago,
                'pago1'              => $formapago == 1 ? $request->input('pago1') : null,
                'pago2'              => $formapago == 1 ? $request->input('pago2') : null,
                'modopago1'          => $formapago == 1 ? $request->input('modopago1') : null,
                'modopago2'          => $formapago == 1 ? $request->input('modopago2') : null,
                'fechapago'          => $formapago == 1 ? Carbon::parse($request->input('fechapago')) : null,
                'adelanto'           => $formapago == 2 ? $request->input('adelanto') : null,
                'debe'               => $formapago == 2 ? $request->input('debe') : null,
                'modopagoadelanto'   => $formapago == 2 ? $request->input('modopagoadelanto') : null,
                'modopagodebe'       => $formapago == 2 ? $request->input('modopagodebe') : null,
                'fechapagoadelanto'  => $formapago == 2 ? Carbon::parse($request->input('fechapagoadelanto')) : null,
                'fechapagodebe'      => $formapago == 2 ? Carbon::parse($request->input('fechapagodebe')) : null,
                'fechainiciolabores' => $request->input('fechainiciolabores') ? Carbon::parse($request->input('fechainiciolabores')) : null,
                'fechainiciolaboresb' => $request->input('fechainiciolaboresb') ? Carbon::parse($request->input('fechainiciolaboresb')) : null,
                'fechainiciolaboresc' => $request->input('fechainiciolaboresc') ? Carbon::parse($request->input('fechainiciolaboresc')) : null,
                'horainiciolabores'  => $request->input('horainiciolabores') ? Carbon::parse($request->input('horainiciolabores')) : null,
                'sueldopactado'      => $modalidad == 3 ?  ($frecuencia < 4 ? ($valordiafrecuencia * 4 * $frecuencia) : $valordiafrecuencia * 16) : $request->input('sueldo'),
                'sueldoprimermes'    => $modalidad == 3 ?  ($frecuencia < 4 ? ( ($valordiafrecuencia * 4 * $frecuencia) * 0.7 ) : ( ($valordiafrecuencia * 16) * 0.7 )) : $request->input('sueldo') * 0.7,
                'descuentoejecutivo' => $request->input('descuentoejecutivo'),
                'monto_total_contrato' => $request->input('montototalcontrato'),
                'montodiferencia'    => $request->input('montodescontado'),
                'garantia'           => $request->input('garantia'),
                'fecha_inicio_garantia' => $request->input('fechainiciogarantia') ? Carbon::parse($request->input('fechainiciogarantia')) : null,
                'fecha_fin_garantia'    => $request->input('fechafingarantia') ? Carbon::parse($request->input('fechafingarantia')) : null,
                'observaciones'       => $request->input('observaciones'),
                'verificador_ingreso' => $request->input('verificadoingreso') ? true :false,
            ];

            $dataReq = [
                'trabajadores_id' => json_encode([$data['trabajador_id']]),
                'garantia'           => $request->input('garantia'),
                'fecha_inicio_garantia' => $request->input('fechainiciogarantia') ? Carbon::parse($request->input('fechainiciogarantia')) : null,
                'fecha_fin_garantia'    => $request->input('fechafingarantia') ? Carbon::parse($request->input('fechafingarantia')) : null
            ];

            $contrato = Contrato::find($id);

            $exito1 = $contrato->update($data);

            $exito3 = Requerimiento::where('id', $data['requerimiento_id'])->update($dataReq);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Contrato actualizado exitosamente', 'contrato' => $id]);

        } catch (\Exception $e) {

            DB::rollback();
            dd($e);

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar contrato. Consulte al administrador' ]);

        }

    }

    public function ajaxGetDataInicial(){

        $actividades = Actividad::borrado(false)->ordenar()->get();
        $tiposcontratos = TipoContrato::borrado(false)->orderBy('nombre', 'asc')->get();
        $formaspagos = FormaPago::borrado(false)->orderBy('nombre', 'asc')->get();
        $responsables = UsuarioInterno::borrado(false)->whereIn('id',[6,7,8])->orderBy('nombres', 'asc')->get();

        return response()->json([
            'code' => 200,
            'responsables' => $responsables,
            'actividades' => $actividades,
            'tiposcontratos' => $tiposcontratos,
            'formaspagos' => $formaspagos,
            'accessCom' => getAccessFunctions()
        ]);

    }

    public function ajaxGetDataModalDetallesContratos(Request $request){
        $id = $request->input('idCont');
        $contrato = ContratoView::find($id);
        $data = [
            'id'                                => $contrato->id,
            'requerimiento_id'                  => $contrato->requerimientoid,
            'modalidad_id'                      => $contrato->modalidadid,
            'modalidad'                         => $contrato->modalidad,
            'frecuencia_servicio'               => $contrato->frecuenciaservicio ? $contrato->frecuenciaservicio : null,
            'valor_dia_frecuencia'              => $contrato->valor_dia_frecuencia ? $contrato->valor_dia_frecuencia : null,
            'dias_frecuencia'                   => $contrato->dias_frecuencia ? $contrato->dias_frecuencia : null,
            'empleador_num_doc'                 => $contrato->empleadornumerodocumento,
            'empleador_tel'                     => $contrato->empleadortelefono,
            'garantia'                          => $contrato->garantia,
            'fecha_inicio_garantia'             => $contrato->fecha_inicio_garantia,
            'fecha_fin_garantia'                => $contrato->fecha_fin_garantia,
            'forma_pago_id'                     => $contrato->formapagoid,
            'adelanto'                          => $contrato->adelanto,
            'debe'                              => $contrato->debe,
            'modo_pago_adelanto'                => $contrato->modopagoadelanto,
            'modo_pago_debe'                    => $contrato->modopagodebe,
            'fecha_pago_adelanto'               => $contrato->fechapagoadelanto,
            'fecha_pago_debe'                   => $contrato->fechapagodebe,
            'historial'                         => getHistorialContrato($contrato->requerimientoid),

        ];
        return response()->json([
            'code' => 200,
            'data' => $data,
        ]);
    }

    public function ajaxLoadDataCambioEstados(Request $request){
        $id = $request->input('idContrato');

        $cont = ContratoView::find($id);

        $result = [
            'idCont'            => $cont->id,
            'estadoContrato'    => $cont->culminado,
            'idReq'             => ($cont->requerimientoid),
            'estadoReq'         => ($cont->estatusrequerimientoid),
            'estadoReqNom'      => ($cont->estatusrequerimiento),
            'idTrab'            => ($cont->trabajadorid),
            'estadoPost'        => ($cont->estatuspostulanteid),
            'estadoPostNom'     => ($cont->estatuspostulante),
            'nomTrab'           => ($cont->trabajador),
        ];

        return response()->json([
            'code'                  => 200,
            'data'                  => $result,
        ]);
    }

    public function ajaxSaveDataCambiosEstadosContratos(Request $request){
        $id = $request->input('idContrato');
        $estadoPost = $request->input('estadoPost');
        $estadoReq = $request->input('estadoReq');
        $estadoCont = $request->input('estadoCont');

        $dataContrato = [
            'culminado'           => intval($estadoCont),
            'actualizado'         => Carbon::now(),
        ];

        $dataPostulante = [
            'estatuspostulante_id'  => intval($estadoPost),
            'actualizado'           => Carbon::now(),
        ];

        $dataRequerimiento = [
            'estatusrequerimiento_id'  => intval($estadoReq),
            'actualizado'           => Carbon::now(),
        ];

        $contrato = Contrato::find($id);
        $trabajadorID = $contrato->trabajador_id;
        $requerimientoID = $contrato->requerimiento_id;

        DB::beginTransaction();

        try{
            $exito1 = Contrato::where('id', $id)->update($dataContrato);
            $exito2 = trabajador::where('id', $trabajadorID)->update($dataPostulante);
            $exito3 = Requerimiento::where('id', $requerimientoID)->update($dataRequerimiento);

            DB::commit();

            return response()->json([
                'code' => 200,
                'icon' => 'fas fa-check-circle text-success' ,
                'msj' => 'Estados modificados exitosamente'
            ]);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'code' => 500,
                'icon' => 'fas fa-times-circle text-danger' ,
                'msj' => 'Ocurrio un problema al modificar los estados. Consulte al administrador'
            ]);

        }

    }

    public function ajaxGetCopysContratos(Request $request){

        set_time_limit(0);
        ini_set('max_execution_time', 180);
        $idCont = $request->input('idCont');
        $contrato = ContratoView::find($idCont);
        $newTerms1711  = isNewTerms1711($contrato->requerimientocreado);

        $now = Carbon::now();
        $dayOfWeek = $now->dayOfWeek;
        $daysAdded = 0;
        if(in_array($dayOfWeek, [0,1,2,3,4,7])){
            $daysAdded = 3;
        }else if(in_array($dayOfWeek, [4,6])){
            $daysAdded = 4;
        }else if(in_array($dayOfWeek, [5])){
            $daysAdded = 5;
        }

        $formatFecha = formatFecha($now->addDays($daysAdded));

        $newFecha = $formatFecha['nombreDia'] . ', ' . $formatFecha['numeroDia'] . ' de ' . $formatFecha['nombreMes'];

        $copys = [
            'detallesTrabajador'    => getConstDetalles($contrato,$newTerms1711),
            'detallesEmpleador'     => getConstDetallesEmpleador($contrato),
            'detallesContrato'      => getDetallesContratosCopy($contrato),
            'copy1'                 => 'Buenos días, ¿Nos puede confirmar si su trabajadora ha llegado? Por favor.',
            'trabajadorB'           => $contrato->trabajadorb ? $contrato->trabajadorb : null,
            'copyTrabajadorB'       => $contrato->trabajadorb ? getCopyTrabajadorBC($contrato->trabajador_b_token, 'b') : null,
            'trabajadorC'           => $contrato->trabajadorc ? $contrato->trabajadorc : null,
            'copyTrabajadorC'       => $contrato->trabajadorc ? getCopyTrabajadorBC($contrato->trabajador_c_token, 'c') : null,
            'copyNuevaEntrevista'   => 'Entendemos, entonces agendaremos nuevas entrevistas para el día ' . $newFecha . ' a las 12:00pm'
        ];

        return response()->json([
            'code'      => 200,
            'copys'     => $copys
        ]);

    }

    public function ajaxExcludePostulante(Request $request){
        $idPostulanteSelected = $request->input('id');

        dd($idPostulanteSelected);

    }

    public function ajaxChangeRequerimiento(Request $request){

        $id = $request->input('id');

        if($id){

            $req = Requerimiento::find($id);
            $modalidad = $req->modalidad_id;
            $validateContrato = validateNewContrato($req, $req->paispedido_id);
            $diaslaborablesfrecuencia = $req->horarios ? convertToFormatMultiselectDiasDescanso($req->horarios) : '';
            $trabajadores  = TrabajadorView::where('estadoid', 1)->orderBy('trabajador', 'asc')->get();
            $trabajadoresB = TrabajadorView::orderBy('trabajador', 'asc')->get();
            $trabajadoresC = TrabajadorView::orderBy('trabajador', 'asc')->get();
            $requerimientoDetalles = getReqDetails(RequerimientoView::find($id));
            $divisa = getDivisaDetails($req->paispedido_id);

            return json_encode([
                'code' => 200,
                'hora_inicio' => getHoraInicio($req, $req->modalidad_id),
                'divisa'  => $divisa,
                'paispedido' => $req->paispedido_id,
                'tiene_comision' => $req->tipocontrato_id == 1 ? ($req->tipocomision ? true : false) : false,
                'monto_comision' => ($validateContrato['tipocontratodefault'] == 3) ? 0 : intval($req->tipocontrato_id == 1 ? $req->monto_comision : null),
                'totalpago' => ($validateContrato['tipocontratodefault'] == 3) ? 0 : intval($req->tipocontrato_id == 1 ? $req->monto_comision : $req->sueldo),
                'sueldo' => $req->sueldo,
                'postulante' => convertToFormatMultiselectPostulantes($req->trabajadores_id),
                'tiposcontratos' => $validateContrato['tiposcontratos'],
                'tipocomision' => $validateContrato['tipocomision'],
                'tipocontratodefault' => $validateContrato['tipocontratodefault'],
                'garantias' =>  createArrayCantidad(($req->paispedido_id == 54 ? 12 : 1), $validateContrato['garantiainiciocantidad']),
                'garantia' => $req->tipocontrato_id == 1 ? getGarantiaComision($req->tipocomision, $validateContrato['garantia']) : $validateContrato['garantia'],
                'fechainiciogarantia' => $validateContrato['fechainiciogarantia'],
                'fechafingarantia' => $validateContrato['fechafingarantia'],
                'domicilio' => $req->domicilio_id,
                'fechainiciolabores' => $req->fecha_inicio_labores,
                'actividad' => $req->actividad_id,
                'observaciones' => $validateContrato['observaciones'],
                'responsable' => $req->usuariointerno_id,
                'modalidad' => $modalidad,
                'frecuencia' => $req->frecuenciaservicio_id,
                'valordiafrecuencia' => $req->valor_dia_frecuencia,
                'diaslaborablesfrecuencia' => $diaslaborablesfrecuencia,
                'sueldomensual' => $req->sueldo_por_dias,
                'trabajadores' => formatMultiselectTrabajadoresCont($trabajadores),
                'trabajadoresB' => formatMultiselectTrabajadoresCont($trabajadoresB),
                'trabajadoresC' => formatMultiselectTrabajadoresCont($trabajadoresC),
                'requerimientoDetalles' => $requerimientoDetalles,
            ]);

        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetRequerimientosDomicilios(Request $request){

        $empleadorID = $request->input('empleador')['value'];

        if($empleadorID){

            $empleador = EmpleadorView::find($empleadorID);
            $req = RequerimientoView::where('empleadorid', $empleadorID)->whereIn('estatusrequerimientoid', [1,2])->get();
            $dom = Domicilio::borrado(false)->activo(true)->where('usuario_id', $empleador->usuario_id)->get();

            return json_encode([
                'code' => 200,
                'requerimientos' => formatRequerimientosContratosNoVigentes($req),
                'domicilios' => $dom,
            ]);

        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetVerificacionPorDias(Request $request){

        $id = $request->input('id')[0]['value'];

        if($id){
            $tra = TrabajadorView::find($id);

            return json_encode([
                'code' => 200,
                'diaslaborpostulante' => $tra->dias_contratados_por_dias ? conveconvertToFormatMultiselectDiasLabor($tra->dias_contratados_por_dias) : null,
            ]);

        }else{
            return json_encode(['code' => 500]);
        }
    }

    public function ajaxSetVerificacionIngresoContrato(Request $request){
        DB::beginTransaction();

        try {
            $contrato_id = $request->input('id');
            $condition = $request->input('condition');

            if ($contrato_id){
                $contrato = Contrato::find($contrato_id);

                if ($contrato){
                    $newData = [
                        'verificador_ingreso' => $condition
                    ];

                    $contrato->update($newData);
                }
            }

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Asistencia de trabajadora editada exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al editar la asistencia del trabajador. Consulte al administrador' ]);

        }
    }
}
