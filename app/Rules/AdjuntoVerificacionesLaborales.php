<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AdjuntoVerificacionesLaborales implements ValidationRule
{
    private string $action;

    public function __construct(string $action)
    {
        $this->action = $action;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value) {
            return; // No hay verificaciones, no falla
        }

        foreach ($value as $v) {

            if (empty($v['nombre'])) {
                $fail('Debe completar el nombre del empleador en verificaciones laborales');
                return;
            }

            if (empty($v['distrito'])) {
                $fail('Debe completar el distrito en verificaciones laborales');
                return;
            }

            if (empty($v['telefono'])) {
                $fail('Debe completar el teléfono del empleador en verificaciones laborales');
                return;
            }

            if (empty($v['actividad'])) {
                $fail('Debe completar el campo actividad en verificaciones laborales');
                return;
            }
        }
    }
}

