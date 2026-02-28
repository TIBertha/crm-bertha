<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateCredencial extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        // Garantiza que "data" siempre exista y evita errores si viene vacío
        $this->merge([
            'data' => $this->input('data', []),
        ]);
    }

    public function rules(): array
    {
        return [
            'data.nombrePlataforma' => ['required'],
            'data.usuario'          => ['required'],
            'data.contra'           => ['required'],
            'data.linkPlataforma'   => ['required', 'url'],
            'data.nivelCredencial'  => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'data.nombrePlataforma.required' => 'El nombre de la plataforma es requerido',
            'data.usuario.required'          => 'El usuario es requerido',
            'data.contra.required'           => 'La contraseña es requerida',
            'data.linkPlataforma.required'   => 'El enlace a la plataforma es requerido',
            'data.linkPlataforma.url'        => 'Debe ingresar un enlace válido',
            'data.nivelCredencial.required'  => 'El nivel de credencial es requerido',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}

