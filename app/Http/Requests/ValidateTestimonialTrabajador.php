<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateTestimonialTrabajador extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize incoming data before validation.
     */
    protected function prepareForValidation(): void
    {
        $data = $this->input('data', []);

        $this->merge([
            'fecha'             => $data['fecha'] ?? null,
            'trabajador'        => $data['trabajador'] ?? null,
            'imagenTestimonial' => $data['imagenTestimonial'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'fecha'             => ['required'],
            'trabajador'        => ['required'],
            'imagenTestimonial' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha.required'             => 'La fecha de publicación es requerida',
            'trabajador.required'        => 'Debe seleccionar al trabajador, es requerido',
            'imagenTestimonial.required' => 'La captura de pantalla es requerida',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}
