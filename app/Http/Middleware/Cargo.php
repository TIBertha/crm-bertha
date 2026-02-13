<?php

namespace App\Http\Middleware;

//use Closure, Auth;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cargo
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ... $roles){
        $rol = Auth::user()->rol_id;

        if(Auth::user()){
            return $next($request);
        }

        return redirect('/postulantes');

    }
}
