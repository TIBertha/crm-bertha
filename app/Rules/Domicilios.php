<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Domicilios implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if (!$value) {
            return;
        }

        foreach ($value as $d) {

            $distrito  = $d['distrito']  ?? null;
            $direccion = $d['direccion'] ?? null;
            $latitud   = $d['latitud']   ?? null;
            $longitud  = $d['longitud']  ?? null;

            // Debe tener distrito y dirección
            if (empty($distrito) || empty($direccion)) {
                $fail('Por favor, complete los campos de domicilios con su respectiva latitud y longitud');
                return;
            }

            // Debe tener latitud y longitud
            if (empty($latitud) || empty($longitud)) {
                $fail('Por favor, complete los campos de domicilios con su respectiva latitud y longitud');
                return;
            }
        }
    }
}

