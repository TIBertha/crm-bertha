<?php

use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PostulantesController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\UploadsController;
use App\Http\Controllers\RequerimientosController;
use App\Http\Controllers\ContratosController;
use App\Http\Controllers\EmpleadoresController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\TestimonialTrabajadorController;
use App\Http\Controllers\TestimonialEmpleadorController;
use App\Http\Controllers\IndicadoresController;
use App\Http\Controllers\PrensaController;
use App\Http\Controllers\ReclamosController;
use App\Http\Controllers\CredencialesController;
use App\Http\Controllers\WebController;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Controllers\CreateStateCityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function(){
    Route::get('/', [LoginController::class, 'index'])->name('login');
    Route::post('/ajax-post-login', [LoginController::class, 'ajaxPostLogin']);
});

//ruta subir archivos
Route::post('/ajax-postulantes-adjunto', [UploadsController::class, 'ajaxUploadAdjunto']);
Route::post('/ajax-testimoniales-adjunto', [UploadsController::class, 'ajaxUploadAdjunto']);
Route::post('/ajax-prensa-adjunto', [UploadsController::class, 'ajaxUploadAdjunto']);
Route::post('/ajax-reclamos-adjunto', [UploadsController::class, 'ajaxUploadAdjunto']);
Route::post('/ajax-requerimientos-upload-adjunto-adelanto', [UploadsController::class, 'ajaxUploadAdjuntoAdelanto']);
Route::post('/ajax-upload-file', [UploadsController::class, 'ajaxUploadFile']);

