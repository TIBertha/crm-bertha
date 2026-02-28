<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidatePostulantesEdit;
use App\Http\Requests\ValidatePostulantesNew;
use App\Models\Actividad;
use App\Models\Beneficio;
use App\Models\Departamento;
use App\Models\EstadoCivil;
use App\Models\EstatusPostulante;
use App\Models\Genero;
use App\Models\Idioma;
use App\Models\Modalidad;
use App\Models\Nacionalidad;
use App\Models\NivelEducativo;
use App\Models\Pais;
use App\Models\Parentesco;
use App\Models\ResultadoCovid;
use App\Models\TipoCertificado;
use App\Models\TipoDocumento;
use App\Models\Trabajador;
use App\Models\Usuario;
use App\Models\UsuarioInterno;
use App\Models\Views\TrabajadorView;
use App\Models\Views\TransaccionBajaView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostulantesController extends Controller
{
    public function index(Request $request){
        return view('Postulantes.index');
    }

    public function viewNew(){

        return redirect('/postulantes');
    }

    public function viewEdit($id){

        return redirect('/postulantes');
    }

    public function viewFicha($id){

        $data['ficha'] = getDataFicha($id, false, false, null , true, false);

        return view('PDF.Ficha_Postulante.template', $data);
    }

    public function ajaxSaveEstatusTieneCUL(Request $request){
        $estatus = $request->input('estatus');
        $id = $request->input('id');

        DB::beginTransaction();

        try{
            $changeStatus = [
                'tiene_cuenta'                     => $estatus,
                'actualizado'                      => Carbon::now(),
            ];

            $exito = Trabajador::where('id', $id)->update($changeStatus);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Cambio de estatus realizado exitosamente']);

        } catch (\Exception $e) {

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar contrato. Consulte al administrador' ]);

        }

    }

    public function ajaxNew(ValidatePostulantesNew $request){

        DB::beginTransaction();

        try{

            $data = $request->input('data');

            $usuid = $data['usuarioid'];
            $tipodocumento = $data['tipodocumento'];

            $foto = $data['foto'] ? $data['foto'] : null;

            $dom = getDepartamentoProvinciaDistrito($data['distrito']);
            $mod = getModalidades($data['modalidad']);
            $verificacioneslaborales = $data['verificaciones'];
            $nombresTrabajador = formatText($data['nombres']);
            $apellidosTrabajador = formatText($data['apellidos']);
            $telefonoTrabajador = formatText($data['telefono']);
            $whatsappTrabajador = formatText($data['telefonowhatsapp']);

            $dataUsu = [
                'nombres'                   => $nombresTrabajador,
                'apellidos'                 => $apellidosTrabajador,
                'genero_id'                 => $data['genero'],
                'tipodocumento_id'          => $tipodocumento,
                'numero_documento'          => $data['numerodocumento'],
                'estadocivil_id'            => $data['estadocivil'],
                'fecha_nacimiento'          => $data['fechanacimiento'] ? Carbon::parse($data['fechanacimiento']) : null,
                'paisnacimiento_id'         => $data['paisprocedencia'],
                'nacionalidad_id'           => $data['nacionalidad'],
                'departamentonacimiento_id' => $data['departamentonacimiento'],
                'lugar_nacimiento'          => $data['lugarnacimiento'],
                'telefono'                  => removeSpaceNumber($telefonoTrabajador),
                'telefono_whatsapp'         => removeSpaceNumber($whatsappTrabajador),
            ];

            if ($usuid) {
                Usuario::where('id', $usuid)->update($dataUsu);
                $idusuario = $usuid;
            } else {
                $dataUsu = array_merge($dataUsu, [
                    'verificar_telefono' => false,
                    'cambiar_password'   => false,
                    'cuenta'             => 'BERTHA',
                    'password'           => bcrypt('1234'),
                ]);

                $u = Usuario::create($dataUsu);
                $idusuario = $u->id;
            }

            $actividades = saveFormatMultiselect($data['actividad']);

            $token = generateTokenFicha(quitarTildes($data['nombres']), quitarTildes($data['apellidos']));

            $tieneVacuna = intval($data['tienevacuna']) >= 0 ? $data['tienevacuna'] : null;

            $video = null;
            if ($data['videointroduccionyoutube']){
                $video = str_replace("shorts","embed",$data['videointroduccionyoutube']);
            }

            $dataTra = [
                'tiene_vacuna'                  => $tieneVacuna,
                'video_introduccion_youtube'    => $video,
                'postulando_pais_id'            => $data['paispostulando'],
                'niveleducativo_id'             => $data['niveleducativo'],
                'direccion'                     => strtoupper($data['direccion']),
                'actividad_id'                  => $actividades,
                'idioma_id'                     => saveIdiomaFormatMultiselect($data['idioma']),
                'cama_adentro'                  => $mod['ca'],
                'cama_afuera'                   => $mod['cf'],
                'por_horas'                     => $mod['ph'],
                'departamento_id'               => $dom ? $dom['departamento'] : null,
                'provincia_id'                  => $dom ? $dom['provincia'] : null,
                'distrito_id'                   => $dom ? $dom['distrito'] : null,
                'usuario_id'                    => $idusuario,
                'numero_hijos'                  => $data['numhijos'],
                'edad_hijos'                    => $data['edadhijos'],
                'foto'                          => $foto,
                'contactos'                     => saveFormatContactos($data['contactos']),
                'verificaciones_laborales'      => saveFormatVerificaciones($verificacioneslaborales),
                'adjunto_educacion'             => saveFormatAdjuntoEducacion($data['adjuntoeducacion']),
                'adjunto_prueba_covid'          => $data['pruebacovid'] ? json_encode($data['pruebacovid']) : null,
                'adjunto_informe_covid'         => $data['informecovid'] ? json_encode($data['informecovid']) : null,
                'resultado_covid'               => $data['resultadocovid'] ?? null,
                'recibos'                       => $data['fotorecibo'] ?? null,
                'foto_documento_delantera'      => $data['fotodnidelantera'] ?? null,
                'foto_documento_posterior'      => $data['fotodnitrasera'] ?? null,
                'documento_vigente'             => $data['documentoVigente'],
                'estatuspostulante_id'          => ( $foto AND $data['fotodnidelantera'] ) ? 1 : 7,
                'token'                         => $token,
                'sueldo_promedio'               => getSueldoPromedio($actividades, $mod['ca'], $mod['cf'], $mod['ph'] ),
                'likes'                         => json_encode(["21.234.234.1","11.0.0.2","32.0.0.3","33.0.0.4","0.44.0.5","0.55.0.6","0.2.0.7","0.0.42.8","55.0.0.9","3.0.0.10"]),
                'historial_contacto'            => json_encode([])
            ];
            $work = almacenarToken($token, $idusuario, 'TRA');

            $t = Trabajador::create($dataTra);

            DB::commit();

            //$isVerificacionLaboralesAdjunto = checkUpdateAdjuntoVerificacionesLaborales(null, $verificacioneslaborales);

            saveCambioEstatusPostulante($t->id, $dataTra['estatuspostulante_id']);

            if ($nombresTrabajador){
                $passwordCERTI = mb_convert_case(cleaner(substr($nombresTrabajador, 0, 1)) . Str::random(5) . '-$-' . $t->id, MB_CASE_TITLE, "UTF-8") ;

                $r = Trabajador::where('id', $t->id)->update(['password_certi' => $passwordCERTI]);

                DB::commit();
            }

            return response()->json(['code' => 200, 'msj' => 'Postulante creado exitosamente']);

        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear postulante. Consulte al administrador' ]);
        }

    }

    public function ajaxEdit(ValidatePostulantesEdit $request){

        DB::beginTransaction();

        try {

            $data = $request->input('data');
            $firma = $request->input('firma');
            $id = $request->input('id');

            $checkaprobado = $data['checkaprobado'];

            $tipodocumento = $data['tipodocumento'];

            $tra = Trabajador::find($id);

            $estatusPostulante = $tra->estatuspostulante_id;

            $foto = $data['foto'] ?? null;

            $dom = getDepartamentoProvinciaDistrito($data['distrito']);
            $mod = getModalidades($data['modalidad']);

            $verificacioneslaborales = $data['verificaciones'];

            $nombresTrabajador = formatText($data['nombres']);
            $apellidosTrabajador = formatText($data['apellidos']);

            $isTheSameTrabajador = ValidateNombresApellidos($id, $nombresTrabajador, $apellidosTrabajador, 'trabajador');
            $telefonoTrabajador = formatText($data['telefono']);
            $whatsappTrabajador = formatText($data['telefonowhatsapp']);

            $dataUsu = [
                'nombres' => $nombresTrabajador,
                'apellidos' => $apellidosTrabajador,
                'genero_id' => $data['genero'],
                'tipodocumento_id' => $tipodocumento,
                'numero_documento' => $data['numerodocumento'],
                'estadocivil_id' => $data['estadocivil'],
                'fecha_nacimiento' => $data['fechanacimiento'] ? Carbon::parse($data['fechanacimiento']) : null,
                'paisnacimiento_id' => $data['paisprocedencia'],
                'nacionalidad_id' => $data['nacionalidad'],
                'departamentonacimiento_id' => $data['departamentonacimiento'],
                'lugar_nacimiento' => $data['lugarnacimiento'],
                'telefono' => removeSpaceNumber($telefonoTrabajador),
                'telefono_whatsapp' => removeSpaceNumber($whatsappTrabajador)
            ];

            $u = Usuario::where('id', $tra->usuario_id)->update($dataUsu);

            $actividades = saveFormatMultiselect($data['actividad']);
            $newToken = generateTokenFicha(quitarTildes($nombresTrabajador), quitarTildes($apellidosTrabajador));

            $tieneVacuna = intval($data['tienevacuna']) >= 0 ? $data['tienevacuna'] : null;
            $video = $data['videointroduccionyoutube'] ? str_replace("shorts","embed",$data['videointroduccionyoutube']) : null;

            $dataTra = [
                'aceptamascotas'                => $data['aceptamascotas'],
                'postulando_pais_id'            => $data['paispostulando'],
                'niveleducativo_id'             => $data['niveleducativo'],
                'direccion'                     => strtoupper($data['direccion']),
                'actividad_id'                  => $actividades,
                'idioma_id'                     => saveFormatMultiselect($data['idioma']),
                'cama_adentro'                  => $mod['ca'],
                'cama_afuera'                   => $mod['cf'],
                'por_horas'                     => $mod['ph'],
                'departamento_id'               => $dom ? $dom['departamento'] : null,
                'provincia_id'                  => $dom ? $dom['provincia'] : null,
                'distrito_id'                   => $dom ? $dom['distrito'] : null,
                'numero_hijos'                  => $data['numhijos'],
                'edad_hijos'                    => $data['edadhijos'],
                'foto'                          => $foto,
                'tiene_vacuna'                  => $tieneVacuna,
                'cartilla_verificada'           => $data['cartillaverificada'] ? ($data['cartillaverificada'] == true ? 1 : 0 ) : null,
                'verificaciones_laborales'      => saveFormatVerificaciones($verificacioneslaborales),
                'adjunto_educacion'             => saveFormatAdjuntoEducacion($data['adjuntoeducacion']),
                'adjunto_prueba_covid'          => $data['pruebacovid'] ? json_encode($data['pruebacovid']) : null,
                'adjunto_informe_covid'         => $data['informecovid'] ? json_encode($data['informecovid']) : null,
                'resultado_covid'               => $data['resultadocovid'] ?? null,
                'recibos'                       => $data['fotorecibo'] ?? null,
                'foto_documento_delantera'      => $data['fotodnidelantera'] ?? null,
                'foto_documento_posterior'      => $data['fotodnitrasera'] ?? null,
                'documento_vigente'             => $data['documentoVigente'],
                'estatuspostulante_id'          => '',
                'fecha_postulacion'             => $tra->fecha_postulacion ? Carbon::parse($tra->fecha_postulacion) : null,
                'certificado_antecedente'       => ($data['certificadoantecedente'] ? json_encode($data['certificadoantecedente']) : null),
                'certificado_antecedente_pdf'   => ($data['certificadoantecedentepdf'] ?? null),
                'certificado_antecedente_fecha' => ($data['fechaemisioncertificado'] ? Carbon::parse($data['fechaemisioncertificado']) : null ),
                'video_introduccion_youtube'    => $video,
                'sueldo_promedio'               => getSueldoPromedio($actividades, $mod['ca'], $mod['cf'], $mod['ph'] ),
                'token'                         => ($isTheSameTrabajador && $tra->token) ? $tra->token : $newToken,
            ];

            if (!($isTheSameTrabajador && $tra->token)) {
                almacenarToken($newToken, $tra->usuario_id, 'TRA');
            }

            $videointroduccionyoutube = $data['videointroduccionyoutube'];
            $fotodnidelantera = $data['fotodnidelantera'];

            if(in_array($estatusPostulante, [1,5,6,7,8]) ){

                $est = ($fotodnidelantera && $foto && $videointroduccionyoutube) ? 1 : 7;

                if ($checkaprobado) {
                    $dataTra['estatuspostulante_id'] = ($est === 1) ? 1 : 8;
                } else {
                    $dataTra['estatuspostulante_id'] = ($estatusPostulante == 8) ? 8 : $est;
                }

            }else{
                $dataTra['estatuspostulante_id'] = $estatusPostulante;
            }

            $userInterno = Auth::user()->id;

            if($userInterno == 1){

                $time = $tra->actualizado;
                $dataTra['actualizado'] = $time;

            }

            $t = Trabajador::where('id', $id)->update($dataTra);

            DB::commit();

            return response()->json(['code' => 200, 'msj' => 'Data actualizada exitosamente']);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al actualizar el postulante. Consulte al administrador' ]);

        }
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

    public function ajaxGetData(Request $request){

        $genero = $request->input('genero');
        $paispostulando = $request->input('paispostulando');
        $generos = Genero::borrado(false)->orderBy('nombre', 'asc')->get();
        $tiposdocumentos = TipoDocumento::borrado(false)->whereIn('id', [1,2,4,7,8,9,10])->orderBy('nombre', 'asc')->get();
        $estadosciviles = EstadoCivil::borrado(false)->orderBy('nombre', 'asc')->get();
        $niveleseducativos = NivelEducativo::borrado(false)->WhereNotNull('orden')->orderBy('orden', 'asc')->get();
        $niveleseducativosMX = NivelEducativo::borrado(false)->WhereNotNull('orden_mx')->orderBy('orden_mx', 'asc')->get();
        $paises = Pais::borrado(false)->whereIn('id', [4,7,8,10,11,13,15,16,18,20,22,31,32,34,49,50,52,53,54,57,58,67,68])->orderBy('nombre', 'asc')->get();
        $nacionalidades = Nacionalidad::borrado(false)->orderBy('nombre', 'asc')->get();
        $departamentos = Departamento::borrado(false)->whereIn('pais_id', [54])->orderBy('nombre', 'asc')->get();
        $idiomas = Idioma::orderBy('nombre', 'asc')->get();
        $parentescos = Parentesco::borrado(false)->orderBy('nombre', 'asc')->get();
        $tiposcertificados = TipoCertificado::borrado(false)->orderBy('nombre', 'asc')->get();
        $cantidades = createArrayCantidad(10, 0);
        $resultadoscovid = ResultadoCovid::borrado(false)->orderBy('orden', 'asc')->get();
        $userInterno = Auth::user()->id;
        $user = UsuarioInterno::find($userInterno);
        $nombreResponsable = getNombreCorto($user->nombres, $user->apellidos);

        return response()->json([
            'code' => 200,
            'generos' =>$generos,
            'tiposdocumentos' => $tiposdocumentos,
            'estadosciviles' => $estadosciviles,
            'niveleseducativos' => $niveleseducativos,
            'niveleseducativos_mx' => $niveleseducativosMX,
            'paises' =>$paises,
            'nacionalidades' => $nacionalidades,
            'departamentos' => $departamentos,
            'actividades' => formatMultiselectActividad($genero, $paispostulando),
            'idiomas' => formatMultiselectFixed($idiomas),
            'parentescos' => $parentescos,
            'bajas' => formatSelectMotivoBajas(),
            'tiposcertificados' => $tiposcertificados,
            'resultadoscovid' => $resultadoscovid,
            'cantidades' => $cantidades,
            'idResponsable' => $userInterno,
            'nombreResponsable' => mb_convert_case($nombreResponsable, MB_CASE_TITLE, "UTF-8"),
        ]);

    }
    public function ajaxGet(Request $request){

        $id = $request->input('id');

        if($id){

            $data = Trabajador::with('usuario')->find($id);
            $verificaciones = convertVerificacionesToObject($data->verificaciones_laborales);
            $adjuntoeducacion = convertAdjuntoEducacionToObject($data->adjunto_educacion);
            $actividad = convertToFormatMultiselectActividad($data->actividad_id, $data->postulando_pais_id);
            $idioma = $data->idioma_id ? convertToFormatMultiselectIdioma($data->idioma_id) : null;
            $historialbajas = TransaccionBajaView::where('trabajador_id', $id)->orderBy('creado', 'desc')->get();
            $usuario_id = Auth::user()->id;
            $dataUsuario = Usuario::find($data->usuario_id);

            $departamentos = Departamento::borrado(false)->where('pais_id', $dataUsuario->paisnacimiento_id)->orderBy('nombre', 'asc')->get();

            $urlWeb = config('webexperta.url-web');

            $linkfirma = getLinkFirma($id);
            $n = explode(" ", $data->usuario->nombres);

            $daysPast = $data->certificado_antecedente_fecha ? getDaysPast($data->certificado_antecedente_fecha) : null;

            return json_encode([
                'code' => 200,
                'data' => $data,
                'contact_name'  => $n[0] . ' ' . $data->usuario->apellidos ,
                'flag_emoji'    => $data->postulando_pais_id == 11 ? '🇨🇱' : '🇵🇪',
                'linkFirma' => $linkfirma,
                'actividad' => $actividad,
                'idioma' => $idioma,
                'distrito' => convertDistritoToObject($data->distrito_id),
                'diaspasadoscertificadoantecedente' => $daysPast,
                'verificaciones' => $verificaciones,
                'historialbajas' => $historialbajas,
                'adjuntoeducacion' => $adjuntoeducacion,
                'usuario_id' => $usuario_id,
                'departamentos' => $departamentos,
                'historialContacto' => convertHistorialContacto($data->historial_contacto),
            ]);

        }else{

            return json_encode(['code' => 500]);
        }

    }

    public function ajaxGetHistorialBajas(Request $request){
        $id = $request->input('id');

        $dataBajas = TransaccionBajaView::where('trabajador_id', $id)->orderBy('creado', 'desc')->get();
        $historialBajas = getHistorialBajaData($dataBajas);

        return response()->json([
            'code' => 200,
            'historialBajas' => $historialBajas,
            'tiposBajas' => formatSelectMotivoBajas(),
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

    public function ajaxSetContactadoPostulantes(Request  $request){
        $idPostulante = $request->input('id');
        $usuarioInterno = Auth::user()->id;
        $trabajador = Trabajador::find($idPostulante);
        $historial = json_decode($trabajador->historial_contacto);

        $dataHistorialContacto = [
            'usuarioInterno' => $usuarioInterno,
            'fecha' => Carbon::now()->format('d-m-Y'),
            'hora'  => Carbon::now()->format('h:m A'),
        ];

        array_push($historial, $dataHistorialContacto);

        DB::beginTransaction();

        try {

            $t = Trabajador::where('id',$idPostulante)->update(['historial_contacto' => json_encode($historial)]);

            DB::commit();

            return json_encode([
                'code' => 200,
                'historialContacto' => convertHistorialContacto(Trabajador::find($idPostulante)->historial_contacto),
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al registrar la data. Consulte al administrador' ]);
        }

    }

    public function ajaxCalcularLiquidacion(Request $request){
        DB::beginTransaction();

        try{

            //$nombres = Carbon::parse($request->input('nombres'));
            $monto = $request->input('monto');
            $fechaIngreso = Carbon::parse($request->input('fechaIngreso'));
            $fechaCese = Carbon::parse($request->input('fechaCese'));
            $sueldo = $request->input('sueldo');


            $calculoNuevaLey = calculoLiquidacion($fechaIngreso, $fechaCese, $sueldo, 'nueva');
            $calculoAntiguaLey = calculoLiquidacion($fechaIngreso, $fechaCese, $sueldo, 'antigua');

            $data = [
                'solicitante'           => 100,
                'fecha_ingreso'         => $fechaIngreso,
                'fecha_cese'            => $fechaCese,
                'sueldo'                => formatText($sueldo),
                'fecha'                 => Carbon::now(),
                'borrado'               => true,
                'monto_pagado'          => strval($monto),
                'fecha_pago_monto'      => Carbon::now()
            ];

            $exito = Beneficio::create($data);

            DB::commit();

            return response()->json([
                'code' => 200,
                'copyNuevaLey' => getCopyCalculoLiquidacion($calculoNuevaLey, 'nueva'),
                'copyAntiguaLey' => getCopyCalculoLiquidacion($calculoAntiguaLey, 'antigua'),
                'msj' => 'Reporte de beneficios creado exitosamente'
            ]);

        } catch (\Exception $e) {

            dd($e);

            DB::rollback();

            return response()->json(['code' => 500, 'msj' => 'Ocurrio un problema al crear reporte de beneficios. Consulte al administrador' ]);

        }
    }

    public function ajaxGetRegistroLiquidaciones(Request $request){
        $data = Beneficio::orderBy('id', 'desc')->get();

        $result = [];
        if ($data){

            foreach ($data as $d){

                $calculoNuevaLey = calculoLiquidacion($d->fecha_ingreso, $d->fecha_cese, $d->sueldo, 'nueva');
                $calculoAntiguaLey = calculoLiquidacion($d->fecha_ingreso, $d->fecha_pago_monto, $d->sueldo, 'antigua');

                $result[] = [
                    'copyNuevaLey'      => getCopyCalculoLiquidacion($calculoNuevaLey, 'nueva'),
                    'copyAntiguaLey'    => getCopyCalculoLiquidacion($calculoAntiguaLey, 'antigua'),
                    'fechaIngreso'      => Carbon::parse($d->fecha_ingreso)->format('d/m/Y'),
                    //'fechaIngreso'      => date_format($d->fecha_ingreso, 'd/m/Y'),
                    'fechaCese'         => Carbon::parse($d->fecha_cese)->format('d/m/Y'),
                    //'fechaCese'         => date_format($d->fecha_cese, 'd/m/Y'),
                    //'fechaPagado'       => date_format($d->fecha_pago_monto, 'd/m/Y'),
                    'fechaPagado'       => Carbon::parse($d->fecha_pago_monto)->format('d/m/Y'),
                    'monto'             => $d->monto_pagado,
                    'sueldo'            => intval($d->sueldo)
                ];

            }

            return json_encode([
                'code' => 200,
                'data' => $result,
            ]);
        }else{
            return json_encode(['code' => 500]);
        }

    }


}
