<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PostulantesController;
use App\Http\Middleware\RedirectIfAuthenticated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function(){
    Route::get('/', [LoginController::class, 'index'])->name('login');
    Route::post('/ajax-post-login', [LoginController::class, 'ajaxPostLogin']);
});

Route::middleware(['auth'])->group(function () {
    
    //ruta de postulantes
    Route::get('/postulantes', [PostulantesController::class, 'index'])->name('postulantes');
    Route::post('/ajax-postulantes-get-data-inicial', [PostulantesController::class, 'ajaxGetDataInicial']);
    Route::post('/ajax-refresh-postulantes', [PostulantesController::class, 'ajaxRefreshPostulantes']);

});