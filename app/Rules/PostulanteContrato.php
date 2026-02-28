<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class PostulanteContrato implements ValidationRule
{
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if (is_array($value) && count($value) > 1) {
            $fail('Debe seleccionar un solo postulante');
        }
    }
}



