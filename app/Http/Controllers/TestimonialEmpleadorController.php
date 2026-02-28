<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateTestimonialEmpleador;
use App\Models\Testimonial;
use App\Models\TestimonialEmpleador;
use App\Models\Views\EmpleadorView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB, Auth;

class TestimonialEmpleadorController extends Controller
{
    public function index(){
        return view('TestimonialesEmpleador.index');
    }

    public function viewNew(){
        return redirect('/testimoniales-empleador');
    }

    public function viewEdit($id){
        return redirect('/testimoniales-empleador');
    }

    public function ajaxNew(ValidateTestimonialEmpleador $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $usuarioInterno = Auth::user()->id;

            $dataTest = [
                'usuariointerno_id'         => $usuarioInterno,
                'empleador_id'              => $data['empleador']['value'],
                'orden'                     => (TestimonialEmpleador::max('orden')) + 1,
                'nombre_cliente'            => $data['nombrecliente'],
                'testimonial'               => $data['testimonial'],
                'fecha'                     => $data['fecha'] ? Carbon::parse($data['fecha']) : Carbon::now(),
                'poster'                    => $data['poster'],
                'imagen_testimonial'        => $data['imagenTestimonialEmpleador'],
                'video_youtube'             => $data['youtube'] ? $data['youtube'] : '',
                'disp_pe'                   => $data['dispPe'],
                'disp_mx'                   => $data['dispMx'],
                'activo'                    => true
            ];

            $exito = TestimonialEmpleador::create($dataTest);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Testimonial creado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            dd($e);

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear el testimonial. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateTestimonialEmpleador $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $id = $request->input('id');

            $registro = TestimonialEmpleador::find($id);

            $dataTest = [
                'fecha'                     => $data['fecha'] ? Carbon::parse($data['fecha']) : null,
                'nombre_cliente'            => $data['nombrecliente'],
                'empleador_id'              => $data['empleador']['value'],
                'testimonial'               => $data['testimonial'],
                'video_youtube'             => $data['youtube'] ? $data['youtube'] : null,
                'poster'                    => $data['poster'],
                'imagen_testimonial'        => $data['imagenTestimonialEmpleador'],
                'disp_pe'                   => $data['dispPe'],
                'disp_mx'                   => $data['dispMx'],
            ];

            $exito = TestimonialEmpleador::where('id', $id)->update($dataTest);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Testimonial actualizado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el testimonial. Consulte al administrador' ]);

        }

    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = TestimonialEmpleador::find($id);

            return json_encode([
                'code'                      => 200,
                'empleador_id'              => $data->empleador_id ? formatMultiselectEmpleador($data->empleador_id) : null,
                'fecha'                     => $data->fecha,
                'testimonial'               => $data,
                'dispMx'                    => $data->disp_mx,
                'dispPe'                    => $data->disp_pe,
            ]);
        }else{
            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetData(Request $request){
        $empleadores  = EmpleadorView::whereNotNull('nombres')->whereNotNull('apellidos')->orderBy('empleador', 'asc')->get();

        return json_encode([
            'code' => 200,
            'empleadores' => formatMultiselectEmpleadores($empleadores)
        ]);
    }

    public function ajaxActive(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = TestimonialEmpleador::find($id);

            $registro->activo = !$registro->activo;

            if($registro->save()){

                return json_encode(['code' => 200, 'msj' => 'Testimonio actualizado exitosamente']);

            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
        }

    }

    public function ajaxRefreshTestimoniales(Request $request){

        $offset = $request->input('offset');

        $lista = getNewTestimonialesEmpleador();
        $cantidad = $lista->count();
        $data = getDataTestimonialesEmpleador($lista, $offset);
        $page = 0;

        return response()->json(['code' => 200,
            'testimoniales' => $data,
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen testimoniales',
            'accessCom' => getAccessFunctions()
        ]);

    }
}
