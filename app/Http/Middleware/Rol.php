<?php

namespace App\Http\Middleware;

//use Closure, Auth;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Rol
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ... $roles): Response
    {
        $rol = Auth::user()->rol_id;

        if(Auth::user()){
            return $next($request);
        }

        return redirect('/postulantes');
    }
}
