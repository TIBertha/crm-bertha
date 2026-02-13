<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\EstatusPostulante;
use App\Models\Modalidad;
use App\Models\Nacionalidad;
use App\Models\ResultadoCovid;
use App\Models\Views\TrabajadorView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostulantesController extends Controller
{
    public function index(Request $request){
        return view('Postulantes.index');
    }

    public function ajaxGetDataInicial(){

        $nacionalidades = Nacionalidad::borrado(false)->orderBy('nombre', 'asc')->get();
        $actividades = Actividad::borrado(false)->ordenar()->get();
        $modalidades = Modalidad::ordenar()->get();
        $estados = EstatusPostulante::borrado(false)->orderBy('nombre', 'asc')->get();
        $resultadoscovid = ResultadoCovid::borrado(false)->orderBy('orden', 'asc')->get();

        return response()->json([
            'code' => 200,
            'nacionalidades' => $nacionalidades,
            'actividades' => convertDataMultiSelect($actividades),
            'modalidades' => $modalidades,
            'estados' => $estados,
            'resultadoscovid' => $resultadoscovid,
        ]);

    }

    public function ajaxRefreshPostulantes(Request $request){

        $limit = 9;
        $offset  = $request->input('offset');
        $data = $request->input('data');

        $trabajadorid     = $data['trabajadorid'];
        $token            = $data['token'];
        $actividad        = $data['actividad'];
        $nacionalidad     = $data['nacionalidad'];
        $modalidad        = $data['modalidad'];
        $distrito         = $data['distrito'];
        $nombre           = $data['nombre'];
        $telefono         = $data['telefono'];
        $documento        = $data['documento'];
        $departamentonac  = $data['departamentonac'];
        $paispostulacion  = intval($data['paispostulacion']);
        $estado           = $data['estado'];
        $resultadocovid   = $data['resultadocovid'];
        $tuvocovid        = $data['tuvocovid'];
        $telefonorecomendacion = $data['telefonorecomendacion'];

        if($estado == NULL AND $trabajadorid == NULL AND $actividad == NULL AND $nacionalidad == NULL AND $modalidad == NULL AND $distrito == NULL AND $nombre == NULL AND $telefono == NULL AND $documento == NULL AND $departamentonac == NULL AND $paispostulacion == NULL AND $resultadocovid == NULL AND $tuvocovid == NULL AND $token == NULL AND $telefonorecomendacion == NULL){
            $query = TrabajadorView::where('actualizado', '>=', \Carbon\Carbon::now()->subDays(7) )->whereIn('estadoid', [1,6,7,8])->orderBy('actualizado', 'DESC');
        }else{
            $query = TrabajadorView::orderBy('estadoid', 'asc')->orderBy('actualizado', 'DESC');
        }

        if($trabajadorid){

            $query->where(function ($q) use ( $trabajadorid ){
                $q->where('id', $trabajadorid);
            });
        }

        if($token){

            $query->where(function ($q) use ( $token ){
                $q->where('token', $token);
            });
        }

        if($modalidad){

            if($modalidad == 1){

                $query->where(function ($q){
                    $q->where('cama_adentro', true);
                });

            }else if($modalidad == 2){

                $query->where(function ($q){
                    $q->where('cama_afuera', true);
                });

            }else if($modalidad == 3){

                $query->where(function ($q){
                    $q->where('por_horas', true);
                });

            }

        }

        $dir = getDistritosSearch($distrito);

        if($dir){

            $query->where(function ($q) use ( $dir ){

                $q->whereIn('distrito_id', $dir);
            });
        }

        if($nombre){

            $query->where(function ($q) use ($nombre){
                $q->where('trabajador', 'like', '%'.$nombre .'%');
            });
        }

        if($departamentonac){

            $query->where(function ($q) use ($departamentonac){
                $q->where('lugarnacimiento', 'like', '%'. $departamentonac .'%');
            });
        }

        if($paispostulacion){

            $query->where(function ($q) use ($paispostulacion){
                $q->where('postulando_pais_id', $paispostulacion);
            });
        }

        if($telefonorecomendacion){

            $query->where(function ($q) use ($telefonorecomendacion){
                $q->where('verificaciones_laborales', 'like', '%'. $telefonorecomendacion .'%');
            });
        }

        if($telefono){

            $query->where(function ($q) use ($telefono){
                $q->where('telefono', 'like', '%'.$telefono .'%')
                    ->orWhere('telefono_whatsapp', 'like', '%'.$telefono .'%');
            });
        }

        if($documento){

            $query->where(function ($q) use ($documento){
                $q->where('numero_documento', 'like', '%'.$documento .'%');
            });
        }

        if($estado){

            $query->where(function ($q) use ($estado){
                $q->where('estadoid', $estado);
            });

        }

        if(in_array($nacionalidad, [1,2])){

            $query->where(function ($q) use ($nacionalidad){
                $q->where('nacionalidad_id', $nacionalidad);
            });
        }

        if($actividad){

            foreach ($actividad as $a){

                $query->where(function ($q) use ($a){

                    $q->where('actividad_id', 'like', '%'.$a['value'] .'%');
                });
            }
        }

        if($resultadocovid){

            $query->where(function ($q) use ($resultadocovid){
                $q->where('resultado_covid_id', $resultadocovid);
            });
        }

        if($tuvocovid){

            $query->where(function ($q) use ($tuvocovid){
                $q->where('tuvo_covid', $tuvocovid);
            });
        }

        $total = $query->count();
        $items =$query->limit($limit)->offset($offset)->get();

        return response()->json([
            'code' => 200,
            'postulantes' => formatDataPostulante($items),
            'total' => $total,
            'textoresultados' => $total ? '' : ( 'No existen postulantes'),
            'accessCom' => getAccessFunctions()
        ]);

    }
}
