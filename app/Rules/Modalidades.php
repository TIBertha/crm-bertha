<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Modalidades implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value) {
            $fail('La modalidad es requerida');
            return;
        }

        foreach ($value as $m) {
            if (!empty($m['isChecked'])) {
                return; // Al menos una modalidad marcada → válido
            }
        }

        $fail('La modalidad es requerida');
    }
}

