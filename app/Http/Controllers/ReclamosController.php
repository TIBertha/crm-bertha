<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateReclamo;
use App\Models\Domicilio;
use App\Models\Reclamo;
use App\Models\TipoBien;
use App\Models\TipoReclamo;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth, DB;
use function GuzzleHttp\json_encode;

class ReclamosController extends Controller
{
    public function index(){

        return view('Reclamos.index');
    }

    public function viewNew(){

        return redirect('/reclamos');
    }

    public function viewEdit($id){

        return redirect('/reclamos');
    }

    public function ajaxNew(ValidateReclamo $request){

        $data = $request->input('data');

        $data = [
            'nombres'               => formatText($data['nombres']),
            'apellidos'             => formatText($data['apellidos']),
            'dni'                   => formatText($data['dni']),
            'direccion'             => formatText($data['domicilio']),
            'correo'                => formatText($data['correo']),
            'telefono'              => formatText($data['telefono']),
            'nombre_apoderado'      => formatText($data['nombreapoderado']),
            'tipobien_id'           => $data['tipobien'],
            'tiporeclamo_id'        => $data['tiporeclamo'],
            'fecha_incidente'       => Carbon::parse($data['fechaincidente']),
            'lugar_incidente'       => formatText($data['lugarincidente']),
            'detalle'               => $data['detalle'],
            'pedido'                => formatText($data['pedido']),
            'fecha'                 => Carbon::now()
        ];

        DB::beginTransaction();

        try{

            $exito = Reclamo::create($data);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Reclamo creado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear reclamo. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateReclamo $request){
        $data = $request->input('data');

        $id = $data['id'];

        $resp = $data['respuesta'];
        $antRecl = Reclamo::find($id);

        $data = [
            'nombres'               => formatText($data['nombres']),
            'apellidos'             => formatText($data['apellidos']),
            'dni'                   => formatText($data['dni']),
            'direccion'             => formatText($data['domicilio']),
            'correo'                => formatText($data['correo']),
            'telefono'              => formatText($data['telefono']),
            'nombre_apoderado'      => formatText($data['nombreapoderado']),
            'tipobien_id'           => $data['tipobien'],
            'tiporeclamo_id'        => $data['tiporeclamo'],
            'fecha_incidente'       => Carbon::parse($data['fechaincidente']),
            'lugar_incidente'       => formatText($data['lugarincidente']),
            'detalle'               => $data['detalle'],
            'pedido'                => formatText($data['pedido']),
            //'seguimiento'           => saveFormatSeguimientoReclamo($data['seguimiento']),
            //'adjuntos_respuesta'    => saveFormatAdjuntosRespuesta($data['respuestaAdjuntos']),
            'respuesta'             => $resp,
            'fecha_respuesta'       => (($antRecl->fecha_respuesta == null) && ($resp)) ?  Carbon::now() : null
        ];

        DB::beginTransaction();

        try{

            $registro = Reclamo::where('id', $id)->update($data);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Reclamo actualizado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el reclamo. Consulte al administrador' ]);

        }

    }

    public function ajaxReclamos(Request $request){

        $offset = $request->input('offset');

        $lista = getNewReclamos();
        $cantidad = $lista->count();
        $data = getDataReclamos($lista, $offset);
        $page = 0;

        $result = [];

        if($data){

            foreach ($data as $d) {

                $result[] = [
                    'id'          => $d->id,
                    'fecha'       => $d->fechaformat2,
                    'nombre'      => $d->nombres . ' '.$d->apellidos,
                    'documento'   => $d->dni,
                    'telefono'    => $d->telefono,
                    'correo'      => $d->correo,
                    'estado'      => $d->atendido,
                    'respuesta'   => $d->respuesta ? true : false,
                    'diasRestantes' => $d->diasrestantes >= 0 ? $d->diasrestantes : '-',
                    'fechaEnvioRespuesta' => $d->fecha_envio_respuesta ? armarFechaDeEnvio($d->fecha_envio_respuesta) : null
                ];
            }

        }

        return response()->json(['code' => 200,
            'reclamos' => $result,
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen reclamos'
        ]);
    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = Reclamo::find($id);
            $seguimiento = convertirAdjuntoSeguimiento($data->seguimiento);
            $respuestaAdjuntos = convertirAdjuntosRespuesta($data->adjuntos_respuesta);

            $fecha = $data->fecha;
            $fechaHoy = Carbon::now();
            $fecha30Dias = $data->fecha->addDays(30);
            $diasDiferencia = $fechaHoy->diffInDays($fecha30Dias);

            return json_encode([
                'code' => 200,
                'data' => $data,
                'seguimiento' => $seguimiento,
                'respuestaAdjuntos' => $respuestaAdjuntos,
                'diasRestantes' => $diasDiferencia,
                'fechaEnvioRespuesta' => $data->fecha_envio_respuesta ? armarFechaDeEnvio($data->fecha_envio_respuesta) : null
            ]);

        }else{
            return json_encode(['code' => 500]);
        }

    }

    public function ajaxAtendido(Request $request){
        $id = $request->input('id');

        if($id){

            $reclamo = Reclamo::find($id);

            $reclamo->atendido = !$reclamo->atendido;

            if($reclamo->save()){

                return json_encode(['code' => 200, 'msj' => 'Reclamo atendido exitosamente']);

            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
        }
    }

    public function ajaxAtender(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Reclamo::find($id);
            $verificacion = $registro->atendido;
            $registro->atendido = true;

            if($verificacion == true){
                return json_encode(['code' => 300, 'msj' => 'El reclamo ya fue atendido']);
            }else{
                if($registro->save()){

                    return json_encode(['code' => 200, 'msj' => 'Reclamo atendido exitosamente']);
                }else{
                    return json_encode(['code' => 500, 'msj' => 'Error al cambiar estado del reclamo. Consulte al Administrador']);
                }
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Error en el Proceso de atención. Consulte al Administrador']);
        }

    }

    public function ajaxGetData(){

        $tiposbienes = TipoBien::borrado(false)->orderBy('nombre', 'asc')->get();
        $tiposreclamos = TipoReclamo::borrado(false)->orderBy('nombre', 'asc')->get();

        return response()->json(['code' => 200, 'tiposbienes' =>$tiposbienes, 'tiposreclamos' => $tiposreclamos]);

    }

    public function ajaxGetReclamosPendientes(Request $request){

        $valor = Reclamo::where('atendido', false)->count();

        return response()->json(['code' => 200,
            'valor' => $valor
        ]);

    }


}
