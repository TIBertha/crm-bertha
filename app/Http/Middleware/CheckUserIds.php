<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckUserIds
{
    public function handle($request, Closure $next, ...$ids)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->id, $ids)) {
            return redirect('/postulantes');
        }

        return $next($request);
    }
}
