<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateTestimonialTrabajador;
use App\Models\TestimonialesTrabajador;
use App\Models\Views\TrabajadorView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB, Auth;

class TestimonialTrabajadorController extends Controller
{
    public function index(){
        return view('TestimonialesTrabajador.index');
    }

    public function viewNew(){
        return redirect('/testimoniales-trabajador');
    }

    public function viewEdit($id){
        return redirect('/testimoniales-trabajador');
    }

    public function ajaxNew(ValidateTestimonialTrabajador $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $usuarioInterno = Auth::user()->id;

            $dataTest = [
                'usuariointerno_id' => $usuarioInterno,
                'fecha'             => $data['fecha'] ? Carbon::parse($data['fecha']) : Carbon::now(),
                'imagen'            => $data['imagenTestimonial'],
                'trabajador_id'     => $data['trabajador']['value'],
                'disp_pe'           => $data['dispPe'],
                'disp_mx'           => $data['dispMx'],
                'activo'            => true
            ];

            $exito = TestimonialesTrabajador::create($dataTest);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Testimonial creado exitosamente']);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear el testimonial. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateTestimonialTrabajador $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $id = $request->input('id');

            $dataTest = [
                'fecha'             => $data['fecha'] ? Carbon::parse($data['fecha']) : Carbon::now(),
                'imagen'            => $data['imagenTestimonial'],
                'disp_pe'           => $data['dispPe'],
                'disp_mx'           => $data['dispMx'],
                'trabajador_id'     => $data['trabajador']['value'],
                'activo'            => true
            ];

            $exito = TestimonialesTrabajador::where('id', $id)->update($dataTest);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Testimonial actualizado exitosamente']);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el testimonial. Consulte al administrador' ]);

        }

    }

    public function ajaxGetData(Request $request){
        $trabajadores  = TrabajadorView::whereNotNull('nombres')->whereNotNull('apellidos')->orderBy('trabajador', 'asc')->get();

        return json_encode(['code' => 200, 'trabajadores' => formatMultiselectTrabajadores($trabajadores)]);
    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');
        $trabajadores  = TrabajadorView::whereNotNull('nombres')->whereNotNull('apellidos')->orderBy('trabajador', 'asc')->get();

        if($id){

            $data = TestimonialesTrabajador::find($id);

            return json_encode([
                'code'                      => 200,
                'trabajador_id'             => $data->trabajador_id ? formatMultiselectTrabajador($data->trabajador_id, false) : null,
                'fecha'                     => $data->fecha,
                'imagen'                    => $data->imagen,
                'dispMx'                    => $data->disp_mx,
                'dispPe'                    => $data->disp_pe,
                'trabajadores'              => formatMultiselectTrabajadores($trabajadores)
            ]);
        }else{
            return json_encode(['code' => 500]);
        }

    }

    public function ajaxActive(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = TestimonialesTrabajador::find($id);

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

        $lista = getNewTestimonialesTrabajador();
        $cantidad = $lista->count();
        $data = getDataTestimonialesTrabajador($lista, $offset);
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
