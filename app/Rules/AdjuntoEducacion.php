<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AdjuntoEducacion implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value) {
            return; // No hay adjuntos, no falla
        }

        foreach ($value as $v) {

            if (empty($v['tipocertificado'])) {
                $fail('Debe completar el tipo de certificado de estudio');
                return;
            }

            if (empty($v['centro'])) {
                $fail('Debe completar el centro de estudio');
                return;
            }

            if (empty($v['titulo'])) {
                $fail('Debe completar el campo título en estudio');
                return;
            }
        }
    }
}

