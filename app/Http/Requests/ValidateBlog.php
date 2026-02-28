<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateBlog extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'data' => $this->input('data', []),
        ]);
    }

    public function rules(): array
    {
        $imagen = $this->input('data.imagen');

        return [
            'data.fecha'        => ['required'],
            'data.titulo'       => ['required'],
            'data.contenido'    => ['nullable'],
            'data.imagen'       => [$this->imageRule($imagen)],
        ];
    }

    private function imageRule($imagen): string
    {
        // Si viene base64 → required
        // Si viene URL → required (mantener)
        // Si viene vacío → required
        return 'required';
    }

    public function messages(): array
    {
        return [
            'data.fecha.required'     => 'La fecha es requerida',
            'data.contenido.required' => 'El contenido es requerido',
            'data.imagen.required'    => 'La imagen (500x350) es requerida',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}

