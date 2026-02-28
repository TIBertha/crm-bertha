<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Horarios implements ValidationRule
{
    private string|int $modalidad;
    private string|int $frecuencia;

    public function __construct($modalidad = '', $frecuencia = '')
    {
        $this->modalidad = $modalidad;
        $this->frecuencia = $frecuencia;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Si no hay horarios, falla
        if (!$value) {
            $fail('Debe completar los horarios');
            return;
        }

        $cantidadDiasLaborales = 0;

        foreach ($value as $h) {

            $isDescanso  = $h['isDescanso']   ?? false;
            $horaIngreso = $h['horaingreso']  ?? null;
            $horaSalida  = $h['horasalida']   ?? null;

            // Contar días laborales
            if (!$isDescanso) {
                $cantidadDiasLaborales++;
            }

            // Validar horas en días laborales
            if (!$isDescanso) {

                if (empty($horaIngreso)) {
                    $fail('Debe completar las horas de ingreso en horarios');
                    return;
                }

                if (empty($horaSalida)) {
                    $fail('Debe completar las horas de salida en horarios');
                    return;
                }
            }
        }

        // Validación especial para modalidad 3
        if ($this->modalidad == 3) {
            if ($cantidadDiasLaborales != $this->frecuencia) {
                $fail('La cantidad de días laborales en el horario debe ser igual a la frecuencia de asistencia colocada');
                return;
            }
        }
    }
}


