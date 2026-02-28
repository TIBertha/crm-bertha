<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateBlog;
use App\Models\Medio;
use App\Models\Prensa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB, Auth;

class PrensaController extends Controller
{
    public function index(){

        return view('Prensa.index');
    }

    public function viewNew(){

        return redirect('/prensa');
    }

    public function viewEdit($id){

        return redirect('/prensa');
    }

    public function ajaxNew(ValidateBlog $request){

        $data = $request->input('data');

        $imagen = $data['imagen'] ?? null;
        $pathImagen = '';

        if($imagen){
            $extension = getBase64Extension($imagen);
            $pathImagen = saveImageGeneralS3($imagen, '', null,'blog', $extension);
        }

        $data = [
            'tags'              => $data['tags'] ? json_encode($data['tags']) : '',
            'num'               => (Prensa::max('num')) + 1,
            'fecha'             => $data['fecha'] ? Carbon::parse($data['fecha']) : Carbon::now(),
            'titulo'            => $data['titulo'],
            'fuente'            => $data['fuente'] ?? null,
            'medio_id'          => $data['medio'] ?? null,
            'imagen'            => $imagen,
            'usuariointerno_id' => Auth::user()->id
        ];

        DB::beginTransaction();

        try{

            $exito = Prensa::create($data);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Artículo creado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear el artículo. Consulte al administrador' ]);

        }

    }

    public function ajaxEdit(ValidateBlog $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $id = $data['id'];
            $registro = Prensa::find($id);
            $imagenOld = $registro->imagen;

            $imagen = $data['imagen'];

            $pathImagen = $imagenOld;

            if ($imagen && !isURL($imagen)) {
                $extension = getBase64Extension($imagen);
                $pathImagen = saveImageGeneralS3($imagen, 'blog', $imagenOld, '1', $extension);
            }

            $dataBlog = [
                'tags'                => json_encode($data['tags']),
                'fecha'               => $data['fecha'] ? Carbon::parse($data['fecha']) : Carbon::now(),
                'fuente'              => $data['fuente'] ?? null,
                'titulo'              => $data['titulo'],
                'medio_id'            => $data['medio'] ?? null,
                'imagen'              => $imagen,
            ];

            $exito = Prensa::where('id', $id)->update($dataBlog);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Artículo actualizado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el artículo. Consulte al administrador' ]);

        }

    }

    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = Prensa::find($id);
            $medios = Medio::borrado(false)->orderBy('nombre', 'asc')->get();

            return json_encode(['code' => 200, 'blog' => $data, 'medios' => $medios]);


        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetData(){

        $medios = Medio::borrado(false)->orderBy('nombre', 'asc')->get();

        return response()->json(['code' => 200,
            'medios' => $medios
        ]);

    }

    public function ajaxActive(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Prensa::find($id);
            $registro->activo = !$registro->activo;

            if($registro->save()){
                return json_encode(['code' => 200, 'msj' => 'Artículo actualizado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Ocurrio un problema. Consulte al administrador.']);
        }

    }

    public function ajaxPrensa(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Prensa::find($id);
            $registro->prensa = !$registro->prensa;

            if($registro->save()){
                return json_encode(['code' => 200, 'msj' => 'Artículo actualizado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema al destacar el Artículo. Consulte al administrador.']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Ocurrio un problema al destacar el Artículo. Consulte al administrador.']);
        }

    }

    public function ajaxDelete(Request $request){

        $id = $request->input('id');

        if($id){

            $registro = Prensa::find($id);
            $registro->borrado = true;

            if($registro->save()){
                return json_encode(['code' => 200, 'msj' => 'Artículo borrado exitosamente']);
            }else{
                return json_encode(['code' => 500, 'msj' => 'Ocurrio un problema al borrar el Artículo. Consulte al administrador.']);
            }

        }else{

            return json_encode(['code' => 600, 'msj' => 'Ocurrio un problema en el proceso de borrado. Consulte al administrador.']);
        }

    }

    public function ajaxRefreshPrensa(Request $request){

        $offset = $request->input('offset');

        $lista = getNewBlogs();
        $cantidad = $lista->count();
        $data = getDataBlogs($lista, $offset);
        $page = 0;

        return response()->json([
            'code' => 200,
            'blogs' => $data,
            'page' => $page,
            'total' => $cantidad,
            'textoresultados' => $cantidad ? '' : 'No existen articulos de prensa'
        ]);

    }
}
