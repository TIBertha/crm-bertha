<?php

namespace App\Http\Requests;

use App\Rules\Horarios;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateRequerimientosNew extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalizamos el payload antes de validar
     */
    protected function prepareForValidation(): void
    {
        $data = $this->input('data', []);

        $this->merge([
            'empleador'      => $data['empleador']      ?? null,
            'actividad'      => (int) ($data['actividad'] ?? 0),
            'paispedido'     => (int) ($data['paispedido'] ?? 0),
            'modalidad'      => (int) ($data['modalidad'] ?? 0),
            'tipoempleador'  => (int) ($data['tipoempleador'] ?? 0),
            'cuarentena'     => (int) ($data['cuarentena'] ?? 0),
            'frecuencia'     => (int) ($data['frecuencia'] ?? 0),

            'nombres'        => $data['nombres'] ?? null,
            'apellidos'      => $data['apellidos'] ?? null,
            'telefono'       => $data['telefono'] ?? null,

            'tipovivienda'   => $data['tipovivienda'] ?? null,
            'numpisos'       => $data['numpisos'] ?? null,
            'numadultos'     => $data['numadultos'] ?? null,
            'edadadulto'     => $data['edadadulto'] ?? null,
            'numninos'       => $data['numninos'] ?? null,
            'edadninos'      => $data['edadninos'] ?? null,
            'nummascotas'    => $data['nummascotas'] ?? null,

            'sueldo'         => $data['sueldo'] ?? null,
            'valordiafrecuencia' => $data['valordiafrecuencia'] ?? null,

            'diaretorno'     => $data['diaretorno'] ?? null,
            'diasalida'      => $data['diasalida'] ?? null,
            'horaretorno'    => $data['horaretorno'] ?? null,
            'horasalida'     => $data['horasalida'] ?? null,

            'tipoBeneficio'  => $data['tipoBeneficio'] ?? null,
            'trabajador'     => $data['trabajador'] ?? null,
            'nacionalidad'   => $data['nacionalidad'] ?? null,
            'rangominimo'    => $data['rangominimo'] ?? null,
            'rangomaximo'    => $data['rangomaximo'] ?? null,
        ]);
    }

    /**
     * Reglas principales
     */
    public function rules(): array
    {
        return [
            ...$this->reglasTipoEmpleador(),
            ...$this->reglasActividad(),
            ...$this->reglasModalidad(),

            'actividad'     => ['required'],
            'modalidad'     => ['required'],
            'nacionalidad'  => ['required'],
            'rangominimo'   => ['required'],
            'rangomaximo'   => ['required'],
            'trabajador'    => ['nullable'],
        ];
    }

    /**
     * Reglas según tipo de empleador
     */
    private function reglasTipoEmpleador(): array
    {
        return match ($this->tipoempleador) {
            2 => [
                'empleador' => ['nullable'],
                'nombres'   => ['required'],
                'apellidos' => ['required'],
                'telefono'  => ['required', 'unique:usuarios,telefono'],
            ],
            default => [
                'empleador' => ['required'],
                'nombres'   => ['nullable'],
                'apellidos' => ['nullable'],
                'telefono'  => ['nullable'],
            ],
        };
    }

    /**
     * Reglas según actividad
     */
    private function reglasActividad(): array
    {
        return match ($this->actividad) {
            1, 5 => [
                'numadultos'   => 'required',
                'numpisos'     => 'required',
                'nummascotas'  => 'required',
                'tipovivienda' => 'required',
            ],
            9 => [
                'numadultos'   => 'required',
                'numpisos'     => 'required',
                'nummascotas'  => 'required',
            ],
            4 => [
                'numpisos'     => 'required',
                'tipovivienda' => 'required',
            ],
            2 => [
                'numadultos' => 'required',
            ],
            6, 7 => [
                'edadninos' => 'required',
            ],
            3, 10 => [
                'edadadulto' => 'required',
            ],
            8 => [
                'numninos'  => 'required',
                'numadultos'=> 'required',
            ],
            default => [],
        };
    }

    /**
     * Reglas según modalidad
     */
    private function reglasModalidad(): array
    {
        return match ($this->modalidad) {
            1 => [
                'sueldo' => ['required', 'gt:929'],
                'tipoBeneficio' => $this->paispedido == 54 ? 'required' : 'nullable',
                'diaretorno' => $this->cuarentena == 7 ? 'nullable' : 'required',
                'diasalida'  => $this->cuarentena == 7 ? 'nullable' : 'required',
                'horaretorno'=> $this->cuarentena == 7 ? 'nullable' : 'required',
                'horasalida' => $this->cuarentena == 7 ? 'nullable' : 'required',
            ],
            2 => [
                'sueldo' => ['required', 'gt:929'],
                'tipoBeneficio' => $this->paispedido == 54 ? 'required' : 'nullable',
            ],
            3 => [
                'frecuencia'         => ['required'],
                'valordiafrecuencia' => ['required', 'gt:69'],
            ],
            default => [],
        };
    }

    /**
     * Mensajes personalizados
     */
    public function messages(): array
    {
        return [
            'tipoBeneficio.required' => 'El tipo de beneficio es requerido',
            'empleador.required'     => 'El empleador es requerido',
            'nombres.required'       => 'El nombre del empleador es requerido',
            'apellidos.required'     => 'El apellido del empleador es requerido',
            'telefono.required'      => 'El teléfono es requerido',
            'telefono.unique'        => 'El teléfono ingresado ya se encuentra en uso',

            'actividad.required'     => 'La actividad es requerida',
            'modalidad.required'     => 'La modalidad es requerida',
            'nacionalidad.required'  => 'La nacionalidad es requerida',

            'sueldo.required'        => 'El sueldo es requerido',
            'sueldo.gt'              => 'El sueldo debe ser mayor al mínimo',

            'frecuencia.required'    => 'La frecuencia es requerida',
            'valordiafrecuencia.required' => 'El valor del día es requerido',
            'valordiafrecuencia.gt'  => 'El valor del día está por debajo del mínimo',

            'numpisos.required'      => 'El número de pisos es requerido',
            'numadultos.required'    => 'El número de adultos es requerido',
            'numninos.required'      => 'El número de niños es requerido',
            'nummascotas.required'   => 'El número de mascotas es requerido',
            'edadadulto.required'    => 'La edad del adulto es requerida',
            'edadninos.required'     => 'La edad de los niños es requerida',
        ];
    }

    /**
     * Respuesta JSON limpia en caso de error
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}