Route::middleware(['auth'])->group(function () {

    //ruta de cierre de session
    Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

    //ruta de credenciales
    Route::get('/credenciales', [CredencialesController::class, 'index'])->name('credenciales');
    Route::get('/credenciales/new', [CredencialesController::class, 'viewNew'])->name('credenciales-new');
    Route::get('/credenciales/edit/{id}/', [CredencialesController::class, 'viewEdit']);
    Route::post('/ajax-credenciales-new', [CredencialesController::class, 'ajaxNew']);
    Route::post('/ajax-credenciales-edit', [CredencialesController::class, 'ajaxEdit']);
    Route::post('/ajax-refresh-credenciales', [CredencialesController::class, 'ajaxRefreshCredenciales']);
    Route::post('/ajax-credenciales-eliminar', [CredencialesController::class, 'ajaxEliminarCredencial']);
    Route::post('/ajax-credenciales-get', [CredencialesController::class, 'ajaxGet']);
    Route::post('/ajax-credenciales-buscar', [CredencialesController::class, 'ajaxBuscar']);

    //ruta de reclamos
    Route::get('/reclamos', [ReclamosController::class, 'index'])->name('reclamos');
    Route::get('/reclamos/new', [ReclamosController::class, 'viewNew'])->name('reclamos-new');
    Route::get('/reclamos/edit/{id}/', [ReclamosController::class, 'viewEdit']);
    Route::post('/ajax-reclamos-new', [ReclamosController::class, 'ajaxNew']);
    Route::post('/ajax-reclamos-edit', [ReclamosController::class, 'ajaxEdit']);
    Route::post('/ajax-refresh-reclamos', [ReclamosController::class, 'ajaxReclamos']);
    Route::post('/ajax-reclamos-get', [ReclamosController::class, 'ajaxGet']);
    Route::post('/ajax-reclamos-atendido', [ReclamosController::class, 'ajaxAtendido']);
    Route::post('/ajax-reclamos-atender', [ReclamosController::class, 'ajaxAtender']);
    Route::post('/ajax-reclamos-get-data', [ReclamosController::class, 'ajaxGetData']);
    //Route::post('/reclamo/impresion/{id}/', [ReclamosController::class, 'viewPrintReclamo']);
    //Route::post('/ajax-enviar-respuesta-reclamo', [ReclamosController::class, 'ajaxEnviarRespuestaReclamo']);
    Route::post('/ajax-get-reclamos-pendientes', [ReclamosController::class, 'ajaxGetReclamosPendientes']);
    Route::post('/ajax-get-domicilio-data', [MasterController::class, 'ajaxGetDomicilioData']);

    //ruta de prensa
    Route::get('/prensa', [PrensaController::class, 'index'])->name('prensa');
    Route::get('/prensa/new', [PrensaController::class, 'viewNew'])->name('prensa-new');
    Route::get('/prensa/edit/{id}/', [PrensaController::class, 'viewEdit']);
    Route::post('/ajax-prensa-new', [PrensaController::class, 'ajaxNew']);
    Route::post('/ajax-prensa-edit', [PrensaController::class, 'ajaxEdit']);
    Route::post('/ajax-prensa-get', [PrensaController::class, 'ajaxGet']);
    Route::post('/ajax-prensa-get-data', [PrensaController::class, 'ajaxGetData']);
    Route::post('/ajax-prensa-active', [PrensaController::class, 'ajaxActive']);
    Route::post('/ajax-prensa', [PrensaController::class, 'ajaxPrensa']);
    Route::post('/ajax-prensa-delete', [PrensaController::class, 'ajaxDelete']);
    Route::post('/ajax-refresh-prensa', [PrensaController::class, 'ajaxRefreshPrensa']);

    //ruta Indicadores
    Route::get('/indicadores', [IndicadoresController::class, 'index'])->name('indicadores');
    Route::post('/ajax-get-indicadores', [IndicadoresController::class, 'ajaxGetIndicadores']);

    //ruta de administrador
    Route::get('/usu-int', [AdministradorController::class, 'index'])->name('usuarios-internos');
    Route::get('/usu-int/new', [AdministradorController::class, 'viewNew']);
    Route::get('/usu-int/edit/{id}/', [AdministradorController::class, 'viewEdit']);
    Route::post('/ajax-administradores-new', [AdministradorController::class, 'ajaxNew']);
    Route::post('/ajax-administradores-edit', [AdministradorController::class, 'ajaxEdit']);
    Route::post('/ajax-refresh-usuarios-internos', [AdministradorController::class, 'ajaxRefreshUsuariosInternos']);
    Route::post('/ajax-administradores-get', [AdministradorController::class, 'ajaxGet']);
    Route::post('/ajax-administradores-get-data', [AdministradorController::class, 'ajaxGetData']);
    Route::post('/ajax-administradores-delete', [AdministradorController::class, 'ajaxDelete']);
    Route::post('/ajax-administradores-active', [AdministradorController::class, 'ajaxActive']);
    Route::post('/ajax-get-usuarios-internos', [AdministradorController::class, 'ajaxGetUsuariosInternos']);
    Route::post('/ajax-administradores-reset', [AdministradorController::class, 'ajaxResetPasswordUserInterno']);
    Route::post('/ajax-set-password-usuarios-internos', [AdministradorController::class, 'ajaxSetPasswordUsuarioInterno']);

    //ruta CreateStateCity
    Route::post('/ajax-get-paises', [CreateStateCityController::class, 'ajaxGetPaises']);
    Route::post('/ajax-save-estado', [CreateStateCityController::class, 'ajaxSaveEstado']);

    //ruta masters
    Route::post('/ajax-get-provincias-by-departamento', [MasterController::class, 'ajaxGetProvinciasByDepartamento']);
    Route::post('/ajax-get-distritos-by-provincia', [MasterController::class, 'ajaxGetDistritosByProvincia']);
    Route::post('/ajax-get-actividades-by-genero', [MasterController::class, 'ajaxGetActividadesByGenero']);
    Route::post('/ajax-get-actividades-list', [MasterController::class, 'ajaxGetActividadesList']);
    Route::post('/ajax-get-departamentos-by-nacionalidad', [MasterController::class, 'ajaxGetDepartamentosByNacionalidad']);
    Route::post('/ajax-get-alldistritos', [MasterController::class, 'ajaxGetAllDistritos']);
    Route::post('/ajax-search-user', [MasterController::class, 'ajaxSearchUser']);
    Route::post('/ajax-search-distrito', [MasterController::class, 'ajaxSearchDistrito']);
    Route::post('/ajax-search-distrito-experiencia', [MasterController::class, 'ajaxSearchDistritoExperiencia']);
    Route::post('/ajax-search-empleadores', [MasterController::class, 'ajaxSearchEmpleadores']);
    Route::post('/ajax-search-trabajadores-por-colocar', [MasterController::class, 'ajaxSearchTrabajadoresPorColocar']);

    //ruta de usuarios
    Route::post('/ajax-verificar-numero', [UsuarioController::class, 'ajaxVerificarNumero']);
    Route::post('/ajax-verificar-numero-documento', [UsuarioController::class, 'ajaxVerificarNumeroDocumento']);
    Route::post('/ajax-almacenar-tokens-varios', [UsuarioController::class, 'ajaxAlmacenarTokensVarios']);
    Route::post('/ajax-set-password-user', [UsuarioController::class, 'ajaxSetPasswordUser']);
    Route::post('/ajax-search-usuarios', [UsuarioController::class, 'ajaxSearchUsuarios']);
    Route::post('/ajax-registrar-usuario-postulante', [UsuarioController::class, 'ajaxRegistrarUsuarioPostulante']);

    //ruta de postulantes
    Route::get('/postulantes', [PostulantesController::class, 'index'])->name('postulantes');
    Route::get('/postulantes/new', [PostulantesController::class, 'viewNew'])->name('postulantes-new');
    Route::post('/ajax-postulantes-new', [PostulantesController::class, 'ajaxNew']);
    Route::get('/postulantes/edit/{id}/', [PostulantesController::class, 'ViewEdit']);
    Route::post('/ajax-postulantes-edit', [PostulantesController::class, 'ajaxEdit']);
    Route::post('/ajax-save-estatus-cul', [PostulantesController::class, 'ajaxSaveEstatusTieneCUL']);
    Route::post('/ajax-get-historial-bajas', [PostulantesController::class, 'ajaxGetHistorialBajas']);
    Route::get('/postulantes/ficha-postulante/{id}/', [PostulantesController::class, 'viewFicha']);
    Route::post('/ajax-set-contactado-postulantes', [PostulantesController::class, 'ajaxSetContactadoPostulantes']);
    Route::post('/ajax-calcular-liquidacion', [PostulantesController::class, 'ajaxCalcularLiquidacion']);
    Route::post('/ajax-get-registro-liquidacion', [PostulantesController::class, 'ajaxGetRegistroLiquidaciones']);
    Route::post('/ajax-postulantes-get-data-inicial', [PostulantesController::class, 'ajaxGetDataInicial']);
    Route::post('/ajax-postulantes-get-data', [PostulantesController::class, 'ajaxGetData']);
    Route::post('/ajax-postulantes-get', [PostulantesController::class, 'ajaxGet']);
    Route::post('/ajax-refresh-postulantes', [PostulantesController::class, 'ajaxRefreshPostulantes']);

    //ruta de empleadores
    Route::get('/empleadores', [EmpleadoresController::class, 'index'])->name('empleadores');
    Route::post('/ajax-refresh-empleadores', [EmpleadoresController::class, 'ajaxRefreshEmpleadores']);
    Route::post('/ajax-empleadores-get', [EmpleadoresController::class, 'ajaxGet']);
    Route::post('/ajax-empleadores-get-data', [EmpleadoresController::class, 'ajaxGetData']);
    Route::post('/ajax-empleadores-get-data-inicial', [EmpleadoresController::class, 'ajaxGetDataInicial']);
    Route::post('/ajax-empleadores-dt-active', [EmpleadoresController::class, 'ajaxDtActive']);
    Route::post('/ajax-empleadores-active', [EmpleadoresController::class, 'ajaxActive']);
    Route::post('/ajax-empleadores-eliminar', [MasterController::class, 'ajaxEliminarEmpleador']);
    Route::post('/ajax-empleadores-get-link-form-requerimiento', [EmpleadoresController::class, 'ajaxGetLinkFormRequerimiento']);
    Route::post('/ajax-empleadores-generate-link-form-requerimiento', [EmpleadoresController::class, 'ajaxGenerateLinkFormRequerimiento']);
    Route::post('/ajax-empleadores-remove-link-form-requerimiento', [EmpleadoresController::class, 'ajaxRemoveLinkFormRequerimiento']);
    Route::post('/ajax-empleadores-buscar', [EmpleadoresController::class, 'ajaxBuscar']);
    Route::get('/empleadores/new', [EmpleadoresController::class, 'viewNew'])->name('empleadores-new');
    Route::post('/ajax-empleadores-new', [EmpleadoresController::class, 'ajaxNew']);
    Route::get('/empleadores/edit/{id}/', [EmpleadoresController::class, 'ViewEdit']);
    Route::post('/ajax-empleadores-edit', [EmpleadoresController::class, 'ajaxEdit']);
    Route::post('/ajax-buscar-vinculos-empleador', [EmpleadoresController::class, 'ajaxBuscarVinculosEmpleador']);
    Route::post('/ajax-transferir-data-empleador', [EmpleadoresController::class, 'ajaxTransferirDataEmpleador']);
    Route::post('/ajax-eliminar-data-empleador', [EmpleadoresController::class, 'ajaxEliminarDataEmpleador']);

    //ruta de requerimientos
    Route::get('/requerimientos', [RequerimientosController::class, 'index'])->name('requerimientos');
    Route::get('/requerimientos/new', [RequerimientosController::class, 'viewNew'])->name('requerimientos-new');
    Route::post('/ajax-requerimientos-new', [RequerimientosController::class, 'ajaxNew']);
    Route::get('/requerimientos/edit/{id}/', [RequerimientosController::class, 'ViewEdit']);
    Route::post('/ajax-requerimientos-edit', [RequerimientosController::class, 'ajaxEdit']);
    Route::post('/ajax-get-postulaciones', [RequerimientosController::class, 'ajaxGetPostulaciones']);
    Route::post('/ajax-requerimientos-get-data', [RequerimientosController::class, 'ajaxGetData']);
    Route::post('/ajax-requerimientos-get-data-inicial', [RequerimientosController::class, 'ajaxGetDataInicial']);
    Route::post('/ajax-refresh-requerimientos', [RequerimientosController::class, 'ajaxRefreshRequerimientos']);
    Route::post('/ajax-requerimientos-buscar', [RequerimientosController::class, 'ajaxBuscar']);
    Route::post('/ajax-get-copys-requerimiento', [RequerimientosController::class, 'ajaxGetCopysRequerimiento']);
    Route::post('/ajax-postulaciones-remover', [RequerimientosController::class, 'ajaxPostulacionesRemover']);
    Route::post('/ajax-postulaciones-select-whatsapp', [RequerimientosController::class, 'ajaxPostulacionesSelectWhatsapp']);
    Route::post('/ajax-postulaciones-ascender', [RequerimientosController::class, 'ajaxPostulacionesAscender']);
    Route::post('/ajax-lista-postulantes-add', [RequerimientosController::class, 'ajaxListaPostulantesAdd']);
    Route::post('/ajax-action-add-postulante', [RequerimientosController::class, 'ajaxActionAddPostulante']);
    Route::post('/ajax-load-entrevistas-requerimiento', [RequerimientosController::class, 'ajaxLoadEntrevistasRequerimiento']);
    Route::post('/ajax-get-entrevistas-requerimiento', [RequerimientosController::class, 'ajaxGetEntrevistasRequerimiento']);
    Route::post('/ajax-cambiar-fechas-entrevista', [RequerimientosController::class, 'ajaxCambiarFechasEntrevista']);
    Route::post('/ajax-get-correo-empleador', [RequerimientosController::class, 'ajaxGetCorreoEmpleador']);
    Route::post('/ajax-requerimientos-get-modalidad', [RequerimientosController::class, 'ajaxGetModalidad']);
    Route::post('/ajax-duplicar-requerimiento', [RequerimientosController::class, 'ajaxDuplicarRequerimiento']);
    Route::post('/ajax-get-postulantes-antiguas-mostradas', [RequerimientosController::class, 'ajaxGetPostulantesAntiguasMostradas']);
    Route::post('/ajax-requerimientos-pendiente', [RequerimientosController::class, 'ajaxPendiente']);
    Route::post('/ajax-cambiar-estado-requerimientos', [RequerimientosController::class, 'ajaxCambiarEstadoReq']);
    Route::post('/ajax-entrevista-switch', [RequerimientosController::class, 'ajaxEntrevistaSwitch']);

    //ruta contratos
    Route::get('/contratos', [ContratosController::class, 'index'])->name('contratos');
    Route::get('/contratos/new', [ContratosController::class, 'viewNew'])->name('contratos-new');
    Route::get('/contratos/edit/{id}/', [ContratosController::class, 'viewEdit']);
    Route::post('/ajax-contratos-get', [ContratosController::class, 'ajaxGet']);
    Route::post('/ajax-contratos-get-data', [ContratosController::class, 'ajaxGetData']);
    Route::post('/ajax-refresh-contratos', [ContratosController::class, 'ajaxRefreshContratos']);
    Route::post('/ajax-contratos-new', [ContratosController::class, 'ajaxNew']);
    Route::post('/ajax-contratos-edit', [ContratosController::class, 'ajaxEdit']);
    Route::post('/ajax-contratos-get-data-inicial', [ContratosController::class, 'ajaxGetDataInicial']);
    Route::post('/ajax-get-data-modal-detalles-contrato', [ContratosController::class, 'ajaxGetDataModalDetallesContratos']);
    Route::post('/ajax-load-data-cambio-estados', [ContratosController::class, 'ajaxLoadDataCambioEstados']);
    Route::post('/ajax-save-data-cambios-estados-contratos', [ContratosController::class, 'ajaxSaveDataCambiosEstadosContratos']);
    Route::post('/ajax-get-copys-contrato', [ContratosController::class, 'ajaxGetCopysContratos']);
    Route::post('/ajax-exclude-postulante', [ContratosController::class, 'ajaxExcludePostulante']);
    Route::post('/ajax-get-contratos-requerimiento', [ContratosController::class, 'ajaxChangeRequerimiento']);
    Route::post('/ajax-get-contratos-requerimientos-domicilios', [ContratosController::class, 'ajaxGetRequerimientosDomicilios']);
    Route::post('/ajax-get-verificacion-por-dias', [ContratosController::class, 'ajaxGetVerificacionPorDias']);
    Route::post('/ajax-set-verif-ingreso-contrato', [ContratosController::class, 'ajaxSetVerificacionIngresoContrato']);

    //ruta masters
    Route::post('/ajax-search-distrito', [MasterController::class, 'ajaxSearchDistrito']);
    Route::post('/ajax-get-actividades-list', [MasterController::class, 'ajaxGetActividadesList']);
    Route::post('/ajax-set-distrito', [MasterController::class, 'ajaxSetDistrito']);
    Route::post('/ajax-set-divisa-pais', [MasterController::class, 'ajaxSetDivisaPais']);
    Route::post('/ajax-set-new-tipos-beneficios', [MasterController::class, 'ajaxSetNewTiposBeneficios']);
    Route::post('/ajax-save-new-empleador', [MasterController::class, 'ajaxSaveNewEmpleador']);
    Route::post('/ajax-save-new-domicilio-empleador', [MasterController::class, 'ajaxSaveNewDomicilioEmpleador']);

    //ruta testimoniales trabajador
    Route::get('/testimoniales-trabajador', [TestimonialTrabajadorController::class, 'index'])->name('testimoniales-trabajador');
    Route::get('/testimoniales-trabajador/new', [TestimonialTrabajadorController::class, 'viewNew'])->name('testimoniales-trabajador-new');
    Route::get('/testimoniales-trabajador/edit/{id}/', [TestimonialTrabajadorController::class, 'viewEdit']);
    Route::post('/ajax-testimoniales-trabajador-new', [TestimonialTrabajadorController::class, 'ajaxNew']);
    Route::post('/ajax-testimoniales-trabajador-edit', [TestimonialTrabajadorController::class, 'ajaxEdit']);
    Route::post('/ajax-testimoniales-trabajador-get', [TestimonialTrabajadorController::class, 'ajaxGet']);
    Route::post('/ajax-testimoniales-trabajador-get-data', [TestimonialTrabajadorController::class, 'ajaxGetData']);
    Route::post('/ajax-testimoniales-trabajador-active', [TestimonialTrabajadorController::class, 'ajaxActive']);
    Route::post('/ajax-refresh-testimoniales-trabajador', [TestimonialTrabajadorController::class, 'ajaxRefreshTestimoniales']);

    //ruta testimoniales empleador
    Route::get('/testimoniales-empleador', [TestimonialEmpleadorController::class, 'index'])->name('testimonial-empleador');
    Route::get('/testimoniales-empleador/new', [TestimonialEmpleadorController::class, 'viewNew'])->name('testimoniales-empleador-new');
    Route::get('/testimoniales-empleador/edit/{id}/', [TestimonialEmpleadorController::class, 'viewEdit']);
    Route::post('/ajax-testimoniales-empleador-new', [TestimonialEmpleadorController::class, 'ajaxNew']);
    Route::post('/ajax-testimoniales-empleador-edit', [TestimonialEmpleadorController::class, 'ajaxEdit']);
    Route::post('/ajax-testimoniales-empleador-get', [TestimonialEmpleadorController::class, 'ajaxGet']);
    Route::post('/ajax-testimoniales-empleador-get-data', [TestimonialEmpleadorController::class, 'ajaxGetData']);
    Route::post('/ajax-testimoniales-empleador-active', [TestimonialEmpleadorController::class, 'ajaxActive']);
    Route::post('/ajax-refresh-testimoniales-empleador', [TestimonialEmpleadorController::class, 'ajaxRefreshTestimoniales']);

});
