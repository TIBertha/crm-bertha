<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Edades implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if (!$value) {
            $fail('El rango de edad es requerido');
            return;
        }

        foreach ($value as $m) {
            if (!empty($m['isChecked'])) {
                return;
            }
        }

        $fail('El rango de edad es requerido');
    }
}

